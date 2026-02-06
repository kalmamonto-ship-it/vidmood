'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, User, Plus } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      icon: Home, 
      label: 'Home',
      active: pathname === '/' || pathname.startsWith('/home')
    },
    { 
      href: '/marketplace', 
      icon: Search, 
      label: 'Marketplace',
      active: pathname === '/marketplace' || pathname.startsWith('/marketplace')
    },
    { 
      href: '/upload', 
      icon: Plus, 
      label: 'Upload',
      active: pathname === '/upload' || pathname.startsWith('/upload')
    },
    { 
      href: '/messages', 
      icon: MessageCircle, 
      label: 'Messages',
      active: pathname === '/messages' || pathname.startsWith('/messages')
    },
    { 
      href: '/profile', 
      icon: User, 
      label: 'Profile',
      active: pathname === '/profile' || pathname.startsWith('/profile')
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                item.active 
                  ? 'text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}