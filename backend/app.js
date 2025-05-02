import express from 'express';
import helmet from 'helmet';
import rateLimiter from './Interceptor/rateLimiter.js';
import authRoutes from './routes/auth.route.js';
import historyRoutes from './routes/history.route.js';
import client from './config/redisClient.js';
import conversationRoutes from './routes/conversation.route.js';
import pool from './config/db.js';
import cors from 'cors';

const app = express();

// --- Middlewares ---
app.use(express.json({ limit: '128kb' }));
app.use(helmet());

const allowedOrigins = ['http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

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
app.use('/api/history', historyRoutes);
app.use('/api/conversations', conversationRoutes);

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
