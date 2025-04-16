
import React, { useState } from 'react';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      content: "Hello! I'm your medical assistant. I can provide detailed information about medications, conditions, and health practices. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

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
    
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: input }
      });

      if (error) throw error;
      
      if (!data?.response) {
        throw new Error('No response from AI assistant');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling AI service:', error);
      // Add the error as a bot message so the user can see what went wrong
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an issue while processing your request. Please try again later. (Error: ${error instanceof Error ? error.message : 'Unknown error'})`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-card rounded-xl overflow-hidden">
      <div className="bg-secondary/50 backdrop-blur-sm p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h2 className="text-sm font-medium">MediMinder Assistant</h2>
            <p className="text-xs text-muted-foreground">AI-powered medical information & health advice</p>
          </div>
        </div>
      </div>
      
      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput 
        input={input}
        setInput={setInput}
        onSend={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
};
