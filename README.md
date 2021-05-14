# Nico Logger

Node.js logger based on [winston](https://github.com/winstonjs/winston).

## Install

```bash
$ npm install @blastz/nico-logger
```

## Logging levels

The logger support six loggin levels

```ts
const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
```

## Consle transport

Set `consoleLevel` to enable console transport

```ts
import { NicoLogger, LoggerLevel } from "@blastz/nico-logger";

const logger = new NicoLogger({
  consoleLevel: LoggerLevel.Debug,
}).getLogger();

logger.debug("test");
```

Console transport will output logs with such format

```bash
2021-05-14T06:30:02.421Z  INFO
{
  message: 'test',
  hostname: 'OMEN',
  pid: 32684
}
```

## File transport

Set `fileLevel` to enable file transport

```ts
import { NicoLogger, LoggerLevel } from "@blastz/nico-logger";

const logger = new NicoLogger({
  fileLevel: LoggerLevel.Trace,
}).getLogger();

logger.debug("test");
```

File transport will log with json format

```bash
{"message":"trace","level":"trace","hostname":"OMEN","pid":762,"timestamp":"2021-05-14T06:51:59.894Z"}
```

All options in [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file) are supported by `fileLevel` options.

### Multiple file transport

Set multiple levels file logging is supported.

```ts
import { NicoLogger, LoggerLevel } from "@blastz/nico-logger";

const logger = new NicoLogger({
  fileLevel: [LoggerLevel.Trace, LoggerLevel.Error],
}).getLogger();

logger.debug("test");
```

It will create two folds `error` and `trace`

- log
  - error
  - trace

The error fold will only include loggin files that logging level is above `error`.

## License

Licensed under MIT
