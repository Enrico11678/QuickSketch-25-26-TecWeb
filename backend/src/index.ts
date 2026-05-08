import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import { User, Sketch, Word, Guess } from "./models/index.js";import { initDatabase } from "./Database.js"; // Importa la funzione di inizializzazione del database

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Rotta di test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Benvenuto nelle API di QuickSketch in TypeScript!" });
});

// Interfaccia personalizzata per gestire gli errori con status
interface HttpError extends Error {
  status?: number;
}

// Gestione errori (Middleware finale)
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    code: statusCode,
    description: err.message || "An error occurred"
  });
});

// Funzione di popolamento parole (Seeding)
const seedWords = async () => {
  const count = await Word.count();
  if (count === 0) {
    const defaultWords = ['Gatto', 'Automobile', 'Pizza', 'Chitarra', 'Sole', 'Bicicletta'];
    await Word.bulkCreate(defaultWords.map(w => ({ text: w })));
    console.log("Dizionario inizializzato!");
  }
};

// Avvio del server con sincronizzazione DB
app.listen(PORT, async () => {
  console.log(`Server avviato e in ascolto all'indirizzo http://localhost:${PORT}`);

  // Inizializzo il DB solo dopo l'avvio del server.
  try {
    await initDatabase();
    
    await seedWords();

    console.log("Database pronto e modelli caricati correttamente.");
  } catch (error) {
    console.error("Errore fatale all'avvio del database: ", error);
  }
});