function submitForm(e) {
    e.preventDefault();
    const nameEl = document.getElementById('username');
    const answerEl = document.getElementById('answer');
    const name = (nameEl.value || '').trim();
    const answer = (answerEl.value || '').trim();
    if (!name) {
        alert('Please enter a name');
        return;
    }
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, answer })
    }).then(res => {
        if (!res.ok) return res.text().then(t => Promise.reject(t));
        answerEl.value = '';
    }).catch(err => {
        console.error('submit error', err);
        alert('Submit failed');
    });
}
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serves index.html and host.html

const db = new sqlite3.Database(path.join(__dirname, 'answers.db'));
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS answers (
    name TEXT PRIMARY KEY,
    answer TEXT,
    updated_at INTEGER
  )`);
});

app.post('/submit', (req, res) => {
    const { name, answer } = req.body || {};
    if (!name) return res.status(400).send('Missing name');
    const ts = Date.now();
    const sql = `INSERT OR REPLACE INTO answers (name, answer, updated_at) VALUES (?, ?, ?)`;
    db.run(sql, [name, answer, ts], function (err) {
        if (err) return res.status(500).send('DB error');
        res.sendStatus(200);
    });
});

app.get('/answers', (req, res) => {
    db.all('SELECT name, answer, updated_at FROM answers', (err, rows) => {
        if (err) return res.status(500).send('DB error');
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at http://lassekrieglk.github.io/QuizSite`));