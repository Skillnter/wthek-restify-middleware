import { KitRestifyMiddleware } from "../src";
import { KitHttpError, KitHttpErrorConfig } from "http-error-kit";
import { KitGeneralError } from "http-error-kit/generic";
import { Request, Response, Next } from "restify";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-response-status-code";

describe("KitRestifyMiddleware", () => {
    let req: Request;
    let res: Response;
    let next: Next;

    beforeEach(() => {
        req = {} as Request;
        res = {
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should handle KitHttpError instance without formatted error", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should handle KitGeneralError instance without formatted error", () => {
        const error = new KitGeneralError(BAD_REQUEST, "Internal Server Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should handle KitHttpError instance with formatted error", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        KitHttpErrorConfig.configureFormatter(() => ({
            statusCode: BAD_REQUEST,
        }));
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should handle KitGeneralError instance with formatted error", () => {
        KitHttpErrorConfig.configureFormatter(() => ({
            statusCode: INTERNAL_SERVER_ERROR,
        }));
        const error = new KitGeneralError(
            INTERNAL_SERVER_ERROR,
            "Internal Server Error"
        );
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should fallback to INTERNAL_SERVER_ERROR when status code is missing", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        jest.spyOn(error, "getInputs").mockImplementation(() => undefined as any);
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should pass non-Kit error to next handler by default", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    it("should handle unexpected exception in catch block gracefully", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        jest.spyOn(error, "getInputs").mockImplementation(() => {
            throw new Error("Formatting failure");
        });
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });
});

describe("KitRestifyMiddleware - headersSent guard", () => {
    let req: Request;
    let res: Response;
    let next: Next;

    beforeEach(() => {
        req = {} as Request;
        res = {
            headersSent: true,
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should bail out when headers have already been sent for KitHttpError", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should bail out when headers have already been sent for non-Kit error", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe("KitRestifyMiddleware - logging option", () => {
    let req: Request;
    let res: Response;
    let next: Next;

    beforeEach(() => {
        req = {} as Request;
        res = {
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should log errors via console.error when log is true", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware({ log: true });
        middleware(req, res, error, next);
        expect(consoleSpy).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        consoleSpy.mockRestore();
    });

    it("should log errors via custom logger function", () => {
        const customLogger = jest.fn();
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware({ log: customLogger });
        middleware(req, res, error, next);
        expect(customLogger).toHaveBeenCalledWith(error, req);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    it("should not log errors when log is false (default)", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});

describe("KitRestifyMiddleware - handleUnknownErrors option", () => {
    let req: Request;
    let res: Response;
    let next: Next;

    beforeEach(() => {
        req = {} as Request;
        res = {
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should return structured 500 response for non-Kit errors when handleUnknownErrors is true", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware({ handleUnknownErrors: true });
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal Server Error",
        });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should forward to next when handleUnknownErrors is false (default)", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should still handle KitHttpError normally when handleUnknownErrors is true", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware({ handleUnknownErrors: true });
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
        expect(next).toHaveBeenCalledTimes(1);
    });
});
