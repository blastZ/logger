import { AsyncLocalStorage } from "async_hooks";
import { format } from "winston";

export function createStoreFormat(
  store: AsyncLocalStorage<Record<string, unknown>>
) {
  return format((info) => {
    return {
      ...info,
      ...store.getStore(),
    };
  })();
}
