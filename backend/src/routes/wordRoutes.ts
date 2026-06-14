import { Router } from 'express';
import { getAvailableWords } from '../controllers/wordController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';

const router = Router();

// Endpoint: GET /api/words
router.get('/', authenticateToken, validate([]), getAvailableWords);

export default router;