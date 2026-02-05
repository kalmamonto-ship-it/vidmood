export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  mood: string;
  source: 'upload' | 'tiktok' | 'youtube' | 'url';
  user?: {
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  tags?: string[];
}

export interface MoodPreference {
  mood: string;
  weight: number; // 0-100
}

export class MoodRecommendationEngine {
  private videos: Video[] = [];
  private userMoodHistory: { mood: string; timestamp: Date }[] = [];

  constructor() {
    // Load initial videos
    this.loadInitialVideos();
  }

  // Load initial video dataset
  private loadInitialVideos() {
    this.videos = [
      {
        id: "1",
        title: "Morning Vibes",
        description: "Starting the day with positive energy #moodbooster #goodvibes",
        url: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        mood: "happy",
        source: "tiktok",
        user: {
          username: "vibesdaily",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        likes: 12500,
        comments: 450,
        shares: 3400,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        tags: ["morning", "vibes", "happy"]
      },
      {
        id: "2",
        title: "Dance Therapy",
        description: "Movement is medicine for the soul #dance #moodbooster",
        url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-in-silhouette-1234-large.mp4",
        mood: "energetic",
        source: "tiktok",
        user: {
          username: "dancelover",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        likes: 8900,
        comments: 230,
        shares: 2100,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        tags: ["dance", "therapy", "energetic"]
      },
      {
        id: "3",
        title: "Ocean Peace",
        description: "Find peace in the rhythm of the waves #nature #calm",
        url: "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-1241-large.mp4",
        mood: "calm",
        source: "tiktok",
        user: {
          username: "oceandreamer",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
        },
        likes: 15600,
        comments: 580,
        shares: 4200,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        tags: ["ocean", "peace", "nature"]
      },
      {
        id: "4",
        title: "City Night Lights",
        description: "Urban beauty never gets old #citylife #nightvibes",
        url: "https://assets.mixkit.co/videos/preview/mixkit-city-lights-at-night-1245-large.mp4",
        mood: "focused",
        source: "tiktok",
        user: {
          username: "urbexplorer",
          avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face"
        },
        likes: 6700,
        comments: 190,
        shares: 1800,
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        tags: ["city", "night", "urban"]
      },
      {
        id: "5",
        title: "Sunrise Motivation",
        description: "Every sunrise brings fresh opportunities #motivation #sunrise",
        url: "https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-mountains-1250-large.mp4",
        mood: "happy",
        source: "tiktok",
        user: {
          username: "mountainlover",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        },
        likes: 23400,
        comments: 890,
        shares: 5600,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        tags: ["sunrise", "motivation", "mountains"]
      }
    ];
  }

  // Add new video to the system
  public addVideo(video: Video) {
    this.videos.unshift(video); // Add to beginning for recency
  }

  // Get videos based on current mood
  public getVideosForMood(mood: string | null, limit: number = 10): Video[] {
    if (!mood) {
      // Return trending videos if no mood selected
      return this.getTrendingVideos(limit);
    }

    // Filter videos by mood
    const moodVideos = this.videos.filter(video => video.mood === mood);
    
    // Sort by engagement and recency
    return moodVideos
      .sort((a, b) => {
        const engagementA = a.likes + a.comments * 2 + a.shares * 3;
        const engagementB = b.likes + b.comments * 2 + b.shares * 3;
        
        // Recency boost (newer videos get priority)
        const timeA = a.timestamp.getTime();
        const timeB = b.timestamp.getTime();
        const recencyBoostA = Math.max(0, (Date.now() - timeA) / (1000 * 60 * 60 * 24)); // Days ago
        const recencyBoostB = Math.max(0, (Date.now() - timeB) / (1000 * 60 * 60 * 24));
        
        return (engagementB - recencyBoostB * 100) - (engagementA - recencyBoostA * 100);
      })
      .slice(0, limit);
  }

  // Get trending videos across all moods
  public getTrendingVideos(limit: number = 10): Video[] {
    return this.videos
      .sort((a, b) => {
        const engagementA = a.likes + a.comments * 2 + a.shares * 3;
        const engagementB = b.likes + b.comments * 2 + b.shares * 3;
        return engagementB - engagementA;
      })
      .slice(0, limit);
  }

  // Get personalized recommendations based on mood history
  public getPersonalizedRecommendations(userMoodHistory: { mood: string; timestamp: Date }[], limit: number = 10): Video[] {
    // Count mood preferences from history
    const moodCounts: Record<string, number> = {};
    userMoodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Get top 3 preferred moods
    const preferredMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood]) => mood);

    if (preferredMoods.length === 0) {
      return this.getTrendingVideos(limit);
    }

    // Get videos from preferred moods
    let recommendedVideos: Video[] = [];
    preferredMoods.forEach(mood => {
      const moodVideos = this.getVideosForMood(mood, Math.ceil(limit / preferredMoods.length));
      recommendedVideos = [...recommendedVideos, ...moodVideos];
    });

    // Remove duplicates and limit
    const uniqueVideos = Array.from(new Set(recommendedVideos.map(v => v.id)))
      .map(id => recommendedVideos.find(v => v.id === id)!);

    return uniqueVideos.slice(0, limit);
  }

  // Log user mood selection
  public logMoodSelection(mood: string) {
    this.userMoodHistory.push({
      mood,
      timestamp: new Date()
    });
    
    // Keep only last 100 mood selections
    if (this.userMoodHistory.length > 100) {
      this.userMoodHistory = this.userMoodHistory.slice(-100);
    }
  }

  // Get mood analytics
  public getMoodAnalytics() {
    const moodCounts: Record<string, number> = {};
    this.userMoodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return {
      totalSelections: this.userMoodHistory.length,
      moodDistribution: moodCounts,
      recentMoods: this.userMoodHistory.slice(-10).map(entry => entry.mood)
    };
  }

  // Search videos by tags or description
  public searchVideos(query: string): Video[] {
    const searchTerm = query.toLowerCase();
    return this.videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm) ||
      video.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

// Export singleton instance
export const recommendationEngine = new MoodRecommendationEngine();