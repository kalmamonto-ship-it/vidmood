'use client';

import { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import BottomNavigation from '@/components/BottomNavigation';
import { authService } from '@/services/authService';
import AuthModal from '@/components/AuthModal';
import CommentSection from '@/components/CommentSection';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleAuthSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  const handleShowComments = (videoId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedVideoId(videoId);
    setShowCommentSection(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <VideoFeed />
      </div>
      
      <BottomNavigation />
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}
      
      {showCommentSection && selectedVideoId && (
        <CommentSection 
          videoId={selectedVideoId} 
          isOpen={showCommentSection} 
          onClose={() => setShowCommentSection(false)} 
        />
      )}
    </main>
  );
}