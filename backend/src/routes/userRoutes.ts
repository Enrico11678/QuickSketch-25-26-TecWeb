import { Router } from "express";
import { query } from "express-validator";
import { getMyStats, getPlayersLeaderboard, getDesignersLeaderboard, deleteAccount } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

// Regole di validazione per i limiti delle classifiche
const leaderboardRules = [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Il limite deve essere un numero tra 1 e 100')
];

// Rotte pubbliche (Classifiche)

// Endpoint: GET /api/users/leaderboard/players
router.get('/leaderboard/players', validate(leaderboardRules), getPlayersLeaderboard);

// Endpoint: GET /api/users/leaderboard/designers
router.get('/leaderboard/designers', validate(leaderboardRules), getDesignersLeaderboard);

// Rotte private (Statistiche personali)

// Endpoint: GET /api/users/me/stats
router.get('/me/stats', authenticateToken, getMyStats);

// Endpoint: GET /api/users/me
router.delete('/me', authenticateToken, deleteAccount);

export default router;