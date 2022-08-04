import { format } from "winston";

export function createJsonFormat() {
  return format.json();
}
