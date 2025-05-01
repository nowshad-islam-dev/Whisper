import { useState, useEffect } from 'react';
import { Avatar, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import apiClient from '../app/services/axiosClient.js';

const Sidebar = ({ user, onSelectConversation, onLogout }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await apiClient.get(`/conversations/${user.id}`);
        setConversations(response.data.data ?? []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchConversations();
  }, [user.id]);

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Avatar src={user.avatar || ''} alt={user.username} />
          <span className="text-lg font-bold">{user.username}</span>
        </div>
        <Button onClick={onLogout} color="inherit" startIcon={<Logout />}>
          Logout
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 ${
              conversation.selected ? 'bg-gray-800' : ''
            }`}
          >
            <Avatar src={conversation.avatar || ''} alt={conversation.name} />
            <div>
              <p className="font-medium">{conversation.name}</p>
              <p className="text-sm text-gray-400">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
