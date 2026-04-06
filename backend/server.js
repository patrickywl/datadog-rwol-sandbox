// ==========================================================
// Express Backend — APM NOT YET CONFIGURED
// ==========================================================
// This is a basic Express server without Datadog APM tracing.
// In a later challenge, you will replace this file with an
// instrumented version that adds dd-trace for APM.
//
// To enable APM, copy the solution file:
//   cp /root/lab/solutions/server-instrumented.js /root/lab/backend/server.js
// ==========================================================

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=10');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'rwol-demo-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RWOL backend running on port ${PORT} (APM not configured)`);
});
