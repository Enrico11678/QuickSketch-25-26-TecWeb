import { Router } from 'express'
import { login, register } from '../controllers/authController.js'

const router = Router();

// Endpoint: POST /api/auth/register
router.post('/register', register);

// Endpoint: POST /api/auth/login
router.post('/login', login);

export default router;