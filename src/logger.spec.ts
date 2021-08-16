import { AsyncLocalStorage } from "async_hooks";
import { initLogger, logger, LoggerFactory } from "./index";
import { LoggerLevel } from "./logger.enum";

test("Console transport", async () => {
  const logger = new LoggerFactory({
    consoleLevel: LoggerLevel.Trace,
  }).getLogger();

  logger.fatal("fatal");
  logger.error("error");
  logger.warn("warn");
  logger.info("info");
  logger.debug("debug");
  logger.trace("trace");
});

test("File transport", async () => {
  const logger = new LoggerFactory({
    consoleLevel: "none",
    fileLevel: LoggerLevel.Trace,
  }).getLogger();

  logger.fatal("fatal");
  logger.error("error");
  logger.warn("warn");
  logger.info("info");
  logger.debug("debug");
  logger.trace("trace");
});

test("Multiple file transport", async () => {
  const logger = new LoggerFactory({
    consoleLevel: "none",
    fileLevel: [LoggerLevel.Trace, LoggerLevel.Error],
  }).getLogger();

  logger.fatal("fatal");
  logger.error("error");
  logger.warn("warn");
  logger.info("info");
  logger.debug("debug");
  logger.trace("trace");
});

test("Child logger", async () => {
  const logger = new LoggerFactory({
    consoleLevel: LoggerLevel.Trace,
  }).getLogger();

  const childLogger = logger.child({
    requestId: "xxxx-xxxx-xxx-xxxx",
  });

  childLogger.info("child logger");
});

test("Disable json format", async () => {
  const logger = new LoggerFactory({
    consoleLevel: "none",
    fileLevel: {
      level: LoggerLevel.Trace,
      disableJsonFormat: true,
      filename: "disable-json-format-%DATE%.log",
    },
  }).getLogger();

  logger.info("test");
});

test("Default logger", () => {
  logger.trace("test default logger before init");
  logger.info("test default logger");

  initLogger({ consoleLevel: LoggerLevel.Trace });

  logger.trace("test default logger after init");
});

test("Trace id", () => {
  const store = new AsyncLocalStorage();

  const logger = new LoggerFactory({
    consoleLevel: LoggerLevel.Trace,
    fileLevel: LoggerLevel.Trace,
    store,
  }).getLogger();

  store.run("1", () => {
    logger.trace("test1");
    logger.debug("test1:test1");
  });

  store.run("2", () => {
    logger.trace("test2");
    logger.debug("test2:test2");
  });
});
