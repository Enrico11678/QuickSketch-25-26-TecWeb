import { Router } from "express";
import { submitGuess, getMyGuessesForSketch } from "../controllers/guessController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Endpoint: POST /api/guesses
router.post('/', authenticateToken, submitGuess);

// Endpoint: GET /api/guesses/sketch/:sketchId
router.get('/sketch/:sketchId', authenticateToken, getMyGuessesForSketch);

export default router;