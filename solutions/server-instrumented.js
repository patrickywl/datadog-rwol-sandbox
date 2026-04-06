// dd-trace.init() MUST be called before any other require().
const tracer = require('dd-trace').init({
  service: 'rwol-demo-backend',
  env: 'rwol-workshop',
  logInjection: true,
});

const express = require('express');
const cors = require('cors');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'rwol-demo-backend' },
  transports: [
    new winston.transports.File({ filename: '/var/log/backend/app.log' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
  logger.info('Fetching products list', { endpoint: '/api/products', method: 'GET' });
  try {
    const response = await fetch('https://dummyjson.com/products?limit=10');
    const data = await response.json();
    logger.info('Products fetched successfully', { count: data.products?.length });
    res.json(data);
  } catch (err) {
    logger.error('Failed to fetch products', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  logger.info('Fetching single product', { endpoint: `/api/products/${req.params.id}`, productId: req.params.id });
  try {
    const response = await fetch(`https://dummyjson.com/products/${req.params.id}`);
    const data = await response.json();
    logger.info('Product fetched successfully', { productId: req.params.id, title: data.title });
    res.json(data);
  } catch (err) {
    logger.error('Failed to fetch product', { productId: req.params.id, error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  logger.info('Health check');
  res.json({ status: 'ok', service: 'rwol-demo-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`RWOL backend running on port ${PORT} (APM + Logging enabled)`);
});
