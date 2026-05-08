import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { BadRequestError, ConflictError, AuthError } from '../utils/errors.js'

// Funzione principale per la registrazione
export const createUser = async (userData: any) => {
    const { username, email, password } = userData;

    // Validazione presenza dati
    if (!username || !email || !password) {
        throw new BadRequestError("Dati mancanti per la registrazione.");
    }

    // Validazione policy password
    validatePasswordPolicy(password);

    // Controllo unicità
    await ensureUniqueness(email, username);

    // Hashing
    const hashedPassword = await hashUserPassword(password);

    // Creazione User
    return await User.create({
        username,
        email, 
        password: hashedPassword
    });
};

// Funzione principale di Login
export const loginUser = async (loginData: any) => {
    const { email, password } = loginData;

    // Validazione presenza dati
    if (!email || !password) {
        throw new BadRequestError("Email e password sono obbligatorie.");
    }

    // Recupero utente dal database
    const user = await findUserByEmail(email);

    // Verifica password
    await verifyPassword(password, user.password);

    // Creazione sessione
    const token = generateUserToken(user.id, user.email);

    return { user, token };
};

// Funzioni ausiliari per la registrazione

// Verifica complessità della password
const validatePasswordPolicy = (password: string): void => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
        throw new BadRequestError(
            "La password deve essere di almeno 6 caratteri e contenere almeno un numero e un carattere speciale (!@#$%^&*)."
        );
    }
};

// Controlla se le credenziali sono già in uso
const ensureUniqueness = async (email: string, username: string): Promise<void> => {
    const existingUser = await User.findOne({
        where: { [Symbol.for('or') as any]: [{ email }, { username }] }
    });

    if (existingUser) {
        throw new ConflictError("Username o Email già occupati.");
    }
};

// Funzione di hash della password
const hashUserPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10); // il valore '10' (Salt Rounds) rappresenta un equilibrio ideale tra Sicurezza e Performance: 2^10 iterazioni.
};

// Funzioni ausiliari per il Login

// Cerca l'utente nel database tramite email
const findUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    if(!user) {
        throw new AuthError("Credenziali non valide.");
    }
    return user;
};

// Confronta la password inserita con quella hashata nel database
const verifyPassword = async (password: string, hash: string): Promise<void> => {
    const isMatch = await bcrypt.compare(password, hash);
    if(!isMatch) {
        throw new AuthError("Credenziali non valide.");
    }
};

// Genera un token JWT firmato per l'utente
const generateUserToken = (userId: number, email: string): string => {
    const jwtSecret = process.env.JWT_SECRET as string;

    return jwt.sign(
        { userId, email },
        jwtSecret,
        { expiresIn: '24h' }
    );
};