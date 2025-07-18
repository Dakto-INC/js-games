import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
const app = express();
const PORT = 3000;
app.use(cors({
  origin: "https://games.daktoinc.co.uk",
}));
app.use(express.json());
const db = new sqlite3.Database("./snake.db", (err) => {
  if (err) {
    console.error("Failed to connect to DB:", err.message);
  } else {
    console.log("Connected to SQLite DB.");
  }
});
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);
app.get("/api/scores", (req, res) => {
  db.all(
    `SELECT name, score, timestamp FROM scores ORDER BY score DESC, timestamp ASC LIMIT 20`,
    (err, rows) => {
      if (err) {
        console.error("DB fetch error:", err.message);
        return res.status(500).json({ error: "Failed to load scores" });
      }

      res.json(rows);
    }
  );
});
app.post("/api/scores", (req, res) => {
  let { name, score, timestamp } = req.body;
  console.log("Incoming POST /api/scores:", req.body);
  console.log("Before type coercion =>", {
    name: typeof name,
    score: typeof score,
    timestamp: typeof timestamp,
  });
  score = Number(score);
  timestamp = Number(timestamp);
  console.log("After coercion =>", {
    name: typeof name,
    score: typeof score,
    timestamp: typeof timestamp,
  });
  if (
    !name ||
    typeof name !== "string" ||
    typeof score !== "number" ||
    isNaN(score) ||
    score < 0 ||
    typeof timestamp !== "number" ||
    isNaN(timestamp)
  ) {
    console.log("Invalid input. Validation failed.");
    return res.status(400).json({ error: "Invalid input data" });
  }
  const stmt = db.prepare(`
    INSERT INTO scores (name, score, timestamp) VALUES (?, ?, ?)
  `);
  stmt.run(name, score, timestamp, (err) => {
    if (err) {
      console.error("DB insert error:", err.message);
      return res.status(500).json({ error: "Failed to save score" });
    }
    console.log("Score saved.");
    res.json({ message: "Score saved" });
  });
  stmt.finalize();
});
app.listen(PORT, () => {
  console.log(`Snake leaderboard backend listening on port ${PORT}`);
});
