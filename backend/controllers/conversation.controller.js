import pool from '../config/db.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

//  Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      'INSERT INTO conversations (name) VALUES ($1) RETURNING *',
      [name]
    );

    return apiResponse(
      res,
      201,
      'Conversation created successfully',
      result.rows[0]
    );
  } catch (err) {
    return apiError(res, 500, 'Failed to create conversation', err);
  }
};

// Get all conversations for a user
export const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT c.id, c.name, c.created_at
      FROM conversations c
      JOIN participants p ON c.id = p.conversation_id
      WHERE p.user_id = $1
      ORDER BY c.created_at DESC
      `,
      [userId]
    );

    return apiResponse(
      res,
      200,
      'Conversations fetched successfully',
      result.rows
    );
  } catch (err) {
    return apiError(res, 500, 'Failed to fetch conversations', err);
  }
};
