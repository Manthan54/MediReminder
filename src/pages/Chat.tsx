
import React from 'react';
import { Layout } from '@/components/Layout';
import { ChatInterface } from '@/components/ChatInterface';

const Chat = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">AI Health Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your medications, potential side effects, or general health advice.
        </p>
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default Chat;
