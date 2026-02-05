'use client';

import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import MoodSelector from './MoodSelector';
import VideoUpload from './VideoUpload';
import NavigationMenu from './NavigationMenu';
import { recommendationEngine, Video } from '@/services/recommendationEngine';

export default function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleMoodSelect = (moodId: string) => {
    setCurrentMood(moodId);
    recommendationEngine.logMoodSelection(moodId);
    
    // Get new videos based on selected mood
    const moodVideos = recommendationEngine.getVideosForMood(moodId);
    setVideos(moodVideos);
    setCurrentVideoIndex(0); // Reset to first video
  };

  const handleVideoUpload = (videoData: any) => {
    // Add new video to recommendation engine
    recommendationEngine.addVideo(videoData);
    
    // Refresh video list if current mood matches
    if (currentMood && videoData.mood === currentMood) {
      const updatedVideos = recommendationEngine.getVideosForMood(currentMood);
      setVideos(updatedVideos);
    }
  };

  // Load initial videos
  useEffect(() => {
    const loadVideos = () => {
      try {
        const initialVideos = recommendationEngine.getTrendingVideos();
        setVideos(initialVideos);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load videos:', error);
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handleScroll = (e: WheelEvent) => {
    if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
      // Scroll down
      setCurrentVideoIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      // Scroll up
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (isDownSwipe && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden relative"
      onWheel={(e) => handleScroll(e.nativeEvent as unknown as WheelEvent)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Mood Selector - Responsive positioning */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 md:static md:transform-none">
        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          currentMood={currentMood}
        />
      </div>
      
      {/* Video Upload - Responsive positioning */}
      <div className="absolute top-4 right-4 z-30 md:static md:transform-none">
        <VideoUpload onVideoUpload={handleVideoUpload} />
      </div>
      
      <div 
        className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ transform: `translateY(-${currentVideoIndex * 100}vh)` }}
      >
        {isLoading ? (
          <div className="h-screen w-full flex items-center justify-center relative">
            <div className="text-center z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 opacity-50" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading Your Mood Feed</h2>
              <p className="text-white/70">Finding the perfect videos for your vibe...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-screen w-full flex items-center justify-center relative">
            <div className="text-center max-w-md z-10 px-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No Videos Yet</h3>
              <p className="text-white/80 mb-6 leading-relaxed">Start by selecting your mood or upload your first video to get the party started!</p>
              <button 
                onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
              >
                Upload Your First Video
              </button>
            </div>
          </div>
        ) : (
          videos.map((video, index) => (
            <div key={video.id} className="h-screen w-full relative">
              <div className={`absolute inset-0 transition-opacity duration-1000 ${index === currentVideoIndex ? 'opacity-100' : 'opacity-0'}`}>
                <VideoCard
                  video={{
                    ...video,
                    music: video.user?.username ? `Original Sound - ${video.user.username}` : "Original Sound"
                  }}
                  isMuted={isMuted}
                  onMuteToggle={handleMuteToggle}
                />
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Enhanced Scroll indicator - Mobile optimized */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20 md:right-6 md:space-y-3">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ease-out md:w-3 md:h-3 ${
              index === currentVideoIndex 
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125 shadow-lg shadow-purple-500/50' 
                : 'bg-white/30 hover:bg-white/50 backdrop-blur-sm'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Menu - Mobile optimized */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 md:static md:transform-none">
        <NavigationMenu />
      </div>
    </div>
  );
}