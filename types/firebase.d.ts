// Firebase v9+ Modular SDK Type Declarations

// Core App Module
declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: FirebaseOptions;
    automaticDataCollectionEnabled: boolean;
  }
  
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }
  
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export const SDK_VERSION: string;
}

// Auth Module
declare module 'firebase/auth' {
  import { FirebaseApp } from 'firebase/app';
  
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: UserMetadata;
    providerData: UserInfo[];
    refreshToken: string;
    tenantId: string | null;
    delete(): Promise<void>;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    reload(): Promise<void>;
    toJSON(): object;
  }
  
  export interface UserMetadata {
    creationTime?: string;
    lastSignInTime?: string;
  }
  
  export interface UserInfo {
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
  }
  
  export interface IdTokenResult {
    authTime: string;
    claims: {
      [key: string]: any;
    };
    expirationTime: string;
    issuedAtTime: string;
    signInProvider: string | null;
    signInSecondFactor: string | null;
    token: string;
  }
  
  export interface Auth {
    app: FirebaseApp;
    currentUser: User | null;
    languageCode: string | null;
    settings: AuthSettings;
    tenantId: string | null;
    useDeviceLanguage(): void;
    signOut(): Promise<void>;
  }
  
  export interface AuthSettings {
    appVerificationDisabledForTesting: boolean;
  }
  
  export function getAuth(app?: FirebaseApp): Auth;
  export function onAuthStateChanged(auth: Auth, nextOrObserver: (user: User | null) => void, error?: (error: Error) => void, completed?: () => void): () => void;
  export function signOut(auth: Auth): Promise<void>;
  export function signInAnonymously(auth: Auth): Promise<UserCredential>;
  
  // Additional auth functions
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function updateProfile(user: User | null, profile: { displayName?: string | null; photoURL?: string | null; }): Promise<void>;
  export function sendPasswordResetEmail(auth: Auth, email: string): Promise<void>;
  export function confirmPasswordReset(auth: Auth, oobCode: string, newPassword: string): Promise<void>;
  export function applyActionCode(auth: Auth, oobCode: string): Promise<void>;
  export function checkActionCode(auth: Auth, oobCode: string): Promise<ActionCodeInfo>;
  
  export interface ActionCodeInfo {
    data: {
      email?: string;
      fromEmail?: string;
      multiFactorInfo?: MultiFactorInfo | null;
      previousEmail?: string;
    };
    operation: string;
  }
  
  export interface MultiFactorInfo {
    displayName: string | null;
    enrollmentTime: string;
    factorId: string;
  }
  
  export interface UserCredential {
    user: User;
    providerId: string | null;
    operationType: string;
  }
}

// Firestore Module
declare module 'firebase/firestore' {
  import { FirebaseApp } from 'firebase/app';
  
  export interface Firestore {
    app: FirebaseApp;
    type: 'firestore';
  }
  
  export interface DocumentData {
    [field: string]: any;
  }
  
  export interface DocumentSnapshot<T = DocumentData> {
    exists(): boolean;
    get(fieldPath: string | FieldPath): any;
    data(): T | undefined;
    id: string;
    ref: DocumentReference<T>;
  }
  
  export interface QuerySnapshot<T = DocumentData> {
    docs: Array<DocumentSnapshot<T>>;
    empty: boolean;
    size: number;
    forEach(callback: (result: DocumentSnapshot<T>) => void): void;
  }
  
  export interface DocumentReference<T = DocumentData> {
    id: string;
    path: string;
    parent: CollectionReference<T>;
  }
  
  export interface CollectionReference<T = DocumentData> extends Query<T> {
    id: string;
    path: string;
    parent: DocumentReference | null;
    doc(documentPath?: string): DocumentReference<T>;
  }
  
