import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';


export const signUp = async (email, password, userData = {}) => {
    try {
        console.log('Starting sign up process for:', email);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Firebase user created, setting up Firestore document...');


        const userDoc = {
            uid: user.uid,
            email: user.email,
            displayName: userData.fullName || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            createdAt: new Date(),
            onboardingCompleted: false,
            lastLogin: new Date(),
            ...userData
        };

        await setDoc(doc(db, 'users', user.uid), userDoc);


        if (userData.fullName) {
            await updateProfile(user, {
                displayName: userData.fullName
            });
        }

        console.log('User document created successfully');
        return { user, error: null };
    } catch (error) {
        console.error('Sign up error:', error);

        let errorMessage = 'An error occurred during sign up';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please use a different email or sign in.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                break;
            case 'auth/weak-password':
                errorMessage = 'The password is too weak. Please use a stronger password.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            default:
                errorMessage = error.message || 'An unexpected error occurred';
        }

        return { user: null, error: errorMessage };
    }
};


export const signIn = async (email, password) => {
    try {
        console.log('Signing in user:', email);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        try {
            await updateDoc(doc(db, 'users', user.uid), {
                lastLogin: new Date()
            });
        } catch (firestoreError) {
            console.warn('Could not update last login timestamp:', firestoreError);
        }

        console.log('User signed in successfully');
        return { user, error: null };
    } catch (error) {
        console.error('Sign in error:', error);

        let errorMessage = 'An error occurred during sign in';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Please contact support.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please check your email or sign up.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            default:
                errorMessage = error.message || 'An unexpected error occurred';
        }

        return { user: null, error: errorMessage };
    }
};


export const signOutUser = async () => {
    try {
        console.log('Signing out user...');
        await signOut(auth);
        console.log('User signed out successfully');
        return { error: null };
    } catch (error) {
        console.error('Sign out error:', error);

        let errorMessage = 'An error occurred during sign out';

        switch (error.code) {
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            default:
                errorMessage = error.message || 'An unexpected error occurred';
        }

        return { error: errorMessage };
    }
};


export const resetPassword = async (email) => {
    try {
        console.log('Sending password reset email to:', email);

        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent successfully');
        return { error: null };
    } catch (error) {
        console.error('Password reset error:', error);

        let errorMessage = 'An error occurred while sending password reset email';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            default:
                errorMessage = error.message || 'An unexpected error occurred';
        }

        return { error: errorMessage };
    }
};


export const updateUserProfile = async (updates) => {
    try {
        if (!auth.currentUser) {
            throw new Error('No user is currently signed in');
        }

        console.log('Updating user profile...');
        await updateProfile(auth.currentUser, updates);
        console.log('User profile updated successfully');
        return { error: null };
    } catch (error) {
        console.error('Profile update error:', error);
        return { error: error.message };
    }
};


export const getUserData = async (userId) => {
    try {
        console.log('Fetching user data for:', userId);

        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data fetched successfully');
            return { data: userData, error: null };
        }

        console.log('User document not found');
        return { data: null, error: 'User not found' };
    } catch (error) {
        console.error('Get user data error:', error);
        return { data: null, error: error.message };
    }
};


export const updateUserData = async (userId, updates) => {
    try {
        console.log('Updating user data for:', userId);

        await updateDoc(doc(db, 'users', userId), updates);
        console.log('User data updated successfully');
        return { error: null };
    } catch (error) {
        console.error('Update user data error:', error);
        return { error: error.message };
    }
};


export const setupAuthListener = (callback) => {
    console.log('Setting up auth state listener...');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? `User ${user.uid} signed in` : 'User signed out');

        if (user) {

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists()) {

                    await setDoc(doc(db, 'users', user.uid), {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        createdAt: new Date(),
                        lastLogin: new Date(),
                        onboardingCompleted: false
                    });
                }
            } catch (error) {
                console.error('Error ensuring user document:', error);
            }
        }

        callback(user);
    });

    return unsubscribe;
};


export const getCurrentUser = () => {
    return auth.currentUser;
};


export const isAuthenticated = () => {
    return !!auth.currentUser;
};