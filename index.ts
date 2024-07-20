import type { MiddlewareHandler } from "hono";
import { createRequestHandler, type CreateRequestHandlerArgs } from "bun-remix";

export async function remixMiddleware(
  args: CreateRequestHandlerArgs
): Promise<MiddlewareHandler> {
  const handler = await createRequestHandler(args);
  return async function ({ req }) {
    return handler(req.raw);
  };
}
