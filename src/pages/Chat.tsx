
import React from 'react';
import { Layout } from '@/components/Layout';
import { ChatInterface } from '@/components/ChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const Chat = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">AI Health Assistant</h1>
        <p className="text-muted-foreground">
          Get reliable information about medications, potential side effects, or general health advice.
        </p>
        
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 rounded-md flex items-start gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Important Notice</p>
            <p>This assistant provides general medical information for educational purposes. Always consult with a healthcare professional for personalized medical advice.</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <ChatInterface />
          </div>
          
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sample Questions</CardTitle>
                <CardDescription>Try asking these questions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• What are the side effects of antibiotics?</li>
                  <li>• How do NSAIDs like ibuprofen work?</li>
                  <li>• What's the difference between Tylenol and Advil?</li>
                  <li>• Can diabetes medications interact with other drugs?</li>
                  <li>• What should I do if I miss a blood pressure pill?</li>
                  <li>• How does insulin need to be stored?</li>
                  <li>• What diet helps with heart medication?</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">About This Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>This assistant provides evidence-based medical information about common medications, health conditions, and wellness practices.</p>
                <p className="mt-2">The information is sourced from established medical guidelines and is regularly updated for accuracy.</p>
                <p className="mt-2 text-xs italic">For emergency situations, contact emergency services immediately.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
