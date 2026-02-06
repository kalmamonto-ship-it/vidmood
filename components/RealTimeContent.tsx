'use client';

import { useEffect, useState } from 'react';
import { DatabaseService, VideoData, PhotoData } from '@/services/databaseService';
import VideoCard from './VideoCard';

interface RealTimeContentProps {
  mood: string;
}

export default function RealTimeContent({ mood }: RealTimeContentProps) {
  const [content, setContent] = useState<(VideoData | PhotoData)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeVideos: () => void;
    let unsubscribePhotos: () => void;

    const fetchInitialContent = async () => {
      setLoading(true);
      
      // Fetch initial videos and photos
      const [videos, photos] = await Promise.all([
        DatabaseService.getVideosByMood(mood),
        DatabaseService.getPhotosByMood(mood)
      ]);
      
      // Combine and sort by creation date
      const allContent = [...videos, ...photos]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setContent(allContent);
      setLoading(false);
    };

    fetchInitialContent();

    // Set up real-time listeners
    if (mood) {
      unsubscribeVideos = DatabaseService.subscribeToVideosByMood(mood, (newVideos) => {
        setContent(prev => {
          // Merge new videos with existing content
          const updatedContent = [...prev];
          newVideos.forEach(newVideo => {
            const existingIndex = updatedContent.findIndex(item => item.id === newVideo.id);
            if (existingIndex >= 0) {
              updatedContent[existingIndex] = newVideo;
            } else {
              updatedContent.push(newVideo);
            }
          });
          
          // Sort by creation date
          return updatedContent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        });
      });

      unsubscribePhotos = DatabaseService.subscribeToPhotosByMood(mood, (newPhotos) => {
        setContent(prev => {
          // Merge new photos with existing content
          const updatedContent = [...prev];
          newPhotos.forEach(newPhoto => {
            const existingIndex = updatedContent.findIndex(item => item.id === newPhoto.id);
            if (existingIndex >= 0) {
              updatedContent[existingIndex] = newPhoto;
            } else {
              updatedContent.push(newPhoto);
            }
          });
          
          // Sort by creation date
          return updatedContent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        });
      });
    }

    // Cleanup function
    return () => {
      if (unsubscribeVideos) unsubscribeVideos();
      if (unsubscribePhotos) unsubscribePhotos();
    };
  }, [mood]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => {
        if ('url' in item && item.url.includes('.mp4')) {
          // This is a video item
          return (
            <VideoCard
              key={item.id}
              video={item as VideoData}
              isMuted={false}
              onMuteToggle={() => {}}
              showComments={() => {}}
            />
          );
        } else {
          // This is a photo item
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={item.url} 
                alt={item.description} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.description}</h3>
                <p className="text-gray-600 text-sm mb-2">Mood: {item.mood}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Likes: {item.likes}</span>
                  <span>Comments: {item.comments}</span>
                  <span>Shares: {item.shares}</span>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}