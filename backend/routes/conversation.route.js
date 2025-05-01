import express from 'express';
import {
  createConversation,
  getAllConversations,
} from '../controllers/conversation.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createConversation);

router.get('/:userId', authenticateToken, getAllConversations);

export default router;
