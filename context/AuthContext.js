import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem('LOGIN_STATUS');
      if (status === 'true') {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem('LOGIN_STATUS', 'true');
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.setItem('LOGIN_STATUS', 'false');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
