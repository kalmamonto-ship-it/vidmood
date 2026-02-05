'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { DatabaseService } from '@/services/databaseService';

interface VideoUploadProps {
  onMediaUpload: (mediaData: any) => void;
}

export default function VideoUpload({ onMediaUpload }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaType, setMediaType] = useState<'video' | 'photo'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Determine media type based on file extension
      if (file.type.startsWith('image/')) {
        setMediaType('photo');
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
      }
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !selectedMood) return;
    
    const file = fileInputRef.current.files[0];
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      if (mediaType === 'video') {
        // Upload video to Firebase Storage
        const videoUrl = await DatabaseService.uploadVideoFile(file, 'current-user-id');
        
        // Save video metadata to Firestore
        const videoId = await DatabaseService.saveVideo({
          url: videoUrl,
          description,
          mood: selectedMood,
          username: 'you',
          userAvatar: '/default-avatar.png',
          music: 'Original Sound - you', // Added required music property
          likes: 0,
          comments: 0,
          shares: 0,
          status: 'published'
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Update UI with new video
        const videoData = {
          id: videoId,
          url: videoUrl,
          description,
          mood: selectedMood,
          user: {
            username: 'you',
            avatar: '/default-avatar.png'
          },
          likes: 0,
          comments: 0,
          shares: 0,
          createdAt: new Date()
        };

        onMediaUpload(videoData);
      } else if (mediaType === 'photo') {
        // Upload photo to Firebase Storage
        const photoUrl = await DatabaseService.uploadPhotoFile(file, 'current-user-id');
        
        // Save photo metadata to Firestore
        const photoId = await DatabaseService.savePhoto({
          url: photoUrl,
          description,
          mood: selectedMood,
          username: 'you',
          userAvatar: '/default-avatar.png',
          likes: 0,
          comments: 0,
          shares: 0,
          status: 'published'
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Update UI with new photo
        const photoData = {
          id: photoId,
          url: photoUrl,
          description,
          mood: selectedMood,
          user: {
            username: 'you',
            avatar: '/default-avatar.png'
          },
          likes: 0,
          comments: 0,
          shares: 0,
          createdAt: new Date()
        };

        onMediaUpload(photoData);
      }
      
      // Reset form
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setSelectedMood('');
        setDescription('');
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);

    } catch (error) {
      console.error(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} upload failed:`, error);
      setIsUploading(false);
      setUploadProgress(0);
      alert(`Upload failed. Please try again.`);
    }
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
      <div className="relative group">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
          Upload Media
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal - Mobile optimized */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Upload {mediaType === 'photo' ? 'Photo' : 'Video'}</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
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
                  placeholder={`Describe your ${mediaType === 'photo' ? 'photo' : 'video'}...`}
                  disabled={isUploading}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
                      disabled={isUploading}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                        selectedMood === mood.id
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50'
                          : 'bg-white/10 hover:bg-white/20 border border-white/10'
                      } disabled:opacity-50`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-white text-xs font-medium">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Type Indicator */}
              <div className="flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                  <span className="mr-2">{mediaType === 'photo' ? '📸' : '🎥'}</span>
                  {mediaType === 'photo' ? 'Photo' : 'Video'}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Uploading {mediaType}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedMood || !description || isUploading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  `Upload ${mediaType === 'photo' ? 'Photo' : 'Video'}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}