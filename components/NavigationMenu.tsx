'use client';

import { useState } from 'react';
import { Home, Search, User, Settings } from 'lucide-react';

export default function NavigationMenu() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-2 py-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 mb-1" />
            <span className="text-xs font-medium hidden md:block">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
