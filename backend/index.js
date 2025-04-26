import 'dotenv/config';
import express from 'express';

import pool, { connectDB } from './config/db.js';
import client from './config/redisClient.js'; // Connect to Redis

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 4000;

(async () => {
  const db = await connectDB();

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
