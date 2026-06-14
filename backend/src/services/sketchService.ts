import { Sketch, User, Word, Guess } from "../models/index.js";
import { fn, Op, col, where } from "sequelize";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export const createSketch = async (userId: number, wordId: number, content: string) => {
    if (!content || content.trim() === '') {
        throw new BadRequestError("Il contenuto dello sketch non può essere vuoto.");
    }

    const wordExists = await Word.findByPk(wordId);
    if (!wordExists) {
        throw new NotFoundError("Parola selezionata");
    }

    const alreadyDrawn = await Sketch.findOne({
        where: {
            authorId: userId,
            wordId: wordId
        }
    });

    if (alreadyDrawn) {
        throw new BadRequestError("Hai già realizzato un disegno per questa parola.");
    }
    
    const newSketch = await Sketch.create({
        authorId: userId,
        wordId: wordId,
        content: content
    });

    await User.increment('drawingsCount', {
        by: 1,
        where: { id: userId }
    });

    return newSketch;
};

// Recupera gli Sketch che l'utente può effettivamente giocare escludendo:
// 1. Quelli creati dall'utente stesso.
// 2. Quelli già indovinati
// 3. Quelli dove sono già stati raggiunti i 10 tentativi (falliti).
export const getPlayableSketches = async (userId: number) => {
    const [solvedIds, exhaustedIds] = await Promise.all([
        getSolvedSketchIds(userId),
        getExhaustedSketchIds(userId)
    ]);

    const excludedIds = [...new Set([...solvedIds, ...exhaustedIds])];
    const where = buildPlayableCriteria(userId, excludedIds);

    return await Sketch.findAll({
        where,
        attributes: ['id', 'content', 'authorId', 'createdAt'],
        include: [
            { model: User, as: 'author', attributes: ['username'] }
        ],
        order: [['createdAt', 'DESC']]
    });
};

export const getAllSketchesForGuests = async () => {
    return await Sketch.findAll({
        attributes: ['id', 'content', 'authorId', 'createdAt'],
        include: [
            { model: User, as: 'author', attributes: ['username'] }
        ],
        order: [['createdAt', 'DESC']]
    });
};

export const getGallerySketchesForUser = async (userId: number) => {
    const [solvedIds, exhaustedIds] = await Promise.all([
        getSolvedSketchIds(userId),
        getExhaustedSketchIds(userId)
    ]);

    const sketches = await Sketch.findAll({
        attributes: ['id', 'content', 'authorId', 'createdAt'],
        include: [
            { model: User, as: 'author', attributes: ['username'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    // Aggiungo lo "stato" ad ogni sketch
    return sketches.map(sketch => {
        const sketchJson = sketch.toJSON() as any; // Converte in JSON semplice per aggiungere proprietà
        let status = 'playable'; // Di default, il disegno si può giocare

        if (sketchJson.authorId === userId) {
            status = 'own'; 
        } else if (solvedIds.includes(sketchJson.id)) {
            status = 'guessed'; 
        } else if (exhaustedIds.includes(sketchJson.id)) {
            status = 'exhausted'; 
        }

        return { ...sketchJson, playStatus: status };
    });
};

export const getSketchesByIdSafe = async (id: number) => {
    const sketch = await Sketch.findByPk(id, {
        attributes: ['id', 'content', 'authorId', 'createdAt'],
        include: [
            { model: User, as: 'author', attributes: ['username'] }
        ]
    });

    if (!sketch) {
        throw new NotFoundError("Sketch");
    }

    return sketch;
};

export const getSketchesByIdWithWord = async (id: number) => {
    const sketch = await Sketch.findByPk(id, {
        include: [
            { model: User, as: 'author', attributes: ['username'] },
            { model: Word, as:'word', attributes: ['text'] }
        ]
    });

    if (!sketch) {
        throw new NotFoundError("Sketch");
    }

    return sketch;
};

export const getMySketches = async (userId: number) => {
    return await Sketch.findAll({
        where: { authorId: userId },
        include: [
            { model: Word, as: 'word', attributes: ['text'] } // L'utente sa già la parola, quindi è giusto renderla visibile.
        ],
    });
};

// Funzioni asuiliarie

// Trova gli Id degli sketch che l'utente ha già indovinato.
const getSolvedSketchIds = async (userId: number): Promise<number[]> => {
    const solved = await Guess.findAll({
        where: { userId, isCorrect: true },
        attributes: ['sketchId'],
        raw: true
    });
    return solved.map(g => g.sketchId);
};

// Trova gli Id degli sketch dove l'utente ha esaurito i 10 tentetivi.
const getExhaustedSketchIds = async (userId: number): Promise<number[]> => {
    const exhausted = await Guess.findAll({
        where: { userId },
        attributes: ['sketchId'],
        group: ['sketchId'],
        having: where(fn('COUNT', col('id')), '>=', 10),
        raw: true
    });
// Necessario cast (any) perché Sequelize types non sempre riconoscono sketchId in group/having.
    return exhausted.map(g => (g as any).sketchId);
}; 

// Costruisce i criteri di ricerca per gli sketch giocabili.
const buildPlayableCriteria = (userId: number, excludedIds: number[]) => {
    const criteria: any = {
        [Op.or]: [
            { authorId: { [Op.ne]: userId } },
            { authorId: null }
        ]
    };

    if (excludedIds.length > 0) {
        criteria.id = { [Op.notIn]: excludedIds };
    }

    return criteria;
};