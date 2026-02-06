'use client';

import { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import { authService } from '@/services/authService';

export default function UploadPage() {
  const [currentUser] = useState(authService.getCurrentUser());
  
  // Handle media upload completion
  const handleMediaUpload = (mediaData: any) => {
    console.log('Media uploaded:', mediaData);
    // Here you could add logic to redirect to the feed or show success message
    // For now, we'll just log the upload and let the modal close itself
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-white">Upload Video</h1>
        {currentUser ? (
          <VideoUpload onMediaUpload={handleMediaUpload} />
        ) : (
          <div className="text-center text-white">
            <p>Please log in to upload videos</p>
          </div>
        )}
      </div>
    </div>
  );
}