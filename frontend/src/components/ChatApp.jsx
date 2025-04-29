import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

// add "user" prop later
const ChatApp = () => {
  const user = { avatar: '', id: 1, username: 'John Doe' }; // Mock user data
  const [selectedConversation, setSelectedConversation] = useState(null);

  const conversations = [
    // Mock conversation data
    { id: 1, name: 'Alice', avatar: '', lastMessage: 'Hello!' },
    { id: 2, name: 'Bob', avatar: '', lastMessage: 'How are you?' },
  ];

  const handleLogout = () => {
    console.log('User logged out');
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
