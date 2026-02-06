'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { DatabaseService } from '@/services/databaseService';
import VideoCard from '@/components/VideoCard';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          
          // Fetch all videos and filter by current user
          const allVideos = await DatabaseService.getAllVideos(50); // Get up to 50 videos
          const userVids = allVideos.filter(video => video.userId === user.uid);
          setUserVideos(userVids);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-16 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </h1>
              <p className="text-white/70 mt-1">
                {userVideos.length} videos uploaded
              </p>
              <div className="flex space-x-4 mt-4">
                <div className="text-center">
                  <div className="text-white font-bold text-xl">{userVideos.length}</div>
                  <div className="text-white/70 text-sm">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-xl">128</div>
                  <div className="text-white/70 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-xl">56</div>
                  <div className="text-white/70 text-sm">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Videos */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Videos</h2>
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVideos.map((video) => (
                <VideoCard key={video.id} video={video} isMuted={false} onMuteToggle={() => {}} showComments={() => {}} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">You haven't uploaded any videos yet</p>
              <p className="text-white/50 text-sm mt-2">Share your first video with the world!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}