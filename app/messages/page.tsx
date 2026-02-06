'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: Date;
  unread: boolean;
}

export default function MessagesPage() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'user2',
          senderName: 'Alex Johnson',
          senderAvatar: '/default-avatar.png',
          message: 'Hey, check out my new video!',
          timestamp: new Date(Date.now() - 3600000),
          unread: true
        },
        {
          id: '2',
          senderId: 'user3',
          senderName: 'Maria Garcia',
          senderAvatar: '/default-avatar.png',
          message: 'Thanks for the follow!',
          timestamp: new Date(Date.now() - 86400000),
          unread: false
        },
        {
          id: '3',
          senderId: 'user4',
          senderName: 'Tech Dude',
          senderAvatar: '/default-avatar.png',
          message: 'Can we collaborate on a project?',
          timestamp: new Date(Date.now() - 172800000),
          unread: false
        },
        {
          id: '4',
          senderId: 'user5',
          senderName: 'Creative Mind',
          senderAvatar: '/default-avatar.png',
          message: 'Your content is amazing!',
          timestamp: new Date(Date.now() - 259200000),
          unread: false
        },
      ];
      setMessages(mockMessages);
      setLoading(false);
    }, 500);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your messages</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>
        
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/20 ${
                  message.unread ? 'border-purple-500/50 bg-purple-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={message.senderAvatar} 
                    alt={message.senderName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white">{message.senderName}</h3>
                      <span className="text-xs text-white/60 whitespace-nowrap ml-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1 truncate">{message.message}</p>
                    <div className="text-xs text-white/50 mt-2">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                  {message.unread && (
                    <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">You have no messages yet</p>
            <p className="text-white/50 text-sm mt-2">Your conversations will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}