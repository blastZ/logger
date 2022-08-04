import { AsyncLocalStorage } from "async_hooks";
import { GeneralDailyRotateFileTransportOptions } from "winston-daily-rotate-file";

import { LoggerLevel } from "../enums";

export interface FileTransportOptions
  extends GeneralDailyRotateFileTransportOptions {
  level?: LoggerLevel; // trace
  jsonOutput?: boolean; // true
  traceIdStore?: AsyncLocalStorage<string>;
}
