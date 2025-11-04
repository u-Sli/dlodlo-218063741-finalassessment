import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  setupAuthListener,
  getCurrentUser,
  getUserData,
  signOutUser,
  updateUserProfile
} from '../services/FirebaseAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
    const unsubscribe = setupAuthListener(async (user) => {
      if (user) {
        setUser(user);

        const { data } = await getUserData(user.uid);
        setUserData(data);


        if (data?.onboardingCompleted) {
          await AsyncStorage.setItem('@onboarding_completed', 'true');
          setIsFirstLaunch(false);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
      setIsFirstLaunch(onboardingCompleted !== 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsFirstLaunch(true);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      if (user) {

        const { updateUserData } = await import('../services/FirebaseAuth');
        await updateUserData(user.uid, {
          onboardingCompleted: true,
          onboardingCompletedAt: new Date()
        });
      }
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();

    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await updateUserProfile(updates);
      if (error) {
        throw new Error(error);
      }


      if (user) {
        setUser({
          ...user,
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshUserData = async () => {
    if (user) {
      const { data } = await getUserData(user.uid);
      setUserData(data);
    }
  };

  const value = {

    user,
    userData,
    loading,
    isFirstLaunch,


    completeOnboarding,
    logout,
    updateProfile,
    refreshUserData,


    setUser,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};