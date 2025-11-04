import React, { createContext, useState, useEffect, useContext } from 'react';
import { setupAuthListener, signOutUser } from '../services/FirebaseAuth';

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

  useEffect(() => {
    const unsubscribe = setupAuthListener((user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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