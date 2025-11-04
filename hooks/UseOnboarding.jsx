import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export const useOnboarding = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkOnboardingStatus();
        setupAuthListener();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
            const hasUserCompletedOnboarding = onboardingCompleted === 'true';


            const user = auth.currentUser;
            if (user) {

                setIsFirstLaunch(false);
            } else {
                setIsFirstLaunch(!hasUserCompletedOnboarding);
            }
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            setIsFirstLaunch(true);
        } finally {
            setIsLoading(false);
        }
    };

    const setupAuthListener = () => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {

                setIsFirstLaunch(false);
            }
        });
    };

    const completeOnboardingForNewUser = async (user) => {
        try {

            await AsyncStorage.setItem('@onboarding_completed', 'true');


            setIsFirstLaunch(false);
        } catch (error) {
            console.error('Error completing onboarding for new user:', error);
        }
    };

    return {
        isFirstLaunch,
        isLoading,
        user,
        completeOnboardingForNewUser
    };
};