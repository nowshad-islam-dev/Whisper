import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return apiError(res, 401, 'Access token is required');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return apiError(res, 403, 'Invalid or expired token');
    }
    req.user = user;
    next();
  });
};
