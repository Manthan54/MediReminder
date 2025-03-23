
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/medications', icon: PlusCircle, label: 'Medications' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MediMinder</span>
          </div>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <div className="relative">
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -inset-1 bg-primary/10 rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <item.icon 
                    className={`h-6 w-6 ${location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                </div>
                <span className={`text-xs mt-1 ${location.pathname === item.path ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
