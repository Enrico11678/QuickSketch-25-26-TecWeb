import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import { initDatabase } from "./Database.js"; // Importa la funzione di inizializzazione del database
import { AppError } from "./utils/errors.js";
import authRoutes from './routes/authRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import sketchRoutes from './routes/sketchRoutes.js';
import guessRoutes from './routes/guessRoutes.js';
import { seedWords } from "./models/seeder.js";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/sketches', sketchRoutes);
app.use('/api/guesses', guessRoutes);

// Rotta di test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Benvenuto nelle API di QuickSketch in TypeScript!" });
});

// Gestione errori (Middleware finale)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Se è un nostro AppError, usiamo i suoi dati, altrimenti 500 (Errore generico)
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "An error occurred on the server";

  console.error(`[ERROR ${statusCode}]: ${err.stack}`);
  
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    description: message
  });
});

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