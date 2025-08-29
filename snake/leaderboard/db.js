import sqlite3 from "sqlite3";
import { open } from "sqlite";
const dbPromise = open({
  filename: "./scores.db",
  driver: sqlite3.Database
});
async function initDB() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      score INTEGER,
      timestamp INTEGER,
      date TEXT,
      time TEXT
    )
  `);
}
async function addScore({ name, score, timestamp, date, time }) {
  const db = await dbPromise;
  await db.run(
    `INSERT INTO scores (name, score, timestamp, date, time)
     VALUES (?, ?, ?, ?, ?)`,
    [name, score, timestamp, date, time]
  );
}
async function getTopScores(limit = 30) {
  const db = await dbPromise;
  return db.all(`
    SELECT name, score, timestamp, date, time
    FROM scores
    ORDER BY score DESC, timestamp ASC
    LIMIT ?
  `, [limit]);
}
export { initDB, addScore, getTopScores };
