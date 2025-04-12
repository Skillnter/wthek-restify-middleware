import { KitRestifyMiddleware } from "../src"; // Adjust path as needed
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
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should handle KitHttpError instance without formatted error", () => {
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const middleware = KitRestifyMiddleware();
        console.log(error);
        middleware(req, res, error, next);
        console.log(error);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
    });

    it("should handle KitGeneralError instance without formatted error", () => {
        const error = new KitGeneralError(BAD_REQUEST, "Internal Server Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(error.toJSON());
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
    });

    it("should handle non-KitHttpError/KitGeneralError instance", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    it("should handle error with next function", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    it("should handle error with catch block", () => {
        const error = new Error("Unknown Error");
        const middleware = KitRestifyMiddleware();
        middleware(req, res, error, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
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
    });
});

describe("KitRestifyMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {} as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should handle KitHttpError instance with formatted error", () => {
        KitHttpErrorConfig.configureFormatter(() => ({
            statusCode: INTERNAL_SERVER_ERROR,
        }));
        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const mockConfig = jest
            .spyOn(error, "getInputs")
            .mockImplementation(() => {
                return undefined;
            });
        const middleware = KitRestifyMiddleware();

        middleware(req as Request, res as Response, error, next as Next);

        expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
    });

    it("should handle KitHttpError instance with formatted error", () => {
        const demoError = new Error("Mocked Error");

        const error = new KitHttpError(BAD_REQUEST, "Bad Request");
        const mockConfig = jest
            .spyOn(error, "getInputs")
            .mockImplementation(() => {
                throw demoError;
            });
        const middleware = KitRestifyMiddleware();

        middleware(req as Request, res as Response, error, next as Next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });
});
