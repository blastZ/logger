import { format } from "winston";

export function createTimestampFormat() {
  return format.timestamp();
}
