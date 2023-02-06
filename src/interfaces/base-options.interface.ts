import { AsyncLocalStorage } from "async_hooks";
import { LoggerLevel } from "../enums/index.js";

export interface BaseOptions {
  level?: LoggerLevel;
  store?: AsyncLocalStorage<Record<string, unknown>>;
}
