import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as sketchService from "../services/sketchService.js"

export const createSketch = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { wordId, content } = req.body; // restituisce una stringa json
        const userId = req.user!.userId;

        // Casting Number(wordId) perchè nel nbody era una stringa
        const newSketch = await sketchService.createSketch(userId, Number(wordId), content); 

        res.status(201).json({
            status: "success",
            data: { sketch: newSketch }
        });
    } catch(error) {
        next(error);
    }
};

export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let sketches;

        if (authReq.user) {
            sketches = await sketchService.getGallerySketchesForUser(authReq.user.userId);
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

export const getPlayableSketches = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        
        const sketches = await sketchService.getPlayableSketches(userId);

        res.status(200).json({
            status: "success",
            results: sketches.length,
            data: { sketches }
        });
    } catch(error) {
        next(error);
    }
};