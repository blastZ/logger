import { AsyncLocalStorage } from "async_hooks";
import {
  createConsoleTransport,
  createFileTransport,
  logger,
  LoggerLevel,
} from "../src";

describe("logger", () => {
  it("should work with console transport", () => {
    logger.clear().add(createConsoleTransport({ level: LoggerLevel.Trace }));

    logger.fatal("fatal");
    logger.error("error");
    logger.warn("warn");
    logger.info("info");
    logger.debug("debug");
    logger.trace("trace");
  });

  it("should work with file transport", () => {
    logger
      .clear()
      .add(createFileTransport({ level: LoggerLevel.Trace }))
      .add(createFileTransport({ level: LoggerLevel.Error }));

    logger.fatal("fatal");
    logger.error("error");
    logger.warn("warn");
    logger.info("info");
    logger.debug("debug");
    logger.trace("trace");
  });

  it("should work with file transport (disable json output)", () => {
    logger
      .clear()
      .add(
        createFileTransport({ level: LoggerLevel.Trace, jsonOutput: false })
      );

    logger.error("error");
  });

  it("should work with child logger", () => {
    logger.clear().add(createConsoleTransport());

    logger.child({ stage: "test" }).info("test");
  });

  it("should work with trace id store", () => {
    const store = new AsyncLocalStorage<string>();

    logger.clear().add(createConsoleTransport({ traceIdStore: store }));

    store.run("xxx", () => {
      logger.info("test");
    });
  });
});
