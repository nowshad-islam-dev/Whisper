import 'dotenv/config';
import http from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import socketHandlers from './sockets/socketHandlers.js';

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this
    methods: ['GET', 'POST'],
  },
});

// Attach socket handlers
socketHandlers(io);

// Connect to database and start server
(async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
