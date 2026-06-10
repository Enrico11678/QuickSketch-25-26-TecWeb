import { Sequelize, Dialect } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

// Leggo i parametri dal .env
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbDialect = (process.env.DIALECT || 'postgres') as Dialect;

// Istanza Sequelize
export const database = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: false,
});

export const initDatabase = async () => {
  try {
    await database.authenticate();
    await database.sync({ alter: true });
    console.log("Database sincronizzato e tabelle pronte!");
  } catch (err: any) {
    console.error("Errore durante la sincronizzazione: " + err.message);
  }
};