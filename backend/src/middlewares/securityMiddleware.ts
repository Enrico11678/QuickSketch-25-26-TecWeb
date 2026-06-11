import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Middleware per impostare header di sicurezza
export const securityHeaders = helmet();

// Middleware per limitare il numero di richieste
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // Massimo 100 richieste per IP
    skip: (req) => req.headers['x-playwright-test'] === 'true', // Salta il limite per i test
    message: "Troppe richieste, riprova tra 15 minuti."
});