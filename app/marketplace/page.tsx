'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { DatabaseService } from '@/services/databaseService';
import VideoCard from '@/components/VideoCard';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  category: string;
  rating: number;
  sales: number;
}

export default function MarketplacePage() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Simulate loading marketplace items
    setTimeout(() => {
      const mockItems: MarketplaceItem[] = [
        {
          id: '1',
          title: 'Trending Dance Moves',
          description: 'Latest viral dance compilation with trending moves',
          price: 4.99,
          creator: 'DanceMaster',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'dance',
          rating: 4.8,
          sales: 124
        },
        {
          id: '2',
          title: 'Music Transition Pack',
          description: 'Smooth transitions perfect for music videos',
          price: 2.99,
          creator: 'AudioExpert',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'audio',
          rating: 4.6,
          sales: 89
        },
        {
          id: '3',
          title: 'Film Effect Collection',
          description: 'Professional film effects for cinematic content',
          price: 7.99,
          creator: 'CinemaPro',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'effects',
          rating: 4.9,
          sales: 210
        },
        {
          id: '4',
          title: 'Voice Over Templates',
          description: 'Premium voice over templates for your content',
          price: 5.49,
          creator: 'VoiceArtist',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'audio',
          rating: 4.7,
          sales: 76
        },
        {
          id: '5',
          title: 'Color Grading Presets',
          description: 'Professional color grading presets for videos',
          price: 3.99,
          creator: 'ColorGuru',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'editing',
          rating: 4.5,
          sales: 142
        },
        {
          id: '6',
          title: 'Intro Animation Pack',
          description: 'Stunning intro animations for your videos',
          price: 6.99,
          creator: 'MotionDesigner',
          creatorAvatar: '/default-avatar.png',
          thumbnail: '/default-thumbnail.png',
          category: 'animation',
          rating: 4.9,
          sales: 187
        }
      ];
      setItems(mockItems);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['all', 'dance', 'audio', 'effects', 'editing', 'animation'];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access the marketplace</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-2">Creator Marketplace</h1>
        <p className="text-white/70 mb-8">Find premium content to enhance your creations</p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full capitalize ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Marketplace Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="bg-black/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={item.creatorAvatar} 
                      alt={item.creator}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{item.title}</h3>
                      <p className="text-white/70 text-sm">{item.creator}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-white/80 text-sm">{item.rating}</span>
                      <span className="text-white/50 text-xs mx-2">•</span>
                      <span className="text-white/50 text-xs">{item.sales} sales</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">${item.price.toFixed(2)}</div>
                      <button className="mt-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full hover:opacity-90 transition-opacity">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No items found in this category</p>
            <p className="text-white/50 text-sm mt-2">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}