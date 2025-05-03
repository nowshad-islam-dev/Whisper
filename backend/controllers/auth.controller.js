import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import client from '../config/redisClient.js';

import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';

import { registerSchema } from '../Validators/auth.validator.js';

// Register a new user
export const register = async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return apiError(res, 400, 'Invalid input', error.details[0].message);
    }

    const { username, email, password } = req.body;

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return apiError(res, 400, 'Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    const sanitizedUser = sanitizeUser(result.rows[0]);

    return apiResponse(res, 201, 'User registered successfully', sanitizedUser);
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

    let user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiError(res, 400, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = uuidv4(); // Generate a new refresh token

    // Store the refresh token in Redis with a 7-day expiration
    await client.set(`refreshToken:${refreshToken}`, user.id, {
      EX: 60 * 60 * 24 * 7, // Set expiration to 7 days
    });

    user = sanitizeUser(user);

    return apiResponse(res, 200, 'Login successful', {
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return apiError(res, 500, 'Login failed', err);
  }
};

// Issue refresh & access token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return apiError(res, 400, 'Refresh token is required');
    }

    const userId = await client.get(`refreshToken:${refreshToken}`);
    if (!userId) {
      return apiError(res, 401, 'Invalid or expired refresh token');
    }

    // Issue new tokens
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const newRefreshToken = uuidv4();

    // Replace the old refresh token in Redis
    await client.del(`refreshToken:${refreshToken}`);
    await client.set(`refreshToken:${newRefreshToken}`, userId, {
      EX: 60 * 60 * 24 * 7, // Set expiration to 7 days
    });

    // Send the new tokens to the client
    return apiResponse(res, 200, 'Tokens refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return apiError(res, 500, 'Token refresh failed', err);
  }
};
