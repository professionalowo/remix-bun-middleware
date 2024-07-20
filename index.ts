import type { MiddlewareHandler } from "hono";
import { createRequestHandler, type CreateRequestHandlerArgs } from "bun-remix";

export function remixMiddleware(
  args: CreateRequestHandlerArgs
): MiddlewareHandler {
  return async function ({ req }) {
    return createRequestHandler(args)(req.raw);
  };
}
