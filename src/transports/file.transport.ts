import { format, transports } from "winston";
import "winston-daily-rotate-file";

import { LoggerLevel } from "../enums";
import {
  createJsonFormat,
  createLevelFormat,
  createMessageFormat,
  createTimestampFormat,
  createTraceIdFormat,
} from "../formats";
import { FileTransportOptions } from "../interfaces";

export function createFileTransport(options: FileTransportOptions = {}) {
  const formats =
    options.jsonOutput === false
      ? [createLevelFormat(), createTimestampFormat(), createMessageFormat()]
      : [createTimestampFormat(), createJsonFormat()];

  if (options.traceIdStore) {
    formats.unshift(createTraceIdFormat(options.traceIdStore));
  }

  return new transports.DailyRotateFile({
    level: LoggerLevel.Trace,
    frequency: "3h",
    dirname: options.level ? `./log/${options.level}` : `./log/trace`,
    datePattern: "YYYY-MM-DD-HH",
    maxSize: undefined,
    maxFiles: "7d",
    filename: (options.stream ? undefined : "%DATE%.log") as any,
    format: format.combine(...formats),
    ...options,
  });
}
