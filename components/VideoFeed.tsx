'use client';

import { useState, useEffect } from 'react';
import { DatabaseService } from '@/services/databaseService';
import VideoCard from './VideoCard';

interface VideoFeedProps {
  requireAuth?: (action: () => void) => void; // Callback to handle authentication requirement
}

export default function VideoFeed({ requireAuth }: VideoFeedProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch all videos for public feed
        const videoData = await DatabaseService.getAllVideos(20);
        setVideos(videoData);
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Subscribe to real-time updates
    const unsubscribe = DatabaseService.subscribeToVideoFeed((updatedVideos) => {
      setVideos(updatedVideos);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No videos available yet</p>
        <p className="text-white/50 text-sm mt-2">Be the first to upload a video!</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          isMuted={isMuted} 
          onMuteToggle={toggleMute} 
          showComments={() => {}} // Will be handled by parent component
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
}