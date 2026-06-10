import express, { Request, Response, Application } from "express";
import { initDatabase } from "./Database.js"; 
import authRoutes from './routes/authRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import sketchRoutes from './routes/sketchRoutes.js';
import guessRoutes from './routes/guessRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { seedWords } from "./models/data/seeder.js";
import { errorHandler, applyGlobalMiddlewares } from "./middlewares/index.js";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

applyGlobalMiddlewares(app); 

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/sketches', sketchRoutes);
app.use('/api/guesses', guessRoutes);
app.use('/api/users', userRoutes);

// Rotta di test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Benvenuto nelle API di QuickSketch in TypeScript!" });
});

app.use(errorHandler);

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