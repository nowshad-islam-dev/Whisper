import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@mui/material';
import socket from '../utils/socket.js';
import axios from 'axios';

const ChatArea = ({ selectedConversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chat history when a conversation is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedConversation) {
        try {
          const response = await axios.get(
            `/history/chat-history/${selectedConversation.id}`
          );
          setMessages(response.data.data ?? []); // Assuming the API returns data as { success: true, data: [...] }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      }
    };

    fetchChatHistory();
  }, [selectedConversation]);

  useEffect(() => {
    // Join the user's room
    socket.emit('joinRoom', { userId });

    // Listen for incoming messages
    socket.on('reveiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, selectedConversation]);

  useEffect(() => {
    // Scroll to the bottom  when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: 'receiverId', // Replace with actual receiver ID
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-300 bg-white">
        <Avatar
          src={selectedConversation.avatar || ''}
          alt={selectedConversation.name}
        />
        <span className="ml-3 font-bold">{selectedConversation.name}</span>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 max-w-[70%] p-3 rounded-lg ${
              msg.sender_id === userId
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-300'
            }`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
