import { LoggerLevel } from "../enums/index.js";
import { BaseOptions } from "./base-options.interface.js";

export interface ConsoleTransportOptions extends BaseOptions {
  level?: LoggerLevel; // info
}
