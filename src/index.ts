import { hostname } from "os";
import { createLogger } from "winston";

import { LEVELS } from "./constants/index.js";
import { LoggerLevel } from "./enums/index.js";
import { Logger } from "./interfaces/index.js";

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

export * from "./enums/index.js";
export * from "./formats/index.js";
export * from "./interfaces/index.js";
export * from "./transports/index.js";
