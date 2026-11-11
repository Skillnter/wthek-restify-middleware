import { KitHttpError, KitGeneralError } from "http-error-kit";
import { Next, Request, Response } from "restify";
import { INTERNAL_SERVER_ERROR } from "http-response-status-code";

/**
 * Configuration options for KitRestifyMiddleware.
 */
export interface IKitRestifyMiddlewareOptions {
    /**
     * Optional logger callback or boolean flag.
     * When set to `true`, errors are logged via `console.error`.
     * When set to a function, the function receives the error and request
     * for custom logging (e.g. Bunyan, Winston, Pino).
     *
     * @default false
     */
    // eslint-disable-next-line no-unused-vars
    log?: boolean | ((error: unknown, req: Request) => void);

    /**
     * If true, catches non-Kit errors and returns a structured 500 response
     * instead of passing raw unformatted errors to the next handler.
     *
     * @default false
     */
    handleUnknownErrors?: boolean;
}

/**
 * KitRestifyMiddleware is an error-handling middleware for Restify applications
 * powered by `http-error-kit`.
 *
 * It inspects errors emitted or passed to `next(err)` and, if they are instances
 * of `KitHttpError` or `KitGeneralError`, sends a structured JSON response with
 * the appropriate HTTP status code. If the error is not recognized, it forwards
 * the error to the next handler (or returns a structured 500 response when
 * `handleUnknownErrors` is enabled).
 *
 * @param {IKitRestifyMiddlewareOptions} [options] Optional configuration for the middleware.
 * @returns A Restify error-handling middleware function.
 *
 * @example
 * ```typescript
 * import restify from "restify";
 * import { KitRestifyMiddleware } from "@wthek/restify-middleware";
 *
 * const server = restify.createServer();
 * server.on("restifyError", KitRestifyMiddleware({ log: true }));
 * ```
 */
export function KitRestifyMiddleware(options?: IKitRestifyMiddlewareOptions) {
    const { log = false, handleUnknownErrors = false } = options ?? {};

    return (req: Request, res: Response, error: unknown, next: Next): void => {
        try {
            // Log the error when logging is enabled
            if (log) {
                if (typeof log === "function") {
                    log(error, req);
                } else {
                    console.error(error);
                }
            }

            // Bail out if headers have already been sent to avoid
            // ERR_HTTP_HEADERS_SENT crashes.
            if (res.headersSent) {
                return next();
            }

            if (
                error instanceof KitHttpError ||
                error instanceof KitGeneralError
            ) {
                // eslint-disable-next-line
                const statusCode = (error.getInputs()?.statusCode ??
                    INTERNAL_SERVER_ERROR) as number;
                res.status(statusCode);
                res.send(error.toJSON());
                return next();
            } else if (handleUnknownErrors) {
                res.status(INTERNAL_SERVER_ERROR as number);
                res.send({
                    statusCode: INTERNAL_SERVER_ERROR as number,
                    message: "Internal Server Error",
                });
                return next();
            } else {
                return next();
            }
        } catch (err) {
            return next();
        }
    };
}
