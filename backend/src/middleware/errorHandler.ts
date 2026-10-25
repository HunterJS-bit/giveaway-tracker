import { Request, Response, NextFunction } from 'express';
import loggerInstance from '../utils/logger';

/**
 * Custom error class for API errors with status codes.
 */
export class ApiError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * Async route handler wrapper that catches errors and forwards them
 * to the centralized error-handling middleware.
 *
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Centralized Express error-handling middleware.
 * Must be registered AFTER all routes.
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err instanceof ApiError ? err.message : 'Internal server error';

    // Log the full error for 5xx, but only a warning for 4xx
    if (statusCode >= 500) {
        loggerInstance.error({ err, method: req.method, url: req.url }, message);
    } else {
        loggerInstance.warn({ method: req.method, url: req.url, statusCode }, message);
    }

    res.status(statusCode).json({ error: message });
};
