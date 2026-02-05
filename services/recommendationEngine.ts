import { DatabaseService, VideoData } from './databaseService';

export interface Video {
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
  mood?: string;
  createdAt?: Date;
}

export interface MoodLog {
  id: string;
  moodId: string;
  timestamp: Date;
  videoId?: string;
}

export class RecommendationEngine {
  private moodLogs: MoodLog[] = [];
  private mockVideos: Video[] = [
    {
      id: '1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      user: { username: 'nature_lover', avatar: 'https://i.pravatar.cc/150?img=1' },
      description: 'Beautiful sunset at the beach 🌅',
      music: 'Original Sound - nature_lover',
      likes: 12500,
      comments: 342,
      shares: 890,
      mood: 'calm'
    },
    {
      id: '2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      user: { username: 'tech_guru', avatar: 'https://i.pravatar.cc/150?img=2' },
      description: 'Latest tech gadgets review 🔥',
      music: 'Original Sound - tech_guru',
      likes: 8900,
      comments: 156,
      shares: 432,
      mood: 'focused'
    },
    {
      id: '3',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      user: { username: 'fitness_fan', avatar: 'https://i.pravatar.cc/150?img=3' },
      description: 'Morning workout routine 💪',
      music: 'Original Sound - fitness_fan',
      likes: 15600,
      comments: 567,
      shares: 1200,
      mood: 'energetic'
    }
  ];

  // Get videos from database or fallback to mock data
  async getVideosForMood(moodId: string): Promise<Video[]> {
    try {
      // Try to get from database first
      const dbVideos = await DatabaseService.getVideosByMood(moodId, 20);
      
      if (dbVideos.length > 0) {
        return dbVideos.map(video => ({
          id: video.id,
          url: video.url,
          user: {
            username: video.username,
            avatar: video.userAvatar
          },
          description: video.description,
          music: `Original Sound - ${video.username}`,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
          mood: video.mood,
          createdAt: video.createdAt
        }));
      }
      
      // Fallback to mock data if no database videos
      return this.mockVideos.filter(video => video.mood === moodId);
    } catch (error) {
      console.error('Error fetching videos for mood:', error);
      // Return mock data as fallback
      return this.mockVideos.filter(video => video.mood === moodId);
    }
  }

  // Get trending videos from database
  async getTrendingVideos(): Promise<Video[]> {
    try {
      const dbVideos = await DatabaseService.getTrendingVideos(20);
      
      if (dbVideos.length > 0) {
        return dbVideos.map(video => ({
          id: video.id,
          url: video.url,
          user: {
            username: video.username,
            avatar: video.userAvatar
          },
          description: video.description,
          music: `Original Sound - ${video.username}`,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
          mood: video.mood,
          createdAt: video.createdAt
        }));
      }
      
      // Fallback to mock data
      return this.mockVideos;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return this.mockVideos;
    }
  }

  // Add new video to database
  async addVideo(videoData: any): Promise<void> {
    try {
      await DatabaseService.saveVideo({
        url: videoData.url,
        description: videoData.description,
        mood: videoData.mood,
        username: videoData.user?.username || 'anonymous',
        userAvatar: videoData.user?.avatar || '/default-avatar.png',
        likes: 0,
        comments: 0,
        shares: 0,
        music: videoData.music || `Original Sound - ${videoData.user?.username || 'anonymous'}`,
        status: videoData.status || 'published'
      });
    } catch (error) {
      console.error('Error adding video:', error);
    }
  }

  // Log mood selection for analytics
  logMoodSelection(moodId: string, videoId?: string): void {
    const log: MoodLog = {
      id: Date.now().toString(),
      moodId,
      timestamp: new Date(),
      videoId
    };
    this.moodLogs.push(log);
    
    // In a real app, you'd send this to analytics service
    console.log('Mood selected:', moodId, 'Video:', videoId);
  }

  // Get mood analytics
  getMoodAnalytics(): Record<string, number> {
    const analytics: Record<string, number> = {};
    this.moodLogs.forEach(log => {
      analytics[log.moodId] = (analytics[log.moodId] || 0) + 1;
    });
    return analytics;
  }

  // Get user's recent mood preferences
  getUserMoodPreferences(userId: string, limit: number = 5): string[] {
    // In a real app, you'd query user-specific data
    const recentLogs = this.moodLogs
      .filter(log => log.videoId) // Only logs with video interactions
      .slice(-limit)
      .map(log => log.moodId);
    
    const uniqueLogs = Array.from(new Set(recentLogs)); // Remove duplicates
    return uniqueLogs;
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();