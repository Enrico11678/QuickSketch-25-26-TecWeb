import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/authService.js'
import { BadRequestError } from '../utils/errors.js';

// Controller per la registrazione di un nuovo utente
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Chiamo il service passando il body della richiesta
        const newUser = await authService.createUser(req.body);

        // Risposta con successo
        // Restituisce solo i dati necessari, mai la password
        res.status(201).json({
            status: "success",
            message: "Utente creato con successo!",
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        /* Se il service lancia un BadRequestError o un ConflictError
        lo passa al middleware di index.ts che manderà la risposta
        d'errore formattata.
        */

        next(error);
    }
};

// Controller per il Login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Chiamo il service passando il body della richiesta
        const { user, token } = await authService.loginUser(req.body);

        // Risposta con il token
        res.status(200).json({
            status: "success",
            message: "Login effettuato!",
            data: {
                token,  // Il client lo userà per le prossime chiamate
                user: {
                    id: user.id,
                    username: user.username
                }
            }
        });
    } catch (error) {
        next(error);
    }
};