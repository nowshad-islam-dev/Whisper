import express from 'express';
import { getChatHistory } from '../controllers/history.controller.js';

const router = express.Router();

router.get('/chat-history/:conversationId', getChatHistory);

export default router;
