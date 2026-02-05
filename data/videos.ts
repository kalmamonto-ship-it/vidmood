export interface Video {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
}

export const videos: Video[] = [
  {
    id: "1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    user: {
      username: "vibesdaily",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    description: "Let the positive energy flow through you #moodbooster #goodvibes",
    music: "Original Sound - vibesdaily",
    likes: 12500,
    comments: 450,
    shares: 3400
  },
  {
    id: "2",
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-in-silhouette-1234-large.mp4",
    user: {
      username: "dancelover",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    description: "Movement is medicine for the soul #dance #moodbooster",
    music: "Dance Track - dancelover",
    likes: 8900,
    comments: 230,
    shares: 2100
  },
  {
    id: "3",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-1241-large.mp4",
    user: {
      username: "oceandreamer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    description: "Find peace in the rhythm of the waves #nature #calm",
    music: "Ocean Sounds - oceandreamer",
    likes: 15600,
    comments: 580,
    shares: 4200
  },
  {
    id: "4",
    url: "https://assets.mixkit.co/videos/preview/mixkit-city-lights-at-night-1245-large.mp4",
    user: {
      username: "urbexplorer",
      avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face"
    },
    description: "Urban beauty never gets old #citylife #nightvibes",
    music: "City Beats - urbexplorer",
    likes: 6700,
    comments: 190,
    shares: 1800
  },
  {
    id: "5",
    url: "https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-mountains-1250-large.mp4",
    user: {
      username: "mountainlover",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    description: "Every sunrise brings fresh opportunities #motivation #sunrise",
    music: "Nature Harmony - mountainlover",
    likes: 23400,
    comments: 890,
    shares: 5600
  }
];