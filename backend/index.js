import 'dotenv/config';
import express from 'express';

import rateLimiter from './Interceptor/rateLimiter.js';
import pool, { connectDB } from './config/db.js';
import client from './config/redisClient.js'; // Connect to Redis

import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares
app.use(express.json({ limit: '128kb' }));
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(420).send('Too many requests, please try again later.');
  }
});

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();

  app.get('/', async (req, res) => {
    await client.set('message', 'Hello from Redis');
    const message = await client.get('message');

    const result = await pool.query('SELECT NOW()');
    res.send(`DB Time: ${result.rows[0].now} && Redis Message: ${message}`);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
})();

app.use('/api/auth', authRoutes);
