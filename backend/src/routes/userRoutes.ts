import { Router } from "express";
import { getMyStats, getPlayersLeaderboard, getDesignersLeaderboard, deleteAccount } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotte pubbliche (Classifiche)

// Endpoint: GET /api/users/leaderboard/players
router.get('/leaderboard/players', getPlayersLeaderboard);

// Endpoint: GET /api/users/leaderboard/designers
router.get('/leaderboard/designers', getDesignersLeaderboard);

// Rotta privata (Statistiche personali)

// Endpoint: GET /api/users/me/stats
router.get('/me/stats', authenticateToken, getMyStats);

// Endpoint: GET /api/users/me
router.delete('/me', authenticateToken, deleteAccount);

export default router;