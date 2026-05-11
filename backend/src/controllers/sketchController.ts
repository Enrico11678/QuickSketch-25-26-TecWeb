import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as sketchService from "../services/sketchService.js"

// Salva un nuovo disegno realizzato dall'utente
// Richiede autenticazione
export const createSketch = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { wordId, content } = req.body;
        const userId = req.user!.userId;

        const newSketch = await sketchService.createSketch(userId, Number(wordId), content); // wordId proviene dal body quindi forziamo Number()

        res.status(201).json({
            status: "success",
            data: { sketch: newSketch }
        });
    } catch(error) {
        next(error);
    }
};

// Recupera la galleria degli sketch
// Se loggato: filtra i propri e quelli completati/esauriti
// Se ospite: mostra tutto (senza soluzione).
export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let sketches;

        if (authReq.user) {
            sketches = await sketchService.getPlayableSketches(authReq.user.userId);
        } else {
            sketches = await sketchService.getAllSketchesForGuests();
        }

        res.status(200).json({
            status:"success",
            results: sketches.length,
            data: { sketches }
        });
    } catch(error) {
        next(error);
    }
};

// Recupera un singolo sketch per Id (dettagli Sketch)
export const getSketchDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sketch = await sketchService.getSketchesByIdSafe(Number(id));

        res.status(200).json({
            status: "success", 
            data: { sketch }
        });
    } catch(error) {
        next(error);
    }
};

// Recupera gli scketches creati dall'utente corrente
export const getMySketches = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const sketches = await sketchService.getMySketches(userId);

        res.status(200).json({
            status: "success",
            results: sketches.length,
            data: { sketches }
        });
    } catch(error) {
        next(error);
    }
};