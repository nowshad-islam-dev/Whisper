import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import pool from '../config/db.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at',
      [username, email, hashedPassword]
    );

    return apiResponse(
      res,
      201,
      'User registered successfully',
      result.rows[0]
    );
  } catch (err) {
    return apiError(res, 500, 'Registration failed', err);
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return apiError(res, 400, 'Invalid email or password');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiError(res, 400, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return apiResponse(res, 200, 'Login successful', {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return apiError(res, 500, 'Login failed', err);
  }
};
