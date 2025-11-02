require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.get('/api/assemblyai-token', async (req, res) => {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ASSEMBLYAI_API_KEY env var on server' });
  }
  try {
    const resp = await fetch('https://api.assemblyai.com/v2/realtime/token', {
      method: 'POST',
      headers: { authorization: apiKey },
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'AssemblyAI token request failed', details: text });
    }
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token', details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
