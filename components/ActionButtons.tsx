import { Heart, MessageCircle, Share, VolumeX, Volume2 } from 'lucide-react';

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
    <div className="absolute right-6 bottom-24 flex flex-col items-center space-y-5">
      {/* Like Button */}
      <div className="flex flex-col items-center group">
        <button 
          onClick={onLike}
          className="p-4 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-pink-500/20 border border-white/20"
        >
          <div className={`transition-all duration-300 ${video.isLiked ? "text-red-500 fill-current scale-110" : "text-white group-hover:text-pink-400"}`}>
            <Heart size={32} />
          </div>
        </button>
        <span className="text-white text-xs mt-2 font-bold drop-shadow-lg">{video.likes}</span>
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center group">
        <button 
          onClick={onComment}
          className="p-4 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/20 border border-white/20"
        >
          <div className="text-white group-hover:text-blue-400 transition-colors">
            <MessageCircle size={32} />
          </div>
        </button>
        <span className="text-white text-xs mt-2 font-bold drop-shadow-lg">{video.comments}</span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center group">
        <button 
          onClick={onShare}
          className="p-4 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/20 border border-white/20"
        >
          <div className="text-white group-hover:text-green-400 transition-colors">
            <Share size={32} />
          </div>
        </button>
        <span className="text-white text-xs mt-2 font-bold drop-shadow-lg">{video.shares}</span>
      </div>

      {/* Mute Button */}
      <div className="flex flex-col items-center group pt-4">
        <button 
          onClick={onMute}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500/60 to-pink-500/60 backdrop-blur-xl hover:from-purple-600/80 hover:to-pink-600/80 transition-all duration-300 hover:scale-110 shadow-lg border border-white/30"
        >
          <div className="text-white group-hover:scale-110 transition-transform">
            {video.isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
          </div>
        </button>
      </div>
    </div>
  );
}