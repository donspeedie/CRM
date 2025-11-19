// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4UDxpAWp6my_kJCBeU8ZIcBkuoyn7-F0",
  authDomain: "habu-1gxak2.firebaseapp.com",
  databaseURL: "https://habu-1gxak2-default-rtdb.firebaseio.com",
  projectId: "habu-1gxak2",
  storageBucket: "habu-1gxak2.appspot.com",
  messagingSenderId: "959927583222",
  appId: "1:959927583222:web:d1bf5ad476dbfca0ac87d7",
  measurementId: "G-D60PG3C0C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
