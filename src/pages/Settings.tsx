
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { requestNotificationPermission } from '@/utils/notifications';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { signOut, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('soundEnabled') !== 'false');
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely check for the current theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      
      if (granted) {
        toast.success('Notification permissions granted!');
      } else {
        toast.error('Failed to enable notifications. Please check your browser settings.');
      }
    }
  };
  
  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('soundEnabled', checked.toString());
    
    if (checked) {
      toast.success('Sound alerts enabled');
    } else {
      toast.success('Sound alerts disabled');
    }
  };
  
  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    // Add a toast to confirm the theme change
    toast.success(`${checked ? 'Dark' : 'Light'} mode activated`);
  };
  
  // Only render theme UI on client to avoid hydration mismatch
  if (!mounted) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <div className="h-screen animate-pulse">Loading settings...</div>
        </div>
      </Layout>
    );
  }
  
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
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationToggle} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Sound alerts</span>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={handleSoundToggle} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={handleDarkModeToggle} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
