import { Word } from "./index.js"

// Popola la tabella 'words' se è vuota
export const seedWords = async () => {
    try {
        const count = await Word.count();

        if (count === 0) {
            console.log("Database delle parole vuoto. Inizio popolamento...");

            const defaultWords = [
                { text: 'Gatto' },
                { text: 'Pizza' },
                { text: 'Automobile' },
                { text: 'Chitarra' },
                { text: 'Albero' },
                { text: 'Sole' },
                { text: 'Bicicletta' },
                { text: 'Computer' },
                { text: 'Montagna' },
                { text: 'Libro' }
            ];

            await Word.bulkCreate(defaultWords);
            console.log("Dizionario inizializzato con successo!");
        } else {
            console.log(`Il dizionario contiene già ${count} parole. Saltando il seeeding.`);
        }
    } catch (error) {
        console.error("Errore durante il seeding delle parole: ", error);
    } 
}; 