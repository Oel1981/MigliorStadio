const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PIN = '31101979';

app.use(cors());
app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ voti: [] }));
}

app.get('/voti', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({ voti: data.voti || [] });
  } catch(e) {
    res.json({ voti: [] });
  }
});

app.post('/voti', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.voti.push(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/voti/:id', (req, res) => {
  if (req.headers['x-pin'] !== PIN)
    return res.status(401).json({ error: 'PIN errato' });
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.voti = data.voti.filter(v => String(v.id) !== String(req.params.id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/voti', (req, res) => {
  if (req.headers['x-pin'] !== PIN)
    return res.status(401).json({ error: 'PIN errato' });
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ voti: [] }));
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server avviato su porta ' + PORT);
});

