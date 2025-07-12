// Caloriq/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "caloriq-new.firebaseapp.com",
  projectId: "caloriq-new",
  storageBucket: "caloriq-new.firebasestorage.app",
  messagingSenderId: "330886661560",
  appId: "1:330886661560:web:bcc681760a584c820e3b4d",
  measurementId: "G-YLBCLNFCZK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const analytics = getAnalytics(app);