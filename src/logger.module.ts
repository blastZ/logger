import chalk from "chalk";
import { format, createLogger, transports } from "winston";
import "winston-daily-rotate-file";
import { inspect } from "util";
import { hostname } from "os";

import { LoggerLevel } from "./logger.enum";
import { FileLevel, Logger, LoggerOptions } from "./logger.interface";
import { AsyncLocalStorage } from "async_hooks";

export class LoggerFactory {
  private logger: Logger;

  private levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };

  private defaultFileTransportOptions = {
    level: LoggerLevel.Trace,
    frequency: "24h",
    dirname: "./log/trace",
    datePattern: "YYYY-MM-DD-HH",
    maxSize: undefined,
    maxFiles: "30d",
  };

  constructor(options: LoggerOptions = {}) {
    this.logger = this.createDefaultLogger();

    this.setLogger(options);
  }

  private createTraceIdFormat(store: AsyncLocalStorage<unknown>) {
    return format((info) => {
      info.traceId = store.getStore();

      return info;
    })();
  }

  private createConsoleFormat() {
    const colorize = (inputLevel: string) => {
      const level = inputLevel.toUpperCase();
      let paint = chalk.white.cyan;

      switch (level) {
        case "FATAL":
          paint = chalk.white.bgRgb(255, 0, 185).bold;
          break;
        case "ERROR":
          paint = chalk.white.bgRed.bold;
          break;
        case "WARN":
          paint = chalk.white.bgRgb(200, 128, 0).bold;
          break;
        case "INFO":
          paint = chalk.white.bgBlue.bold;
          break;
        case "DEBUG":
          paint = chalk.white.bgRgb(0, 157, 37).bold;
          break;
        case "TRACE":
          paint = chalk.white.bgRgb(91, 0, 171).bold;
          break;
        default:
          paint = chalk.white.cyan;
      }

      return paint(` ${level} `);
    };

    const levelFormat = format((info) => {
      info.level = colorize(info.level);
      return info;
    });

    const outputFormat = format.printf((info) => {
      const message = Object.keys(info).reduce((result, key) => {
        result[key] = info[key];
        return result;
      }, {} as any);

      delete message.level;
      delete message.timestamp;

      return `${info.timestamp} ${info.level}\n${inspect(message, {
        colors: true,
        depth: 8,
        breakLength: 1,
      })}`;
    });

    return format.combine(levelFormat(), format.timestamp(), outputFormat);
  }

  private createFileFormat(disableJsonFormat = false) {
    if (disableJsonFormat) {
      return this.createConsoleFormat();
    }

    return format.combine(format.timestamp(), format.json());
  }

  private createDefaultLogger() {
    const logger = createLogger({
      levels: this.levels,
      format: undefined,
      defaultMeta: {
        hostname: hostname(),
        pid: process.pid,
      },
      transports: [],
    }) as Logger;

    return logger;
  }

  private mountFileTransport(
    fileLevel: FileLevel,
    store?: AsyncLocalStorage<unknown>
  ) {
    if (typeof fileLevel === "string") {
      const fileFormat = this.createFileFormat();
      const loggerFormat = store
        ? format.combine(this.createTraceIdFormat(store), fileFormat)
        : fileFormat;

      this.logger.add(
        new transports.DailyRotateFile({
          ...this.defaultFileTransportOptions,
          filename: "%DATE%.log",
          dirname: `./log/${fileLevel}`,
          level: fileLevel,
          format: loggerFormat,
        })
      );
    }

    if (typeof fileLevel === "object") {
      const fileFormat = this.createFileFormat(fileLevel.disableJsonFormat);
      const loggerFormat = store
        ? format.combine(this.createTraceIdFormat(store), fileFormat)
        : fileFormat;

      if (!fileLevel.stream && !fileLevel.filename) {
        fileLevel.filename = "%DATE%.log";
      }

      if (fileLevel.level && !fileLevel.dirname) {
        fileLevel.dirname = `./log/${fileLevel.level}`;
      }

      this.logger.add(
        // @ts-ignore
        new transports.DailyRotateFile({
          ...this.defaultFileTransportOptions,
          ...fileLevel,
          format: loggerFormat,
        })
      );
    }
  }

  getLogger() {
    return this.logger;
  }

  setLogger = (options: LoggerOptions = {}) => {
    this.logger.clear();

    const {
      consoleLevel = LoggerLevel.Info,
      fileLevel = "none",
      store,
    } = options;

    if (consoleLevel === "none" && fileLevel === "none") {
      this.logger.configure({
        silent: true,
      });

      return this.logger;
    }

    if (
      consoleLevel !== "none" &&
      Object.keys(this.levels).includes(consoleLevel)
    ) {
      const consoleFormat = this.createConsoleFormat();

      this.logger.add(
        new transports.Console({
          level: consoleLevel,
          format: store
            ? format.combine(
                this.createTraceIdFormat(store),
                this.createConsoleFormat()
              )
            : consoleFormat,
        })
      );
    }

    if (fileLevel !== "none") {
      if (Array.isArray(fileLevel)) {
        fileLevel.forEach((o) => {
          this.mountFileTransport(o, store);
        });
      } else {
        this.mountFileTransport(fileLevel, store);
      }
    }

    return this.logger;
  };
}

const loggerFactory = new LoggerFactory();

export function initLogger(options: LoggerOptions) {
  loggerFactory.setLogger(options);
}

function getLogger() {
  return loggerFactory.getLogger();
}

export const logger = getLogger();
