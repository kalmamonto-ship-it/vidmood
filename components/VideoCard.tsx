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
}

export default function VideoCard({ video, isMuted, onMuteToggle }: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = () => {
    console.log('Comment on video:', video.id);
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
        />
        
        {/* Enhanced Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        </div>
        
        {/* Subtle video border glow */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-sm pointer-events-none"></div>
      </div>

      {/* User Info - Bottom Left */}
      <div className="absolute bottom-20 left-4 z-10">
        <div className="flex items-center space-x-3">
          {video.user ? (
            <>
              <img 
                src={video.user.avatar} 
                alt={video.user.username}
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div>
                <h3 className="text-white font-bold">@{video.user.username}</h3>
                <p className="text-white text-sm max-w-xs">{video.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-white/80 text-sm">🎵</span>
                  <span className="text-white/80 text-sm">{video.music}</span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="text-white text-sm max-w-xs">{video.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-white/80 text-sm">🎵</span>
                <span className="text-white/80 text-sm">{video.music}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Right Side */}
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
        onComment={handleComment}
        onShare={handleShare}
        onMute={onMuteToggle}
      />
    </div>
  );
}