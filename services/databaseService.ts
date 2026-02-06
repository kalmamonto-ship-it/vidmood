import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  QueryDocumentSnapshot,
  onSnapshot,
  Unsubscribe,
  DocumentChange,
  QuerySnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Check if Firebase is initialized
const checkFirebaseInitialized = (): boolean => {
  return db !== undefined && storage !== undefined;
};

export interface VideoData {
  id: string;
  url: string;
  thumbnail?: string;
  description: string;
  mood: string;
  userId?: string;
  username: string;
  userAvatar: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  status: 'pending' | 'processing' | 'published';
}

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  createdAt: Date;
}

export interface PhotoData {
  id: string;
  url: string;
  thumbnail?: string;
  description: string;
  mood: string;
  userId?: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  status: 'pending' | 'processing' | 'published';
}

export interface RealTimeUpdateCallback {
  (data: any[]): void;
}

export class DatabaseService {
  // Upload video file to Firebase Storage
  static async uploadVideoFile(file: File, userId: string): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${file.name}`;
      const storageRef = ref(storage!, `videos/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  // Upload thumbnail image to Firebase Storage
  static async uploadThumbnail(file: File, userId: string): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const timestamp = Date.now();
      const fileName = `${userId}_thumb_${timestamp}_${file.name}`;
      const storageRef = ref(storage!, `thumbnails/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw new Error('Failed to upload thumbnail');
    }
  }

  // Save video metadata to Firestore
  static async saveVideo(videoData: Omit<VideoData, 'id' | 'createdAt'>): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const videoDoc = {
        ...videoData,
        createdAt: serverTimestamp(),
        status: 'published'
      };

      const docRef = await addDoc(collection(db!, 'videos'), videoDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error saving video:', error);
      throw new Error('Failed to save video');
    }
  }

  // Get videos by mood
  static async getVideosByMood(mood: string, limitCount: number = 20): Promise<VideoData[]> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const q = query(
        collection(db!, 'videos'),
        where('mood', '==', mood),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as VideoData;
      });
    } catch (error) {
      console.error('Error fetching videos by mood:', error);
      return [];
    }
  }

  // Get trending videos
  static async getTrendingVideos(limitCount: number = 20): Promise<VideoData[]> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const q = query(
        collection(db!, 'videos'),
        where('status', '==', 'published'),
        orderBy('likes', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as VideoData;
      });
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }
  }

  // Get all videos
  static async getAllVideos(limitCount: number = 50): Promise<VideoData[]> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const q = query(
        collection(db!, 'videos'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as VideoData;
      });
    } catch (error) {
      console.error('Error fetching all videos:', error);
      return [];
    }
  }

  // Update video likes
  static async updateVideoLikes(videoId: string, incrementBy: number): Promise<void> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const videoRef = doc(db!, 'videos', videoId);
      await updateDoc(videoRef, {
        likes: increment(incrementBy)
      });
    } catch (error) {
      console.error('Error updating video likes:', error);
      throw new Error('Failed to update likes');
    }
  }

  // Update video comments
  static async updateVideoComments(videoId: string, incrementBy: number): Promise<void> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const videoRef = doc(db!, 'videos', videoId);
      await updateDoc(videoRef, {
        comments: increment(incrementBy)
      });
    } catch (error) {
      console.error('Error updating video comments:', error);
      throw new Error('Failed to update comments');
    }
  }

  // Update video shares
  static async updateVideoShares(videoId: string, incrementBy: number): Promise<void> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const videoRef = doc(db!, 'videos', videoId);
      await updateDoc(videoRef, {
        shares: increment(incrementBy)
      });
    } catch (error) {
      console.error('Error updating video shares:', error);
      throw new Error('Failed to update shares');
    }
  }

  // Save user data
  static async saveUser(userData: Omit<UserData, 'id' | 'createdAt'>): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const userDoc = {
        ...userData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db!, 'users'), userDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<UserData | null> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const userRef = doc(db!, 'users', userId);
      const q = query(collection(db!, 'users'), where('id', '==', userId));
      const userDoc = await getDocs(q);
      
      if (userDoc.empty) return null;
      
      const data = userDoc.docs[0].data();
      return {
        id: userDoc.docs[0].id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as UserData;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Upload photo to Firebase Storage
  static async uploadPhotoFile(file: File, userId: string): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const timestamp = Date.now();
      const fileName = `${userId}_photo_${timestamp}_${file.name}`;
      const storageRef = ref(storage!, `photos/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload photo');
    }
  }

  // Save photo metadata to Firestore
  static async savePhoto(photoData: Omit<PhotoData, 'id' | 'createdAt'>): Promise<string> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const photoDoc = {
        ...photoData,
        createdAt: serverTimestamp(),
        status: 'published'
      };

      const docRef = await addDoc(collection(db!, 'photos'), photoDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw new Error('Failed to save photo');
    }
  }

  // Get photos by mood
  static async getPhotosByMood(mood: string, limitCount: number = 20): Promise<PhotoData[]> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const q = query(
        collection(db!, 'photos'),
        where('mood', '==', mood),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as PhotoData;
      });
    } catch (error) {
      console.error('Error fetching photos by mood:', error);
      return [];
    }
  }

  // Subscribe to real-time video updates by mood
  static subscribeToVideosByMood(mood: string, callback: RealTimeUpdateCallback): Unsubscribe {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    const q = query(
      collection(db!, 'videos'),
      where('mood', '==', mood),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const videos: VideoData[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          videos.push({
            id: change.doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as VideoData);
        }
      });
      callback(videos);
    });
  }

  // Subscribe to real-time photo updates by mood
  static subscribeToPhotosByMood(mood: string, callback: RealTimeUpdateCallback): Unsubscribe {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    const q = query(
      collection(db!, 'photos'),
      where('mood', '==', mood),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const photos: PhotoData[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          photos.push({
            id: change.doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as PhotoData);
        }
      });
      callback(photos);
    });
  }

  // Subscribe to real-time updates for all content
  static subscribeToAllContent(callback: RealTimeUpdateCallback): Unsubscribe {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    const q = query(
      collection(db!, 'videos'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const content: (VideoData | PhotoData)[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          content.push({
            id: change.doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as VideoData);
        }
      });
      callback(content);
    });
  }

  // Delete video and its associated files
  static async deleteVideo(videoId: string, videoUrl: string): Promise<boolean> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      // Delete from Firestore
      const videoRef = doc(db!, 'videos', videoId);
      await updateDoc(videoRef, { status: 'deleted' });
      
      // Optionally delete file from storage
      // Extract file path from URL and delete
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // Delete photo and its associated files
  static async deletePhoto(photoId: string): Promise<boolean> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      // Delete from Firestore
      const photoRef = doc(db!, 'photos', photoId);
      await updateDoc(photoRef, { status: 'deleted' });
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  // Get videos with pagination for infinite scroll
  static async getVideosWithPagination(lastVisible: any, limitCount: number = 10): Promise<{ videos: VideoData[], lastVisible: any }> {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      let q;
      if (lastVisible) {
        q = query(
          collection(db!, 'videos'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          collection(db!, 'videos'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const videos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as VideoData;
      });
      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return { videos, lastVisible: lastDoc };
    } catch (error) {
      console.error('Error fetching videos with pagination:', error);
      throw new Error('Failed to fetch videos');
    }
  }

  // Subscribe to real-time video updates for feed
  static subscribeToVideoFeed(callback: RealTimeUpdateCallback): Unsubscribe {
    if (!checkFirebaseInitialized()) {
      throw new Error('Firebase is not initialized');
    }
    
    const q = query(
      collection(db!, 'videos'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const videos: VideoData[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          videos.push({
            id: change.doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as VideoData);
        }
      });
      callback(videos);
    });
  }
}