import express from "express";
import cors from "cors";
import "./Database.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Rotta di test
app.get("/", (req, res) => {
  res.json({ message: "Benvenuto nelle API di QuickSketch!" });
});

// Gestione errori
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});

app.listen(PORT, () => {
  console.log(`Server avviato e in ascolto all'indirizzo http://localhost:${PORT}`);
});