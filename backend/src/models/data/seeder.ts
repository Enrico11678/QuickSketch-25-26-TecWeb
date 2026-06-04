import { Word } from "../index.js";
import { MY_WORDS } from "./words-data.js"; 

export const seedWords = async () => {
    try {
        const count = await Word.count();
        if (count > 0) return;

        console.log("Popolamento database con lista curata...");

        const wordsToSeed = MY_WORDS.map(text => ({ text }));

        await Word.bulkCreate(wordsToSeed);
        console.log(`Database popolato con ${wordsToSeed.length} parole perfette per il disegno.`);
        
    } catch (error: any) {
        console.error("Errore nel seeder:", error.message);
    }
};