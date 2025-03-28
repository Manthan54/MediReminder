
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { signOut, user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            
            <Button variant="destructive" onClick={signOut} className="mt-4">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Enable notifications</span>
              <Switch defaultChecked={Notification.permission === "granted"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Sound alerts</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="font-medium">Dark mode</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
