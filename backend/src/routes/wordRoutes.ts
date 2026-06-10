import { Router } from 'express';
import { getAvailableWords } from '../controllers/wordController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';

const router = Router();

// Endpoint: GET /api/words
// Solo gli utenti loggati possono vedere l'elenco delle parole da disegnare
router.get('/', authenticateToken, validate([]), getAvailableWords);

export default router;