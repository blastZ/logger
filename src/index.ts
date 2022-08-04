import { hostname } from "os";
import { createLogger } from "winston";

import { LEVELS } from "./constants";
import { LoggerLevel } from "./enums";
import { Logger } from "./interfaces";

export const logger = createLogger({
  level: LoggerLevel.Info,
  levels: LEVELS,
  format: undefined,
  defaultMeta: {
    host: hostname(),
    pid: process.pid,
  },
  transports: [],
}) as Logger;

export * from "./enums";
export * from "./formats";
export * from "./interfaces";
export * from "./transports";
