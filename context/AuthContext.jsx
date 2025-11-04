import React, { createContext, useState, useEffect, useContext } from 'react';
import { setupAuthListener, signOutUser } from '../services/FirebaseAuth';
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
    const unsubscribe = setupAuthListener((user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
      const isFirst = onboardingCompleted !== true;
      setIsFirstLaunch(isFirst);
    } catch (error) {
      setIsFirstLaunch(true);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', true);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    isFirstLaunch,
    completeOnboarding,
    logout,
    setUser,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};