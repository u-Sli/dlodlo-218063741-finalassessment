import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import { createUserDocument, updateUserDocument, getUserData } from '../firebase/FirestoreService';

export const signUp = async (email, password, userData = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocData = {
            email: user.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            displayName: userData.fullName || '',
            onboardingCompleted: false
        };

        const result = await createUserDocument(user.uid, userDocData);
        
        if (!result.success) {
            throw new Error(result.error);
        }

        if (userData.fullName) {
            await updateProfile(user, {
                displayName: userData.fullName
            });
        }

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateUserDocument(user.uid, {
            lastLogin: new Date()
        });

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

export const setupAuthListener = (callback) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { data: userData } = await getUserData(user.uid);
            if (!userData) {
                await createUserDocument(user.uid, {
                    email: user.email,
                    displayName: user.displayName || '',
                    onboardingCompleted: false
                });
            }
        }
        
        callback(user);
    });

    return unsubscribe;
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

export { onAuthStateChanged };
export const getCurrentUser = () => auth.currentUser;
export const isAuthenticated = () => !!auth.currentUser;