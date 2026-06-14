import { database } from "../Database.js";
import { Guess, Word, User, Sketch } from "../models/index.js";
import { BadRequestError, GameRuleError, NotFoundError } from "../utils/errors.js";
import { getSketchesByIdWithWord } from "./sketchService.js";

// Funzioni principali
export const makeGuess = async (userId: number, sketchId: number, attemptText: string) => {
    validateGuessText(attemptText);

    const sketchData = await getSketchesByIdWithWord(sketchId) as any; // cast as any per fare sketchData.word.text abilmente.
    const solutionText = sketchData.word.text;

    const previousAttemptsCount = await checkGameRulesAndGetAttempts(userId, sketchId, sketchData.authorId);

    const isCorrect = isGuessWinning(attemptText, solutionText);

    const newGuess = await saveGuessAndStats(userId, sketchId, sketchData.authorId, attemptText, isCorrect, previousAttemptsCount);

    return {
        guess: newGuess,
        isCorrect,
        attemptsLeft: 10 - (previousAttemptsCount + 1),
        solution: (isCorrect || previousAttemptsCount === 9) ? solutionText : null 
    };
}; 

export const getMyGuessesForSketch = async (userId: number, sketchId: number) => {
    return await Guess.findAll({
        where: { userId, sketchId },
        attributes: ['id', 'attemptText', 'isCorrect', 'createdAt'],
        order: [['createdAt', 'ASC']]
    });
};

// Funzioni ausiliarie
const validateGuessText = (text: string) => {
    if (!text || text.trim() === '') {
        throw new BadRequestError("Il testo del tentativo non può essere vuoto.");
    }
};

const checkGameRulesAndGetAttempts = async (userId: number, sketchId: number, authorId: number): Promise<number> => {
    if (userId === authorId) throw new GameRuleError("Non puoi provare a indovinare il tuo stesso disegno.");

    const previousGuesses = await Guess.findAll({ 
        where: { userId, sketchId }, attributes: ['isCorrect'] 
    });
    const attemptsCount = previousGuesses.length;

    if (previousGuesses.some(g => g.isCorrect)) throw new GameRuleError("Hai già indovinato la parola per questo sketch.");
    if(attemptsCount >= 10) throw new GameRuleError("Hai esaurito i 10 tentativi a disposizione per questo sketch.");

    return attemptsCount;
};

const isGuessWinning = (attempt: string, solution: string): boolean => {
    return attempt.trim().toLowerCase() === solution.trim().toLowerCase();
};

// Esegue la transazione sul Database e aggiorna le stats (Lo faccio nella stessa funzione per la logica o tutto o niente: altrimenti rischierei di avere stats falsate)
const saveGuessAndStats = async (userId: number, sketchId: number, authorId: number, attemptText: string, isCorrect: boolean, previousAttemptsCount: number) => {
    const t = await database.transaction();

    try {
        const newGuess = await Guess.create(
            { userId, sketchId, attemptText: attemptText.trim(), isCorrect }, 
            { transaction: t }
        );

        await User.increment('totalAttemptsUsed', 
            { by: 1, where: { id: userId }, transaction: t 
        });

        if (isCorrect) {
            await User.increment('guessedCount', 
                { by: 1, where: { id: userId }, transaction: t
            });
            await User.increment('drawingsGuessedCount', 
                { by: 1, where: { id: authorId }, transaction: t
            });
        } else if (previousAttemptsCount === 9) {
            // SBagliato ed era l'ultimo tentativo
            await User.increment('failedCount', 
                { by: 1, where: { id: userId }, transaction: t
            });
        }

        await t.commit();
        return newGuess;
    } catch(error) {
        await t.rollback();
        throw error;
    }
};