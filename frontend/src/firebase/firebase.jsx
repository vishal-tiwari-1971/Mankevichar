import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOXM3uoV1gzMBuuNSIT9X6t8rKHRS7pG8",
  authDomain: "man-ke-vichar.firebaseapp.com",
  projectId: "man-ke-vichar",
  storageBucket: "man-ke-vichar.firebasestorage.app",
  messagingSenderId: "536298110294",
  appId: "1:536298110294:web:b6a845393bef1303bb6af7",
  measurementId: "G-4KL49T03GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);