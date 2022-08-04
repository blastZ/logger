import { inspect } from "util";
import { format } from "winston";

export function createMessageFormat() {
  const messageFormat = format.printf((info) => {
    const message = Object.keys(info).reduce((result, key) => {
      result[key] = info[key];
      return result;
    }, {} as any);

    delete message.level;
    delete message.timestamp;

    return `${info.timestamp} ${info.level}\n${inspect(message, {
      colors: true,
      depth: 8,
      breakLength: 1,
    })}`;
  });

  return messageFormat;
}
