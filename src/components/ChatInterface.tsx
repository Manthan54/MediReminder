
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your MediMinder assistant. How can I help you with your medications today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulated AI response - would connect to a real AI service in production
    setTimeout(() => {
      const botResponses = [
        "I understand you're asking about medication. Could you provide more details?",
        "It's important to take your medications as prescribed by your doctor.",
        "Remember to store your medications in a cool, dry place away from direct sunlight.",
        "If you experience any side effects, please consult your healthcare provider immediately.",
        "Make sure to take this medication with food to avoid stomach upset.",
        "I'd recommend setting up regular reminders for your medications to ensure you don't miss any doses."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-card rounded-xl overflow-hidden">
      <div className="bg-secondary/50 backdrop-blur-sm p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-primary/20">
            <AvatarFallback className="text-primary">AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-medium">MediMinder Assistant</h2>
            <p className="text-xs text-muted-foreground">Ask about medications, side effects, schedules</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex max-w-[80%]">
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 mr-2 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex">
                  <Avatar className="h-8 w-8 mr-2 mt-0.5">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="rounded-xl p-3 bg-secondary flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-150" />
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-300" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="flex">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            onClick={handleSendMessage} 
            className="rounded-l-none"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
