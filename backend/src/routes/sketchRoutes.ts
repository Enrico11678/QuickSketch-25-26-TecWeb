import { Router } from "express";
import { body, param } from "express-validator";
import * as sketchController from '../controllers/sketchController.js';
import { authenticateToken, authenticateOptional } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

// Regole
const createSketchRules = [
    body('wordId').isInt().withMessage('ID parola non valido'),
    body('content').trim().notEmpty().withMessage('Il contenuto è obbligatorio')
];

// Endpoint: POST /api/sketches
router.post('/', authenticateToken, validate(createSketchRules), sketchController.createSketch);

// Endpoint: GET /api/sketches/me
router.get('/me', authenticateToken, sketchController.getMySketches);

// Endpoint: GET /api/sketches/playable
router.get('/playable', authenticateToken, sketchController.getPlayableSketches);

//Endpoint: GET /api/sketches/:id
router.get('/:id', [param('id').isInt().withMessage('ID non valido')], validate([]), sketchController.getSketchDetails);

// Endpoint: GET /api/sketches
/// Usiamo authenticateOptional qui perchè anche chi non è loggato deve poter vedere la galleria degli sketches.
// Se non l'avessimo usato gli utenti loggati sarebbero stati trattati come guests.
router.get('/', authenticateOptional, sketchController.getGallery);

export default router;