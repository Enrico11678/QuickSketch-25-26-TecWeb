import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const securityHeaders = helmet();

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // Massimo 100 richieste per IP
    skip: (req) => req.headers['x-playwright-test'] === 'true', // Salta il limite per i test
    message: "Troppe richieste, riprova tra 15 minuti."
});