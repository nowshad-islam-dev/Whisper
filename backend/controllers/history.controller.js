import pool from '../config/db.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM messages receiver_id = $1 OR sender_id = $1 ORDER BY created_at ASC',
      [userId]
    );

    return apiResponse(
      res,
      200,
      'Chat history fetched successfully',
      result.rows
    );
  } catch (err) {
    return apiError(res, 500, 'Failed to fetch chat history', err);
  }
};
