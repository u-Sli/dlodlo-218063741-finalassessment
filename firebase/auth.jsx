import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';


export const signUp = async (email, password, userData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date(),
      onboardingCompleted: false,
      ...userData
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};


export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};


export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};


export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};


export const updateUserProfile = async (updates) => {
  try {
    await updateProfile(auth.currentUser, updates);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};


export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    }
    return { data: null, error: 'User not found' };
  } catch (error) {
    return { data: null, error: error.message };
  }
};


export const updateUserData = async (userId, updates) => {
  try {
    await setDoc(doc(db, 'users', userId), updates, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};


export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};


export const getCurrentUser = () => {
  return auth.currentUser;
};