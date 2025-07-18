import express from "express";
import cors from "cors";
import { initDB, addScore, getTopScores } from "./db.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
await initDB();
app.get("/api/scores", async (req, res) => {
  try {
    const scores = await getTopScores(30);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to get scores" });
  }
});
app.post("/api/scores", async (req, res) => {
  const { name, score, timestamp, date, time } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid score data" });
  }
  try {
    await addScore({ name, score, timestamp, date, time });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
