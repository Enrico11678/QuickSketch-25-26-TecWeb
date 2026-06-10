import { Router } from "express";
import { body, param } from "express-validator";
import { submitGuess, getMyGuessesForSketch } from "../controllers/guessController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

// Regole di validazione
const guessValidationRules = [
    body('sketchId').isInt().withMessage('ID sketch non valido'),
    body('attemptText').trim().notEmpty().withMessage('Il tentativo non può essere vuoto')
];

// Endpoint: POST /api/guesses
router.post('/', authenticateToken, validate(guessValidationRules), submitGuess);

// Endpoint: GET /api/guesses/sketch/:sketchId
router.get('/sketch/:sketchId', [
    param('sketchId').isInt().withMessage('ID sketch non valido')
], authenticateToken, validate([]), getMyGuessesForSketch);

export default router;