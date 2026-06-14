import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';

const router = Router();

const registerValidation = [
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('password').isLength({ min: 6 }).withMessage('La password deve essere di almeno 6 caratteri'),
    body('username').notEmpty().withMessage('Il nome utente è obbligatorio')
];

const loginValidation = [
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('password').notEmpty().withMessage('La password è obbligatoria')
];

// Endpoint: POST /api/auth/register
router.post('/register', validate(registerValidation), register);

// Endpoint: POST /api/auth/login
router.post('/login', validate(loginValidation), login);

export default router;