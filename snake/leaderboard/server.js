import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const dbFile = path.join(__dirname, "snake.db");
const db = new sqlite3.Database(dbFile);
app.use(cors());
app.use(express.json());
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  )
`, (err) => {
  if (err) {
    console.error("DB table creation failed:", err.message);
  } else {
    console.log("Connected to SQLite DB.");
  }
});
app.get("/api/scores", (req, res) => {
  db.all(
    `SELECT name, score, timestamp FROM scores ORDER BY score DESC, timestamp ASC LIMIT 20`,
    [],
    (err, rows) => {
      if (err) {
        console.error("DB fetch error:", err.message);
        return res.status(500).json({ error: "Failed to fetch scores" });
      }
      res.json(rows);
    }
  );
});
app.post("/api/scores", (req, res) => {
  const { name, score, timestamp } = req.body;
  console.log("Incoming POST /api/scores:", req.body);
  const valid =
    typeof name === "string" &&
    name.trim() !== "" &&
    name.length <= 32 &&
    typeof score === "number" &&
    !isNaN(score) &&
    score >= 0 &&
    typeof timestamp === "number" &&
    !isNaN(timestamp);
  if (!valid) {
    console.log("Invalid input. Validation failed.");
    return res.status(400).json({ error: "Invalid input data" });
  }
  const stmt = db.prepare(
    `INSERT INTO scores (name, score, timestamp) VALUES (?, ?, ?)`
  );
  stmt.run(name.trim(), score, timestamp, (err) => {
    if (err) {
      console.error("DB insert error:", err.message);
      return res.status(500).json({ error: "Failed to save score" });
    }
    console.log("Score saved.");
    res.json({ message: "Score saved" });
  });
  stmt.finalize();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Snake leaderboard backend listening on port ${PORT}`);
});