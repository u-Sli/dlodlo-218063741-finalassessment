import { 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';

export const usersCollection = collection(db, 'users');

export const getUserDocument = (userId) => {
    return doc(db, 'users', userId);
};

const convertToStrictBoolean = (value) => {
    if (value === true || value === false) {
        return value;
    }
    if (value === 'true' || value === 'false') {
        return value === 'true';
    }
    return value;
};

export const createUserDocument = async (userId, userData) => {
    try {
        const userDoc = getUserDocument(userId);
        
        const onboardingCompleted = convertToStrictBoolean(userData.onboardingCompleted);
        
        const userDataWithTimestamps = {
            email: String(userData.email || ''),
            firstName: String(userData.firstName || ''),
            lastName: String(userData.lastName || ''),
            displayName: String(userData.displayName || ''),
            onboardingCompleted: onboardingCompleted,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        };
        
        await setDoc(userDoc, userDataWithTimestamps);
        return { success: true, error: null };
    } catch (error) {
        console.error('Error creating user document:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserDocument = async (userId, updates) => {
    try {
        const userDoc = getUserDocument(userId);
        
        const cleanUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            if (key === 'onboardingCompleted' || key.includes('Completed') || key.startsWith('is')) {
                cleanUpdates[key] = convertToStrictBoolean(value);
            } else if (typeof value === 'string') {
                cleanUpdates[key] = String(value);
            } else if (typeof value === 'number') {
                cleanUpdates[key] = Number(value);
            } else if (value instanceof Date) {
                cleanUpdates[key] = value;
            } else {
                cleanUpdates[key] = value;
            }
        }
        
        const updatesWithTimestamp = {
            ...cleanUpdates,
            updatedAt: serverTimestamp()
        };
        
        await updateDoc(userDoc, updatesWithTimestamp);
        return { success: true, error: null };
    } catch (error) {
        console.error('Error updating user document:', error);
        return { success: false, error: error.message };
    }
};

export const getUserData = async (userId) => {
    try {
        const userDoc = getUserDocument(userId);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            
            const cleanData = {};
            for (const [key, value] of Object.entries(data)) {
                if (key === 'onboardingCompleted' || key.includes('Completed') || key.startsWith('is')) {
                    cleanData[key] = convertToStrictBoolean(value);
                } else {
                    cleanData[key] = value;
                }
            }
            
            return { data: cleanData, error: null };
        } else {
            return { data: null, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return { data: null, error: error.message };
    }
};