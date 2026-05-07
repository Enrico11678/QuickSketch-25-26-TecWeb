import { Sequelize, Dialect } from "sequelize";
import * as dotenv from 'dotenv';

// Inizializziamo dotenv per leggere il file .env
dotenv.config();

const dbUri = process.env.DB_CONNECTION_URI as string;
const dbDialect = (process.env.DIALECT || 'postgres') as Dialect;

export const database = new Sequelize(dbUri, {
  dialect: dbDialect,
  logging: false, // Puliamo i log del terminale
});

// Sincronizziamo lo schema
database.sync().then(() => {
  console.log("Database sincronizzato correttamente!");
}).catch((err: Error) => {
  console.error("Errore durante la sincronizzazione del database: " + err.message);
});