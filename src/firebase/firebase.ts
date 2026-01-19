// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getDatabase, ref, set, get, push, update, remove, onValue, off, DatabaseReference } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ2WW7xDNdEX8EDD29_KjeDiQOEjydUmk",
  authDomain: "medisync-c2ace.firebaseapp.com",
  projectId: "medisync-c2ace",
  storageBucket: "medisync-c2ace.firebasestorage.app",
  messagingSenderId: "604636007846",
  appId: "1:604636007846:web:17511bdb2ac7313f09d367",
  measurementId: "G-4PCFWDQJS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Export Firebase functions
export {
  initializeApp,
  getAnalytics,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
};

export type { FirebaseUser };

export default app;
