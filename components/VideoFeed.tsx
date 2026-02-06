'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DatabaseService } from '../services/databaseService';
import VideoCard from './VideoCard';

interface VideoData {
  id: string;
  url: string;
  thumbnail?: string;
  description: string;
  mood: string;
  userId?: string;
  username: string;
  userAvatar: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  status: 'pending' | 'processing' | 'published';
}

interface VideoFeedProps {
  initialVideos?: VideoData[];
  moodFilter?: string;
  showComments?: (videoId: string) => void;
}

export default function VideoFeed({ initialVideos = [], moodFilter, showComments }: VideoFeedProps) {
  const [videos, setVideos] = useState<VideoData[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastVideoElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreVideos();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  const loadVideos = async () => {
    try {
      setLoading(true);
      let loadedVideos: VideoData[];
      
      if (moodFilter) {
        loadedVideos = await DatabaseService.getVideosByMood(moodFilter, 10);
      } else {
        const result = await DatabaseService.getVideosWithPagination(null, 10);
        loadedVideos = result.videos;
        setLastVisible(result.lastVisible);
      }
      
      setVideos(loadedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMoreVideos = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      const result = await DatabaseService.getVideosWithPagination(lastVisible, 10);
      const newVideos = result.videos;
      
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
        setLastVisible(result.lastVisible);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadVideos();
  }, [moodFilter]);
  
  return (
    <div className="space-y-4 pb-20">
      {videos.map((video, index) => {
        if (videos.length === index + 1) {
          return (
            <div ref={lastVideoElementRef} key={video.id}>
              <VideoCard 
                video={video} 
                isMuted={false} 
                onMuteToggle={() => {}} 
                showComments={showComments || (() => {})} 
              />
            </div>
          );
        } else {
          return <VideoCard 
            key={video.id} 
            video={video} 
            isMuted={false} 
            onMuteToggle={() => {}} 
            showComments={showComments || (() => {})} 
          />;
        }
      })}
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!hasMore && videos.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          You've reached the end!
        </div>
      )}
    </div>
  );
}