'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera, Link } from 'lucide-react';

interface VideoUploadProps {
  onVideoUpload: (videoData: any) => void;
}

export default function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoUrl('');
    }
  };

  const handleUrlSubmit = () => {
    if (videoUrl) {
      // Nanti akan diintegrasikan dengan TikTok API atau parser
      console.log('Processing video URL:', videoUrl);
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !videoUrl) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulasi upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const videoData = {
        id: Date.now().toString(),
        title,
        description,
        mood: selectedMood,
        source: selectedFile ? 'upload' : 'url',
        url: selectedFile ? URL.createObjectURL(selectedFile) : videoUrl,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0
      };

      onVideoUpload(videoData);
      resetForm();
      
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setVideoUrl('');
    setTitle('');
    setDescription('');
    setSelectedMood('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-5 border border-white/20 w-80 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
        <h3 className="text-white font-bold mb-5 flex items-center text-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Upload className="text-white" size={18} />
          </div>
          Upload Your Vibe
        </h3>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Video File</label>
          <div 
            className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center cursor-pointer hover:border-white/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="mx-auto mb-2 text-white/60" size={24} />
            <p className="text-white/80 text-sm">
              {selectedFile ? selectedFile.name : 'Click to select video'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Or Video URL</label>
          <div className="flex">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={handleUrlSubmit}
              className="bg-blue-500 hover:bg-blue-600 px-3 rounded-r-lg"
            >
              <Link size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this video about?"
            rows={3}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none"
          />
        </div>

        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm mb-2">Mood Category</label>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
          >
            <option value="" className="bg-black">Select mood</option>
            <option value="happy" className="bg-black">😊 Happy</option>
            <option value="sad" className="bg-black">😢 Sad</option>
            <option value="energetic" className="bg-black">⚡ Energetic</option>
            <option value="calm" className="bg-black">😌 Calm</option>
            <option value="focused" className="bg-black">🎯 Focused</option>
            <option value="tired" className="bg-black">😴 Tired</option>
          </select>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || (!selectedFile && !videoUrl) || !title || !selectedMood}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Uploading... {uploadProgress}%
            </div>
          ) : (
            'Upload Video'
          )}
        </button>

        {isUploading && (
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}