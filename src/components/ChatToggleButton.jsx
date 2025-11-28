import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Badge } from './ui/badge';

const ChatToggleButton = ({ isOpen, toggleChat, unreadCount }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-[100] bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      title={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      {!isOpen && unreadCount > 0 && (
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full">{unreadCount}</Badge>
      )}
    </button>
  );
};

export default ChatToggleButton;