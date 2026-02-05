export interface MoodData {
  id: string;
  name: string;
  description: string;
  recommendedVideoCategories: string[];
  color: string;
  icon: string;
}

export const moodCategories: MoodData[] = [
  {
    id: 'happy',
    name: 'Happy',
    description: 'Feeling joyful and positive',
    recommendedVideoCategories: ['comedy', 'music', 'dance', 'pets', 'funny'],
    color: '#FBBF24',
    icon: '😊'
  },
  {
    id: 'sad',
    name: 'Sad',
    description: 'Feeling down or melancholic',
    recommendedVideoCategories: ['motivational', 'comforting', 'music', 'nature', 'inspirational'],
    color: '#60A5FA',
    icon: '😢'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Feeling pumped and ready to go',
    recommendedVideoCategories: ['workout', 'dance', 'sports', 'music', 'challenges'],
    color: '#F87171',
    icon: '⚡'
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Feeling peaceful and relaxed',
    recommendedVideoCategories: ['nature', 'meditation', 'sleep', 'ocean', 'rain'],
    color: '#34D399',
    icon: '😌'
  },
  {
    id: 'focused',
    name: 'Focused',
    description: 'Feeling concentrated and productive',
    recommendedVideoCategories: ['educational', 'tutorial', 'study', 'productivity', 'tech'],
    color: '#A78BFA',
    icon: '🎯'
  },
  {
    id: 'tired',
    name: 'Tired',
    description: 'Feeling sleepy or fatigued',
    recommendedVideoCategories: ['sleep', 'relaxing', 'nature', 'soft music', 'bedtime'],
    color: '#9CA3AF',
    icon: '😴'
  }
];

export interface MoodLog {
  id: string;
  moodId: string;
  timestamp: Date;
  notes?: string;
  videoId?: string;
}

export const getMoodById = (id: string): MoodData | undefined => {
  return moodCategories.find(mood => mood.id === id);
};

export const getRecommendedVideosForMood = (moodId: string) => {
  const mood = getMoodById(moodId);
  if (!mood) return [];
  
  // Nanti akan diintegrasikan dengan sistem rekomendasi video
  return mood.recommendedVideoCategories;
};