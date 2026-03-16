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
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.post('/voti', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.voti.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ ok: true });
});

app.delete('/voti/:id', (req, res) => {
  if (req.headers['x-pin'] !== PIN)
    return res.status(401).json({ error: 'PIN errato' });
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.voti = data.voti.filter(v => String(v.id) !== String(req.params.id));
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ ok: true });
});

app.delete('/voti', (req, res) => {
  if (req.headers['x-pin'] !== PIN)
    return res.status(401).json({ error: 'PIN errato' });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ voti: [] }));
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server su porta ' + PORT));
```
