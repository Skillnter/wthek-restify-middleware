import { KitHttpError, KitGeneralError } from "http-error-kit";
import { Next, Request, Response } from "restify";
import { INTERNAL_SERVER_ERROR } from "http-response-status-code";

/**
 * Middleware function for Restify to handle errors using `http-error-kit`.
 *
 * This middleware is designed to catch errors that are instances of `KitHttpError`
 * or `KitGeneralError`. It retrieves the status code from the error's inputs and
 * sends a response with that status code and the error details. If the error is not
 * recognized or another exception occurs, it passes control to the next middleware.
 *
 * @returns A Restify middleware function to handle and format errors.
 */
export function KitRestifyMiddleware() {
    return (req: Request, res: Response, error: any, next: Next): void => {
        try {
            if (
                error instanceof KitHttpError ||
                error instanceof KitGeneralError
            ) {
                const statusCode = (error.getInputs()?.statusCode ||
                    INTERNAL_SERVER_ERROR) as number;
                res.status(statusCode);
                res.send(error.toJSON());
                return next();
            } else {
                return next();
            }
        } catch (err) {
            return next();
        }
    };
}
