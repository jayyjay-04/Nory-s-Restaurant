// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // add this

const firebaseConfig = {
  apiKey: "AIzaSyC8ptvrj4uF0AkoGlFub7TGoRyRSP8ihPk",
  authDomain: "nory-s-resto-ordering-system.firebaseapp.com",
  projectId: "nory-s-resto-ordering-system",
  storageBucket: "nory-s-resto-ordering-system.firebasestorage.app",
  messagingSenderId: "128175632503",
  appId: "1:128175632503:web:262a732e74125a86125672",
  measurementId: "G-P74T6LGPQQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
