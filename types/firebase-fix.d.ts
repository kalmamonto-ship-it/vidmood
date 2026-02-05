// Temporary fix for Firebase type issues
declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}