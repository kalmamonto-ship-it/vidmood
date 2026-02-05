'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface VideoUploadProps {
  onVideoUpload: (videoData: any) => void;
}

export default function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowUploadModal(true);
    }
  };

  const handleUpload = () => {
    if (!fileInputRef.current?.files?.[0] || !selectedMood) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const videoData = {
        id: Date.now().toString(),
        url: URL.createObjectURL(fileInputRef.current!.files![0]),
        description,
        mood: selectedMood,
        user: {
          username: 'you',
          avatar: '/default-avatar.png'
        },
        likes: 0,
        comments: 0,
        shares: 0
      };
      
      onVideoUpload(videoData);
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedMood('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const moods = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡' },
    { id: 'calm', name: 'Calm', emoji: '😌' },
    { id: 'focused', name: 'Focused', emoji: '🎯' },
    { id: 'tired', name: 'Tired', emoji: '😴' },
  ];

  return (
    <>
      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <Upload className="w-5 h-5 text-white" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal - Mobile optimized */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Upload Video</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your video about?"
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Select Mood
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                        selectedMood === mood.id
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50'
                          : 'bg-white/10 hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-white text-xs font-medium">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedMood || isUploading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Video'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}