// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYlZYWKobrx6bt14Aolw0zAjKQ4YQpyFE",
  authDomain: "prepwise-ab611.firebaseapp.com",
  projectId: "prepwise-ab611",
  storageBucket: "prepwise-ab611.firebasestorage.app",
  messagingSenderId: "302293650872",
  appId: "1:302293650872:web:d654020a5acec01f90d34d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const db = getFirestore(app);
/**
 * 
 * 
 * Permissions here are much more limited compared to the server
 */