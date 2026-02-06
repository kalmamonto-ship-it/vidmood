'use client';

import { useState } from 'react';
import ActionButtons from './ActionButtons';

interface VideoCardProps {
  video: {
    id: string;
    url: string;
    user?: {
      username: string;
      avatar: string;
    };
    description: string;
    music: string;
    likes: number;
    comments: number;
    shares: number;
  };
  isMuted: boolean;
  onMuteToggle: () => void;
  showComments: (videoId: string) => void;
}

export default function VideoCard({ video, isMuted, onMuteToggle, showComments }: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = () => {
    showComments(video.id);
  };

  const handleShare = () => {
    console.log('Share video:', video.id);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Video Player */}
      <div className="w-full h-full relative overflow-hidden">
        <video
          src={video.url}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        
        {/* Enhanced Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        </div>
        
        {/* Subtle video border glow */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-sm pointer-events-none"></div>
      </div>

      {/* User Info - Bottom Left - Responsive positioning */}
      <div className="absolute bottom-24 left-4 z-10 md:bottom-20">
        <div className="flex items-center space-x-3 max-w-xs">
          {video.user ? (
            <>
              <img 
                src={video.user.avatar} 
                alt={video.user.username}
                className="w-10 h-10 rounded-full border-2 border-white object-cover md:w-12 md:h-12"
              />
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm md:text-base">@{video.user.username}</h3>
                <p className="text-white text-xs md:text-sm truncate">{video.description}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-white/80 text-xs">🎵</span>
                  <span className="text-white/80 text-xs truncate">{video.music}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="min-w-0">
              <p className="text-white text-xs md:text-sm truncate max-w-[200px]">{video.description}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-white/80 text-xs">🎵</span>
                <span className="text-white/80 text-xs truncate">{video.music}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Right Side - Responsive positioning */}
      <div className="absolute right-4 bottom-24 z-10 md:right-6 md:bottom-20">
        <ActionButtons
          video={{
            id: video.id,
            isLiked,
            likes: likeCount,
            comments: video.comments,
            shares: video.shares,
            isMuted
          }}
          onLike={handleLike}
          onComment={() => {}} // Placeholder since we're using showComments
          onShare={handleShare}
          onMute={onMuteToggle}
          showComments={handleComment}
        />
      </div>
    </div>
  );
}