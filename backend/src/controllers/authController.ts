import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/userService.js'

// Controller per la registrazione di un nuovo utente
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Chiamo il service passando il body della richiesta
        const newUser = await userService.createUser(req.body);

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
        const { user, token } = await userService.loginUser(req.body);

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