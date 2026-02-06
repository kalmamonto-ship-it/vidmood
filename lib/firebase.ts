import { initializeApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

// Define the config type to avoid TypeScript errors
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : undefined,
  authDomain: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : undefined,
  projectId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : undefined,
  storageBucket: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : undefined,
  messagingSenderId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : undefined,
  appId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : undefined
};

// Initialize Firebase app
let app: any;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  if (app) {
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } else {
    // Fallback values if Firebase couldn't be initialized
    db = undefined;
    storage = undefined;
    auth = undefined;
  }
} else {
  // Server-side initialization will be skipped
  // This prevents Firebase from initializing on the server side
  app = undefined;
  db = undefined;
  storage = undefined;
  auth = undefined;
}

export { db, storage, auth };

// Export default app for any direct usage
export default app;