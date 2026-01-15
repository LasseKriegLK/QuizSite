const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve index.html / host.html

const dbPath = path.join(__dirname, 'answers.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS answers (
    name TEXT PRIMARY KEY,
    answer TEXT,
    updated_at INTEGER
  )`);
});

app.post('/submit', (req, res) => {
  const name = String(req.body.name || req.body.username || '').trim();
  const answer = String(req.body.answer || '').trim();
  if (!name) return res.status(400).json({ error: 'Missing name' });

  const ts = Date.now();
  const sql = `INSERT OR REPLACE INTO answers (name, answer, updated_at) VALUES (?, ?, ?)`;
  db.run(sql, [name, answer, ts], function (err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ ok: true });
  });
});

app.get('/answers', (req, res) => {
  db.all('SELECT name, answer, updated_at FROM answers', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on https://lassekrieglk.github.io/QuizSite`));

// graceful shutdown
process.on('SIGINT', () => {
  db.close(() => process.exit(0));
});