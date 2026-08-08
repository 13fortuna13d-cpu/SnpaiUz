import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRwONg2OI5R37886Fi1ydi8Fll3IzwaCA",
  authDomain: "anisenpaiuz.firebaseapp.com",
  databaseURL: "https://anisenpaiuz-default-rtdb.firebaseio.com",
  projectId: "anisenpaiuz",
  storageBucket: "anisenpaiuz.firebasestorage.app",
  messagingSenderId: "343430867430",
  appId: "1:343430867430:web:6ed6e64911c5070ea5ce27",
  measurementId: "G-W0LEJ5S1KG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
