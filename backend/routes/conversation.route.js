import express from 'express';
import {
  createConversation,
  getAllConversations,
} from '../controllers/conversation.controller.js';

const router = express.Router();

router.post('/', createConversation);

router.get('/:userId', getAllConversations);

export default router;
