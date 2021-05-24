import { Logger as WinstonLogger, LeveledLogMethod } from "winston";

import { LoggerLevel } from "./logger.enum";

export interface FileTransportOptions {
  level?: LoggerLevel;
  disableJsonFormat?: boolean;

  datePattern?: string;
  zippedArchive?: boolean;
  filename?: string;
  dirname?: string;
  stream?: NodeJS.WritableStream;
  maxSize?: string | number;
  maxFiles?: string | number;
  options?: string | Record<string, unknown>;
  auditFile?: string;
  frequency?: string;
  utc?: boolean;
  extension?: string;
  createSymlink?: boolean;
  symlinkName?: string;
}

export type FileLevel = LoggerLevel | FileTransportOptions;

export interface LoggerOptions {
  consoleLevel?: LoggerLevel | "none";
  fileLevel?: FileLevel | FileLevel[] | "none";
}

export interface Logger extends WinstonLogger {
  fatal: LeveledLogMethod;
  trace: LeveledLogMethod;
  child: (options: Object) => Logger;
}
