import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGgtD5lP6cTyhvDSd3EsnUXLj39FtE49A",
  authDomain: "man-ke-vichar-fdd4d.firebaseapp.com",
  projectId: "man-ke-vichar-fdd4d",
  storageBucket: "man-ke-vichar-fdd4d.firebasestorage.app",
  messagingSenderId: "681872009583",
  appId: "1:681872009583:web:654a048820a62b2602209a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);