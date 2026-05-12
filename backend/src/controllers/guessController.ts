import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as guessService from "../services/guessService.js";

export const submitGuess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { sketchId, attemptText } = req.body;

        // Chiamo il service per fare il tentativo
        const result = await guessService.makeGuess(userId, sketchId, attemptText);

        res.status(201).json({
            status: "success",
            data: result
        });
    } catch(error) {
        next(error);
    }
};

export const getMyGuessesForSketch = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const sketchId = Number(req.params.sketchId);

        // Chiamo il service per ottenere lo storico
        const guesses = await guessService.getMyGuessesForSketch(userId, sketchId);

        res.status(200).json({
            status: "success",
            results: guesses.length,
            data: { guesses }
        });
    } catch(error) {
        next(error);
    }
};