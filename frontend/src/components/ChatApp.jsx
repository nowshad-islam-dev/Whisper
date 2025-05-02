import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice.js';
import { useNavigate } from 'react-router-dom';

// Components
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

// add "user" prop later
const ChatApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        user={user}
        onSelectConversation={setSelectedConversation}
        onLogout={handleLogout}
      />
      {selectedConversation ? (
        <ChatArea
          selectedConversation={selectedConversation}
          userId={user.id}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">
            Select a conversation to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
