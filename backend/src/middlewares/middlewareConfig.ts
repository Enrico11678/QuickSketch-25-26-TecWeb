import { Application, json } from "express";
import cors from "cors";
import { securityHeaders, apiLimiter } from "./securityMiddleware.js";

export const applyGlobalMiddlewares = (app: Application) => {
    app.use(securityHeaders); 
    app.use(cors());          
    app.use(json());          
    app.use('/api/', apiLimiter); 
};