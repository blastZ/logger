import * as dotenv from "dotenv";

dotenv.config();

import { AsyncLocalStorage } from "async_hooks";

import {
  createConsoleTransport,
  createFileTransport,
  createSlsLogTransport,
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

    logger.child({ stage: "test" }).trace("test");
  });

  it("should work with trace id store", () => {
    const store = new AsyncLocalStorage<string>();

    logger.clear().add(createConsoleTransport({ traceIdStore: store }));

    store.run("xxx", () => {
      logger.info("test");
    });
  });

  it("should work with sls log transport", () => {
    logger
      .clear()
      .add(createConsoleTransport({ level: LoggerLevel.Trace }))
      .add(
        createSlsLogTransport({
          level: "trace",
          endpoint: process.env.SLS_LOG_ENDPOINT!,
          accessKeyId: process.env.SLS_LOG_KEY!,
          secretAccessKey: process.env.SLS_LOG_SECRET!,
          apiVersion: "2015-06-01",
          projectName: process.env.SLS_LOG_PROJECT_NAME!,
          logStoreName: process.env.SLS_LOG_LOG_STORE_NAME!,
          topic: "cool",
          source: "app-a",
        })
      );

    logger.debug({
      target: "project",
    });

    logger
      .child({
        sls: {
          projectName: process.env.SLS_LOG_PROJECT_NAME_2!,
          logStoreName: process.env.SLS_LOG_LOG_STORE_NAME_2!,
          topic: "hey",
          source: "app-b",
        },
      })
      .debug({
        target: "project2",
      });
  });
});
