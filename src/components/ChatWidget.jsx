import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Bot, User, Loader2, ServerCrash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ChatWidget = ({ isOpen, socket }) => {
  const { user } = useAuth();
  // ✅ Initialize state from localStorage or use a default welcome message.
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages
      ? JSON.parse(savedMessages)
      : [{ 
          from: 'admin', 
          text: 'Hello! I am your AI assistant. How can I help you with BurgerShop today?',
          timestamp: new Date().toISOString() 
        }];
  });
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // AI is typing state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // ✅ Save messages to localStorage whenever they change.
  useEffect(() => {
    // We only save if there's more than the initial welcome message to avoid saving an empty state.
    if (messages.length > 1) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && user && !isTyping) {
      const userMessage = {
        from: 'user',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      // ✅ FIX: Update messages state BEFORE making the API call.
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setNewMessage('');
      setIsTyping(true);

      try {
        // Use the just-updated message history for the request.
        const history = updatedMessages;
        const res = await fetch('https://grilmelt-burger.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newMessage, history: history })
        });

        if (!res.ok || !res.body) {
            throw new Error('Failed to get a streaming response from the server.');
        }

        // ✅ Handle the streaming response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let botReply = '';

        // Add an empty message for the bot to start filling
        setMessages((prev) => [...prev, { from: 'admin', text: '', timestamp: new Date().toISOString() }]);

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            botReply += chunk;

            // Update the last message (the bot's reply) with the new chunk
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = botReply;
                return newMessages;
            });
        }

      } catch (error) {
        console.error("Chat Error:", error);
        const errorMessage = { 
            from: 'admin', 
            text: 'Sorry, I am having trouble connecting. Please try again later.',
            timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsTyping(false); // Hide typing indicator
      }
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[99] w-80 h-[28rem] animate-fadeInUp">
      <Card className="w-full h-full flex flex-col bg-background border rounded-lg shadow-xl">
        <CardHeader className="p-4 border-b flex-row items-center gap-3 bg-muted/50 rounded-t-lg">
          <Bot className="w-8 h-8 text-primary" />
          <div>
            <h3 className="text-lg font-bold">BurgerShop Support</h3>
            <p className="text-xs text-muted-foreground">We'll reply as soon as possible</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.from === 'admin' && <Bot className="w-6 h-6 text-muted-foreground" />}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      msg.from === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.from === 'user' && <User className="w-6 h-6 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground px-2">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <Bot className="w-6 h-6 text-muted-foreground" />
                <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              placeholder={user ? "Type a message..." : "Please log in to chat"}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user || isTyping}
            />
            <Button type="submit" size="icon" disabled={!user || !newMessage.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatWidget;