import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { CommentData } from '../types/comment';

const COMMENTS_COLLECTION = 'comments';

// Check if Firebase is initialized
const checkFirebaseInitialized = (): boolean => {
  return db !== undefined;
};

export const commentService = {
  // Get comments by video ID
  getCommentsByVideoId: async (videoId: string): Promise<CommentData[]> => {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const q = query(
        collection(db!, COMMENTS_COLLECTION), 
        where('videoId', '==', videoId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const comments: CommentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
        } as CommentData);
      });
      
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment
  addComment: async (commentData: Omit<CommentData, 'id' | 'createdAt'>): Promise<string> => {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const docRef = await addDoc(collection(db!, COMMENTS_COLLECTION), {
        ...commentData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId: string, commentData: Partial<CommentData>): Promise<void> => {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const docRef = doc(db!, COMMENTS_COLLECTION, commentId);
      await updateDoc(docRef, { ...commentData });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const docRef = doc(db!, COMMENTS_COLLECTION, commentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};