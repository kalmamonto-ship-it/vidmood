'use client';

import { useState } from 'react';
import { Home, Camera, Video, Radio, Heart, User, Search, Plus, Settings, MessageCircle, TrendingUp } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

export default function NavigationMenu() {
  const [activeTab, setActiveTab] = useState('home');
  
  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'discover', label: 'Discover', icon: <Search size={24} /> },
    { id: 'create', label: 'Create', icon: <Plus size={24} />, active: true },
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={24} /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={24} /> },
    { id: 'profile', label: 'Profile', icon: <User size={24} /> },
  ];

  const secondaryItems = [
    { id: 'camera', label: 'Camera', icon: <Camera size={20} /> },
    { id: 'live', label: 'Live', icon: <Radio size={20} /> },
    { id: 'saved', label: 'Saved', icon: <Heart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-black/50 backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Main Navigation Items */}
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-b from-purple-600/30 to-pink-600/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`${activeTab === item.id ? 'text-white' : 'text-white/70'}`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Secondary Items (Hidden on mobile, shown on larger screens) */}
          <div className="hidden md:flex space-x-2">
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                className="flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                <div className="text-white/70">
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Create Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-black/50">
          <Plus size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
}