import { Sequelize, Dialect } from "sequelize";
import * as dotenv from 'dotenv';

// Inizializzo dotenv per leggere il file .env
dotenv.config();

const dbUri = process.env.DB_CONNECTION_URI as string;
const dbDialect = (process.env.DIALECT || 'postgres') as Dialect;

// Creo l'istanza del database
export const database = new Sequelize(dbUri, {
  dialect: dbDialect,
  logging: false, // Puliamo i log del terminale
});

// Sincronizzo lo schema (utilizzo async per gestire funzioni asincrone)
export const initDatabase = async () => {
  try {
    // verifica che le credenziali nel .env siano corrette e il db sia raggiungibile
    await database.authenticate();
    // sync() crea le tabelle se non esistono, l'opzione 'alter' aggiorna le tabelle esistenti se modifichiamo i campi nel codice
    await database.sync({ alter: true }); 

    console.log("Database sincronizzato e tabelle pronte!");
  } catch (err: any) {
    // Gestione dell'errore in modo esplicito
    console.error("Errore durante la sincronizzazione: " + err.message);
  }
};