import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if specified in config
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || undefined);

export const auth = getAuth(app);
