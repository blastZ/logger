import { format, transports } from "winston";
import { LoggerLevel } from "../enums";

import {
  createLevelFormat,
  createMessageFormat,
  createTimestampFormat,
  createTraceIdFormat,
} from "../formats";
import { ConsoleTransportOptions } from "../interfaces";

export function createConsoleTransport(options: ConsoleTransportOptions = {}) {
  const formats = [
    createLevelFormat(),
    createTimestampFormat(),
    createMessageFormat(),
  ];

  if (options.traceIdStore) {
    formats.unshift(createTraceIdFormat(options.traceIdStore));
  }

  return new transports.Console({
    level: options.level || LoggerLevel.Info,
    format: format.combine(...formats),
  });
}
