import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "192.168.0.173",
  user: "snakeuser",
  password: "thisisthesnakepassword",
  database: "snake",
  port: 3306,
  connectionLimit: 10
});

console.log("Snake leaderboard backend starting...");

app.get("/api/scores", (req, res) => {
  console.log("Incoming GET /api/scores");
  pool.query(
    "SELECT * FROM scores ORDER BY score DESC, timestamp ASC LIMIT 20",
    (err, results) => {
      if (err) {
        console.error("Failed to fetch scores:", err);
        return res.status(500).json({ error: "Failed to fetch scores" });
      }
      console.log("Sending top scores:", results.length);
      res.json(results);
    }
  );
});

app.post("/api/scores", (req, res) => {
  console.log("Incoming POST /api/scores:", req.body);
  let { name, score, timestamp } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "" ||
      typeof score !== "number" || score < 0 ||
      typeof timestamp !== "number" || isNaN(timestamp)) {
    console.log("Invalid input data");
    return res.status(400).json({ error: "Invalid input data" });
  }
  name = name.trim();
  pool.query(
    "INSERT INTO scores (name, score, timestamp) VALUES (?, ?, ?)",
    [name, score, timestamp],
    (err) => {
      if (err) {
        console.error("Failed to save score:", err);
        return res.status(500).json({ error: "Failed to save score" });
      }
      console.log(`Score saved: ${name} - ${score} at ${timestamp}`);
      res.json({ message: "Score saved" });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Snake leaderboard backend listening on port ${PORT}`);
});
