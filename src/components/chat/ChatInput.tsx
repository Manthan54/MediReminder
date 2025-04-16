
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isTyping: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSend, isTyping }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about medications, side effects, or health advice..."
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button 
          onClick={onSend} 
          disabled={!input.trim() || isTyping}
          className="shrink-0"
        >
          <Send className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 italic">
        For medical emergencies, please call emergency services or visit the nearest emergency room. This assistant provides general medical information for educational purposes only.
      </p>
    </div>
  );
};
