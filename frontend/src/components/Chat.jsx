import { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../utils/socket.js';

const Chat = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await axios.get(`/history/chat-history/${userId}`);
      setMessages(response.data.data ?? []);
    };

    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    // Join the user's room
    socket.emit('joinRoom', userId);

    // Listen for incoming messages
    socket.on('reveiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [userId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: 'receiverId', // Replace with actual receiver ID
        message,
      });
    }
  };

  return (
    <>
      <div>
        <h1>Chat</h1>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg.message}</p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default Chat;
