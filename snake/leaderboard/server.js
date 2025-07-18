import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
const app = express();
const port = 3000;
app.use(cors({
  origin: "https://games.daktoinc.co.uk"
}));
app.use(bodyParser.json());
const dbFile = path.resolve("./snake-leaderboard.db");
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Failed to open DB:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to SQLite DB.");
  }
});
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    date TEXT,
    time TEXT
  )
`);
app.get("/api/scores", (req, res) => {
  db.all(
    `SELECT name, score, timestamp FROM scores
     ORDER BY score DESC, timestamp ASC
     LIMIT 20`,
    [],
    (err, rows) => {
      if (err) {
        console.error("DB read error:", err.message);
        res.status(500).json({ error: "Failed to load scores" });
      } else {
        res.json(rows);
      }
    }
  );
});
app.post("/api/scores", (req, res) => {
  const { name, score, date, time } = req.body;
  if (
    !name ||
    typeof score !== "number" ||
    score < 0 ||
    typeof date !== "string" ||
    typeof time !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  const timestamp = Date.now();
  const stmt = db.prepare(
    `INSERT INTO scores (name, score, timestamp, date, time) VALUES (?, ?, ?, ?, ?)`
  );
  stmt.run(name, score, timestamp, date, time, (err) => {
    if (err) {
      console.error("DB insert error:", err.message);
      res.status(500).json({ error: "Failed to save score" });
    } else {
      res.json({ message: "Score saved" });
    }
  });
  stmt.finalize();
});
app.listen(port, () => {
  console.log(`Snake leaderboard backend listening on port ${port}`);
});
