import { User } from "../models/User.js";
import { literal, Op } from "sequelize";
import { NotFoundError } from "../utils/errors.js";

// Statistiche personali dell'utente
export const getUserProfileStats = async (userId: number) => {
    const user = await User.findByPk(userId, {
        attributes: [
            'id',
            'username',
            'email',
            'drawingsCount',
            'drawingsGuessedCount',
            'guessedCount',
            'failedCount',
            'totalAttemptsUsed'
        ]
    });

    if (!user) {
        throw new NotFoundError("Utente");
    }

    return user;
};

// Classifica migliori giocatori (Chi ha indovinato più parole: i primi 10)
export const getTopPlayers = async (limit: number = 10) => {
    return await User.findAll({
        attributes: [ 'id', 'username', 'guessedCount'],
        where: {
            guessedCount: { [Op.gt]: 0 } // Mostriamo solo chi ha indovinato almeno una aprola
        },
        order: [
            ['guessedCount', 'DESC'],        // 1° Criterio: Parole indovinate (Decrescente)
            ['failedCount', 'ASC'],          // 2° Criterio (Spareggio): Meno fallimenti (Crescente)
            ['totalAttemptsUsed', 'ASC']     // 3° Criterio (Spareggio): Meno tentativi usati (Crescente)
        ],
        limit
    });
};

// Classifica migliori disegnatori (percentuale di successo)
export const getTopDesigners = async (limit: number = 10) => {
    return await User.findAll({
        attributes: [
            'id',
            'username',
            'drawingsCount',
            'drawingsGuessedCount',
            // Chiediamo al Database di calcolare la percentuale 
            [
                literal('ROUND(("drawings_guessed_count" * 100.0) / "drawings_count", 2)'), // ROUND serve ad arrotondare il numero decimale in max 2 decimali
                'successRate' // Il nome del campo che arriverà nel JSON
            ]
        ],
        where: {
            drawingsCount: { [Op.gt]: 0 } // Escludiamo chi non ha mai disegnato per evitare divisioni per zero.
        },
        order: [
            [literal('("drawings_guessed_count" * 100.0) / "drawings_count"'), 'DESC'], // Ordine decrescente per percentuale
            ['drawingsCount', 'DESC'] // A parità di percentuale vince chi ha disegnato di più
        ],
        limit
    });
};

export const deleteUserAccount = async (userId: number) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError("Utente non trovato");
    }

    // Grazie a 'onDelete: SET NULL', Sequelize aggiornerà automaticamente 
    // tutti gli sketch dell'utente impostando author_id a NULL nel database.
    await user.destroy();
    return true;
};