// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDnK7340u9pIVY6tBvAWyJtBqcXluiB6s",
  authDomain: "fidiciary-os.firebaseapp.com",
  projectId: "fidiciary-os",
  storageBucket: "fidiciary-os.firebasestorage.app",
  messagingSenderId: "878263687470",
  appId: "1:878263687470:web:f8be3c4c824aebf0e9c2bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
