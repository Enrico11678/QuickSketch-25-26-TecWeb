import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import "./Database.js"; // Inizializza la connessione al DB

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

app.listen(PORT, () => {
  console.log(`Server avviato e in ascolto all'indirizzo http://localhost:${PORT}`);
});