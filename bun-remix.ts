import {
	type RequestHandler,
	type ServerBuild,
	createRequestHandler,
} from "react-router";
import { resolve } from "node:path";
type CreateRequestHandlerArgs = {
	build:
		| ServerBuild
		| Promise<ServerBuild>
		| (() => ServerBuild | Promise<ServerBuild>);
	mode: "production" | "development";
};

/**
 * @param {CreateRequestHandlerArgs} args a {@link CreateRequestHandlerArgs} object
 * @returns a funtion that delegates the request to the remix server build
 * @author Professionalowo @link https://github.com/professionalowo
 * @since 1.0.0
 */
export async function handler({
	build: b,
	mode,
}: CreateRequestHandlerArgs): Promise<RequestHandler> {
	const build = await resolveBuild(b);
	const remix = createRequestHandler(build, mode);

	const assetDirectory = resolve(process.cwd(), build.assetsBuildDirectory);

	return async function (
		...[request, loadContext]: Parameters<RequestHandler>
	) {
		// Try to get the file from the assets build directory
		const { pathname } = new URL(request.url);
		const filePath = resolve(
			assetDirectory,
			`.${pathname}`
		);
		const file = Bun.file(filePath);
		// If the file exists, return it
		if (await file.exists()) return new Response(file);

		// Otherwise, delegate the request to the remix server build
		return remix(request, loadContext);
	};
}

/**
 * @param build - A promise of a remix server build, a function that returns a remix server build or a promise of a remix server build
 * @returns A promise that resolves to the remix build
 */
async function resolveBuild(
	build: CreateRequestHandlerArgs["build"]
): Promise<ServerBuild> {
	if (typeof build === "function") return await build();
	return build;
}

export { handler as createRequestHandler, type CreateRequestHandlerArgs };
