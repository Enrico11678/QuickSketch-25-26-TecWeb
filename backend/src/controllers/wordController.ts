import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import * as wordService from '../services/wordService.js';

export const getAvailableWords = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

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