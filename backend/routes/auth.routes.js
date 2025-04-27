import express from 'express';
import {
  login,
  refreshAccessToken,
  register,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/refresh-token', refreshAccessToken);

export default router;