  export interface Query<T = DocumentData> {
    where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): Query<T>;
    orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): Query<T>;
    limit(limit: number): Query<T>;
    get(): Promise<QuerySnapshot<T>>;
    onSnapshot(next: (snapshot: QuerySnapshot<T>) => void, error?: (error: Error) => void): () => void;
  }
  
  export interface QuerySnapshot<T = DocumentData> {
    docs: Array<QueryDocumentSnapshot<T>>;
    docChanges(): Array<DocumentChange<T>>;
    empty: boolean;
    size: number;
    forEach(callback: (result: QueryDocumentSnapshot<T>) => void): void;
  }
  
  export type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
  export type OrderByDirection = 'desc' | 'asc';
  
  // Additional types needed for Firestore operations
  export interface Timestamp {
    seconds: number;
    nanoseconds: number;
    toDate(): Date;
    toMillis(): number;
  }
  
  export interface DocumentChange<T = DocumentData> {
    type: 'added' | 'removed' | 'modified';
    doc: QueryDocumentSnapshot<T>;
    oldIndex: number;
    newIndex: number;
  }
  
  export interface QueryDocumentSnapshot<T = DocumentData> extends DocumentSnapshot<T> {
    data(): T;
  }
  
  export type Unsubscribe = () => void;
  
  export class FieldPath {
    constructor(...fieldNames: string[]);
    static documentId(): FieldPath;
  }
  
  export function getFirestore(app?: FirebaseApp): Firestore;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function getDoc<T>(reference: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function getDocs<T>(query: Query<T>): Promise<QuerySnapshot<T>>;
  export function setDoc<T>(reference: DocumentReference<T>, data: T): Promise<void>;
  export function addDoc<T>(reference: CollectionReference<T>, data: T): Promise<DocumentReference<T>>;
  export function updateDoc(reference: DocumentReference, data: Partial<DocumentData>): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
  export function onSnapshot<T>(reference: DocumentReference<T>, next: (snapshot: DocumentSnapshot<T>) => void, error?: (error: Error) => void): () => void;
  export function onSnapshot<T>(query: Query<T>, next: (snapshot: QuerySnapshot<T>) => void, error?: (error: Error) => void): () => void;
  export function query<T>(query: Query<T>, ...queryConstraints: any[]): Query<T>;
  export function increment(n: number): any; // FieldValue
  export function serverTimestamp(): any; // FieldValue
  export function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): any; // QueryConstraint
  export function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): any; // QueryConstraint
  export function limit(limit: number): any; // QueryConstraint
}

// Storage Module
declare module 'firebase/storage' {
  import { FirebaseApp } from 'firebase/app';
  
  // Re-export common types if needed
  export type UploadResult = {
    ref: StorageReference;
    metadata: FullMetadata;
  };
  
  export interface UploadMetadata {
    contentType?: string;
    customMetadata?: { [key: string]: string };
  }
    
  export function uploadBytes(ref: StorageReference, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata): Promise<UploadResult>;
  
  export interface FirebaseStorage {
    app: FirebaseApp;
    maxOperationRetryTime: number;
    maxUploadRetryTime: number;
  }
  
  export interface StorageReference {
    bucket: string;
    fullPath: string;
    name: string;
    parent: StorageReference | null;
    root: StorageReference;
    storage: FirebaseStorage;
    toString(): string;
  }
  
  export interface UploadTask {
    snapshot: UploadTaskSnapshot;
    cancel(): boolean;
    catch(onRejected: (error: Error) => any): Promise<any>;
    on(event: 'state_changed', nextOrObserver: (snapshot: UploadTaskSnapshot) => any, error?: (error: Error) => any, complete?: () => void): () => void;
    pause(): boolean;
    resume(): boolean;
    then(onFulfilled?: ((snapshot: UploadTaskSnapshot) => any) | null, onRejected?: ((error: Error) => any) | null): Promise<any>;
  }
  
  export interface UploadTaskSnapshot {
    bytesTransferred: number;
    metadata: FullMetadata;
    ref: StorageReference;
    state: TaskState;
    totalBytes: number;
  }
  
  export interface FullMetadata {
    bucket: string;
    fullPath: string;
    generation: string;
    metageneration: string;
    name: string;
    size: number;
    timeCreated: string;
    updated: string;
    md5Hash?: string;
    cacheControl?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    contentLanguage?: string;
    contentType?: string;
    customMetadata?: {
      [key: string]: string;
    };
  }
  
  export type TaskState = 'running' | 'paused' | 'success' | 'canceled' | 'error';
  
  export function getStorage(app?: FirebaseApp, bucketUrl?: string): FirebaseStorage;
  export function ref(storage: FirebaseStorage, path?: string): StorageReference;
  export function uploadBytesResumable(ref: StorageReference, data: Blob | Uint8Array | ArrayBuffer, metadata?: {
    contentType?: string;
    customMetadata?: { [key: string]: string };
  }): UploadTask;
  export function getDownloadURL(ref: StorageReference): Promise<string>;
  export function deleteObject(ref: StorageReference): Promise<void>;
}