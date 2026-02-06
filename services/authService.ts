import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile,
  Auth
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { UserData } from '../types/user';

const USERS_COLLECTION = 'users';

export const authService = {
  // Check if Firebase is initialized
  checkFirebaseInitialized: (): boolean => {
    return auth !== undefined && db !== undefined;
  },

  // Login user
  login: async (email: string, password: string): Promise<User> => {
    if (!auth || !db) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const authInstance = auth as Auth;
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      return userCredential.user!;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register new user
  register: async (email: string, password: string, displayName?: string): Promise<User> => {
    if (!auth || !db) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const authInstance = auth as Auth;
      const dbInstance = db as Firestore;
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      
      // Update profile in Firebase Auth
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
      
      // Create user profile in Firestore
      if (user) {
        await addDoc(collection(dbInstance, USERS_COLLECTION), {
          uid: user.uid,
          email: user.email!,
          displayName: displayName || email.split('@')[0],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return user!;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    if (!auth || !db) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const authInstance = auth as Auth;
      await signOut(authInstance);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current authenticated user
  getCurrentUser: (): User | null => {
    if (!auth || !db) {
      return null;
    }
    return auth?.currentUser || null;
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<UserData | null> => {
    if (!auth || !db) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const dbInstance = db as Firestore;
      const q = query(collection(dbInstance, USERS_COLLECTION), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        if (!docSnapshot) return null;
        
        const userData = docSnapshot.data();
        if (!userData) return null;
        
        return { 
          id: docSnapshot.id, 
          ...userData, 
          uid: userData.uid ?? '',
          email: userData.email ?? '',
          displayName: userData.displayName ?? '',
          createdAt: userData.createdAt && typeof userData.createdAt === 'object' && 'toDate' in userData.createdAt 
            ? (userData.createdAt as any).toDate() 
            : userData.createdAt ?? new Date(),
          updatedAt: userData.updatedAt && typeof userData.updatedAt === 'object' && 'toDate' in userData.updatedAt
            ? (userData.updatedAt as any).toDate()
            : userData.updatedAt
        } as UserData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile in Firestore
  updateUserProfile: async (uid: string, userData: Partial<UserData>) => {
    if (!auth || !db) {
      throw new Error('Firebase is not initialized');
    }
    
    try {
      const dbInstance = db as Firestore;
      const q = query(collection(dbInstance, USERS_COLLECTION), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...userData, updatedAt: serverTimestamp() });
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};