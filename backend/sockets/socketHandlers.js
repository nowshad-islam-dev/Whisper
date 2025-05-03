import pool from '../config/db.js';

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 A user connected: ${socket.id}`);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId); // Join the conversation room
      console.log(`User joined conversation ${conversationId}`);
    });

    // Listen for incoming messages
    socket.on('sendMessage', async ({ senderId, conversationId, message }) => {
      try {
        // 1. Find receiver_id
        const receiverQuery = await pool.query(
          `SELECT user_id FROM participants WHERE conversation_id = $1 AND user_id != $2 LIMIT 1`,
          [conversationId, senderId]
        );
        const receiverId = receiverQuery.rows[0].user_id;

        // Save the message to the database
        const result = await pool.query(
          'INSERT INTO messages (sender_id, receiver_id, conversation_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
          [senderId, receiverId, conversationId, message]
        );

        const savedMessage = result.rows[0];

        // Broadcast the message to the receiver
        io.to(conversationId).emit('receiveMessage', savedMessage);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // Join a room (user-specific)
    socket.on('joinRoom', (userId) => {
      socket.join(userId); // Each user has their own room
      console.log(`User ${userId} joined their room `);
    });

    // You can add more socket events here
    socket.on('disconnect', () => {
      console.log(`🔌 A user disconnected: ${socket.id}`);
    });
  });
}
