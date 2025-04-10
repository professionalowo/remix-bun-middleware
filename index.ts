import type { MiddlewareHandler } from "hono";
import { createRequestHandler, type CreateRequestHandlerArgs } from "./bun-remix";

/**
 *
 * @param args {@link CreateRequestHandlerArgs}
 * @returns a {@link MiddlewareHandler} that proxies requests to a Remix app
 *
 * @example
 * ```ts
 *  const app = new Hono();
 *
 *  const build = import(
 *  "../build/server/index.js"
 *  ) as unknown as Promise<ServerBuild>;
 *
 *  app.all(
 *      await remixMiddleware({
 *        build,
 *        mode: Bun.env.NODE_ENV as "production" | "development",
 *      }),
 *  );
 * ```
 */
export async function remixMiddleware(
  args: CreateRequestHandlerArgs,
  loadContext?: Parameters<RequestHandler>[1]
): Promise<MiddlewareHandler> {
  const handler = await createRequestHandler(args);
  return async function ({ req }) {
    return handler(req.raw, loadContext);
  };
}

type RequestHandler = Awaited<ReturnType<typeof createRequestHandler>>;
