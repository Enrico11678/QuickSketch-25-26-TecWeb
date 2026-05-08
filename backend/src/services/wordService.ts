import { Word, Sketch } from '../models/index.js';
import { Op } from 'sequelize';

export const getAvailableWordsForUser = async (userId: number) => {
    // Trovo gli Id delle parole già usate dall'utente
    const userSketches = await Sketch.findAll({
        where: { authorId: userId },
        attributes: ['wordId'],
        raw: true
    });

    // Trasformo l'array di oggetti in un aray di numeri
    const usedWordIds = userSketches.map(s => s.wordId);

    // Se l'utente ha già usato delle parole, le escludiamo.
    // Altrimenti restituiamo tutte le parole.
    const whereCondition = usedWordIds.length > 0
        ? { id: { [Op.notIn]: usedWordIds } }   // Op operatore di confronto di sequelize
        : {};

    return await Word.findAll({
        where: whereCondition,
        attributes: ['id', 'text'],
        order: [['text', 'ASC']]
    });
};