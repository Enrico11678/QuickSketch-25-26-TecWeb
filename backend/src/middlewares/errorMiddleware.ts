import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Errore interno del server";

    console.error(`[ERROR ${statusCode}]: ${err.stack}`);

    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        description: message
    });
};