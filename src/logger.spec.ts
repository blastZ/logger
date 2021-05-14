import { NicoLogger } from "./index";
import { LoggerLevel } from "./logger.enum";

test("Console transport", async () => {
  const logger = new NicoLogger({
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
  const logger = new NicoLogger({
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
  const logger = new NicoLogger({
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
  const logger = new NicoLogger({
    consoleLevel: LoggerLevel.Trace,
  }).getLogger();

  const childLogger = logger.child({
    requestId: "xxxx-xxxx-xxx-xxxx",
  });

  childLogger.info("child logger");
});
