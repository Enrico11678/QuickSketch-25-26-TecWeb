import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors.js';

// Definisco un tipo personalizzato per includere l'utente nella Request
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Leggo l'header 'Authorization
    const authHeader = req.headers['authorization'];

    // Estrae il token dall'header 'Authorization' (formato: "Bearer <token>").
    // L'operatore && evita errori se l'header è assente; split(' ')[1] isola il token dalla parola 'Bearer'.
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AuthError("Accesso negato. Token mancante.");
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string;

        // Verifico il token usando la chiave segreta
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string };

        // Attacco i dati dell'utente alla richiesta, così che i controller sapranno chi sta facendo l'azione.
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
        // Nessun token fornito passa al controller come ospite (req.user resta undefined)
        return next();
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string };

        // Token valido: popola req.user così il controller sa che sei loggato
        req.user = decoded;
        next();
    } catch(error) {
        // Token fornito ma non valido (es. scaduto): passi lo stesso come ospite
        // invece di lanciare un errore.
        next();
    }
};