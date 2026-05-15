import { Router } from "express";
import * as sketchController from '../controllers/sketchController.js';
import { authenticateToken, authenticateOptional } from "../middlewares/authMiddleware.js";

const router = Router();

// Endpoint: POST /api/sketches
router.post('/', authenticateToken, sketchController.createSketch);

// Endpoint: GET /api/sketches/me
router.get('/me', authenticateToken, sketchController.getMySketches);

//Endpoint: GET /api/sketches/:id
router.get('/:id', sketchController.getSketchDetails);

// Endpoint: GET /api/sketches
/// Usiamo authenticateOptional qui perchè anche chi non è loggato deve poter vedere la galleria degli sketches.
// Se non l'avessimo usato gli utenti loggati sarebbero stati trattati come guests.
router.get('/', authenticateOptional, sketchController.getGallery);

export default router;