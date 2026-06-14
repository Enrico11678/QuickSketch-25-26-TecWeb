import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/authService.js'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newUser = await authService.createUser(req.body);

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
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { user, token } = await authService.loginUser(req.body);

        res.status(200).json({
            status: "success",
            message: "Login effettuato!",
            data: {
                token,  
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