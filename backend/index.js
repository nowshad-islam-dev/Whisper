import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Chat App Backend is Running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
