'use client';

import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import MoodSelector from './MoodSelector';
import VideoUpload from './VideoUpload';
import NavigationMenu from './NavigationMenu';
import RealTimeContent from './RealTimeContent';
import { recommendationEngine, Video } from '@/services/recommendationEngine';

export default function VideoFeed() {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleMoodSelect = async (moodId: string) => {
    setCurrentMood(moodId);
    recommendationEngine.logMoodSelection(moodId);
    
    // Get new videos based on selected mood
    const moodVideos = await recommendationEngine.getVideosForMood(moodId);
    setVideos(moodVideos);
  };

  const handleMediaUpload = (mediaData: any) => {
    // Add new media to recommendation engine
    recommendationEngine.addVideo(mediaData);
    
    // Refresh video list if current mood matches
    if (currentMood && mediaData.mood === currentMood) {
      handleMoodSelect(currentMood); // Re-fetch videos for current mood
    }
  };

  // Load initial videos
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const initialVideos = await recommendationEngine.getTrendingVideos();
        setVideos(initialVideos);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load videos:', error);
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

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

    if (isUpSwipe) {
      // Handle swipe down for next video navigation if needed
    } else if (isDownSwipe) {
      // Handle swipe up for previous video navigation if needed
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden relative"
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
        <VideoUpload onMediaUpload={handleMediaUpload} />
      </div>
      
      <div className="h-full pt-16 pb-20 md:pt-0 md:pb-0">
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
        ) : currentMood ? (
          <RealTimeContent mood={currentMood} />
        ) : (
          <div className="h-screen w-full flex items-center justify-center relative">
            <div className="text-center max-w-md z-10 px-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No Mood Selected</h3>
              <p className="text-white/80 mb-6 leading-relaxed">Select your mood to see personalized content or upload your own!</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Menu - Mobile optimized */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 md:static md:transform-none">
        <NavigationMenu />
      </div>
    </div>
  );
}