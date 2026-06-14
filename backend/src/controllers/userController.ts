import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as userService from "../services/userService.js";

export const getMyStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const stats = await userService.getUserProfileStats(userId);

        res.status(200).json({
            status: "success",
            data: { stats }
        });
    } catch (error) {
        next(error);
    }
};

export const getPlayersLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const leaderboard = await userService.getTopPlayers(limit);

        res.status(200).json({
            status: "success",
            results: leaderboard.length,
            data: { leaderboard }
        });
    } catch (error) {
        next(error);
    }
};

export const getDesignersLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const leaderboard = await userService.getTopDesigners(limit);

        res.status(200).json({
            status: "success",
            results: leaderboard.length,
            data: { leaderboard }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        await userService.deleteUserAccount(userId);

        res.status(200).json({
            status: "success",
            message: "Account eliminato con successo."
        });
    } catch (error) {
        next(error);
    }
};