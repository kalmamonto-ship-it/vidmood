export interface CommentData {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  likes?: number;
  parentId?: string; // For nested replies
}