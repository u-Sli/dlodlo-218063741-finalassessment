import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCYPkPi0TvtbtXl-_3JfygXDvfKq0e3To0",
  authDomain: "final-assessment-f0cfd.firebaseapp.com",
  projectId: "final-assessment-f0cfd",
  storageBucket: "final-assessment-f0cfd.firebasestorage.app",
  messagingSenderId: "899482276477",
  appId: "899482276477:web:6e98b600c60536e70d9714"

};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };