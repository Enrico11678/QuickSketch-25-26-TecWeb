import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import * as wordService from '../services/wordService.js';

// Recupera l'elenco delle parole che l'utente non ha ancora disegnato.
export const getAvailableWords = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Estraggo l'Id dell'utente dal token
        const userId = req.user!.userId;

        // Chiamo il service
        const words = await wordService.getAvailableWordsForUser(userId);

        res.status(200).json({
            status: "success",
            results: words.length,
            data: { words }
        });
    } catch (error) {
        next(error);
    }
};