import { AsyncLocalStorage } from "async_hooks";
import { format } from "winston";

export function createTraceIdFormat(store: AsyncLocalStorage<string>) {
  return format((info) => {
    info.traceId = store.getStore();

    return info;
  })();
}
