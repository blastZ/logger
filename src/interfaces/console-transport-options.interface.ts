import { AsyncLocalStorage } from "async_hooks";
import { LoggerLevel } from "../enums";

export interface ConsoleTransportOptions {
  level?: LoggerLevel; // info
  traceIdStore?: AsyncLocalStorage<string>;
}
