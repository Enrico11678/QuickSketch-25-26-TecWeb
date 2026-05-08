import { Router } from 'express';
import { getAvailableWords } from '../controllers/wordController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint: GET /api/words
// Solo gli utenti loggati possono vedere l'elenco delle parole da disegnare
router.get('/', authenticateToken, getAvailableWords);

export default router;