import { Sequelize } from "sequelize";
import 'dotenv/config.js'; // Legge il file .env e rende disponibili le variabili in process.env

// Inizializziamo la connessione usando l'URI e il dialetto definiti nel nostro file .env
export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: process.env.DIALECT
});

// (Qui in futuro collegheremo i nostri modelli: Utenti, Disegni, Tentativi)

// Sincronizziamo lo schema (creerà le tabelle mancanti in automatico)
database.sync().then(() => {
  console.log("Database sincronizzato correttamente!"); 
}).catch(err => {
  console.error("Errore durante la sincronizzazione del database: " + err.message); 
});