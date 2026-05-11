// La base: ogni errore deve avere un codice HTTP
export class AppError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Errori di Autenticazione (401)
export class AuthError extends AppError {
    constructor(message: string = "Credenziali non valide o sessione scaduta") {
        super(message, 401);    // 401 Unauthorized
    }
}

// Errori di logica di gioco (403)
export class GameRuleError extends AppError {
    constructor(message: string = "Azione non consentita dalle regole del gioco") {
        super(message, 403);    // 403 Forbidden
    }
}

// Errori di risorsa non trovata
export class NotFoundError extends AppError {
    constructor(resource: string = "Risorsa") {
        super(`${resource} non trovato/a`, 404);    // 404 Not found 
    }
}

// Errore per dati mancanti o malformati (400)
export class BadRequestError extends AppError {
    constructor(message: string = "Richiesta non valida") {
        super(message, 400);
    }
}

// Errore per duplicati nel database (409)
export class ConflictError extends AppError {
    constructor(message: string = "Risorsa già esistente") {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = "Errore di validazione dei dati.") {
        super(message, 422); // 422 Unprocessable Entity
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Non hai i permessi per eseguire questa azione.") {
        super(message, 403); 
    }
}

export class ServerError extends AppError {
    constructor(message: string = "Errore interno del server.") {
        super(message, 500);
    }
}