


// src/lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAJZNOuE5iVUhoU8SU7KNxjv2o0igoIHpM",
  authDomain: "wishliist-46291.firebaseapp.com",
  projectId: "wishliist-46291",
  storageBucket: "wishliist-46291.appspot.com",
  messagingSenderId: "637859537516",
  appId: "1:637859537516:web:0edd6379b53fa944776e49",
  measurementId: "G-H0QB3WGNMD"
};

// Avoid "Firebase app already initialized" error
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
