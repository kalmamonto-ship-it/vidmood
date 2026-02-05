'use client';

import { Heart, MessageCircle, Share, Volume2, VolumeX } from 'lucide-react';

interface ActionButtonsProps {
  video: {
    id: string;
    isLiked: boolean;
    likes: number;
    comments: number;
    shares: number;
    isMuted: boolean;
  };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onMute: () => void;
}

export default function ActionButtons({ video, onLike, onComment, onShare, onMute }: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Like Button */}
      <button 
        onClick={onLike}
        className="flex flex-col items-center group"
      >
        <div className={`p-3 rounded-full transition-all duration-300 ${
          video.isLiked 
            ? 'bg-red-500 text-white scale-110' 
            : 'bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 hover:scale-105'
        }`}>
          <Heart 
            className={`w-6 h-6 md:w-7 md:h-7 ${video.isLiked ? 'fill-current' : ''}`} 
          />
        </div>
        <span className="text-white text-xs mt-1 font-medium">
          {video.likes > 1000 ? `${(video.likes/1000).toFixed(1)}K` : video.likes}
        </span>
      </button>

      {/* Comment Button */}
      <button 
        onClick={onComment}
        className="flex flex-col items-center group"
      >
        <div className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <span className="text-white text-xs mt-1 font-medium">
          {video.comments > 1000 ? `${(video.comments/1000).toFixed(1)}K` : video.comments}
        </span>
      </button>

      {/* Share Button */}
      <button 
        onClick={onShare}
        className="flex flex-col items-center group"
      >
        <div className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <Share className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <span className="text-white text-xs mt-1 font-medium">
          {video.shares > 1000 ? `${(video.shares/1000).toFixed(1)}K` : video.shares}
        </span>
      </button>

      {/* Mute Button */}
      <button 
        onClick={onMute}
        className="flex flex-col items-center group mt-4"
      >
        <div className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
          {video.isMuted ? (
            <VolumeX className="w-6 h-6 md:w-7 md:h-7" />
          ) : (
            <Volume2 className="w-6 h-6 md:w-7 md:h-7" />
          )}
        </div>
        <span className="text-white text-xs mt-1 font-medium">
          {video.isMuted ? 'Muted' : 'Sound'}
        </span>
      </button>
    </div>
  );
}