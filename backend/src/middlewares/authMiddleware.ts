import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors.js';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AuthError("Accesso negato. Token mancante.");
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string };

        req.user = decoded;
        next(); 
    } catch (error) {
        throw new AuthError("Sessione scaduta o Token non valido.");
    }
};

export const authenticateOptional = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Passa al controller come ospite
        return next();
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string };

        req.user = decoded;
        next();
    } catch(error) {
        next();
    }
};