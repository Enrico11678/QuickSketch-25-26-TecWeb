import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

// Controlla se le regole di validazione sono state rispettate
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Esegue tutte le regole di validazione definite nella rotta
        for (let validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Se ci sono errori, lancia l'errore personalizzato che il server gestirà
            return next(new ValidationError(errors.array()[0].msg));
        }
        next();
    };
};