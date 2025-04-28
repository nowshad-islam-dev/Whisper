import express from 'express';
import { getChatHistory } from '../controllers/history.controller.js';

const router = express.Router();

router.get('/chat-history/:userId', getChatHistory);

export default router;
