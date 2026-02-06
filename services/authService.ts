import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { UserData } from '../types/user';

const USERS_COLLECTION = 'users';

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register new user
  register: async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile in Firebase Auth
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create user profile in Firestore
      await addDoc(collection(db, USERS_COLLECTION), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current authenticated user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<UserData | null> => {
    try {
      const q = query(collection(db, USERS_COLLECTION), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (!userData) return null;
        
        return { 
          id: querySnapshot.docs[0].id, 
          ...userData, 
          createdAt: userData.createdAt && typeof userData.createdAt === 'object' && 'toDate' in userData.createdAt 
            ? userData.createdAt.toDate() 
            : userData.createdAt 
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
    try {
      const q = query(collection(db, USERS_COLLECTION), where('uid', '==', uid));
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