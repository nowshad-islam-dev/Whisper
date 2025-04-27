import express from 'express';
import helmet from 'helmet';
import rateLimiter from './Interceptor/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import client from './config/redisClient.js';
import pool from './config/db.js';

const app = express();

// --- Middlewares ---
app.use(express.json({ limit: '128kb' }));
app.use(helmet());

// Rate Limiter Middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).send('Too many requests, please try again later.');
  }
});

// --- Routes ---
app.use('/api/auth', authRoutes);

// --- Root Route ---
app.get('/', async (req, res, next) => {
  try {
    await client.set('message', 'Hello from Redis');
    const message = await client.get('message');
    const result = await pool.query('SELECT NOW()');

    res.send(`DB Time: ${result.rows[0].now} && Redis Message: ${message}`);
  } catch (error) {
    next(error);
  }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('💥 Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
