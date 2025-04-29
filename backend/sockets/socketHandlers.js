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
        // Save the message to the database
        const result = await pool.query(
          'INSERT INTO messages (sender_id, conversation_id, message) VALUES ($1, $2, $3) RETURNING *',
          [senderId, conversationId, message]
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
