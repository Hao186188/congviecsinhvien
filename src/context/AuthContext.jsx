import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await apiService.getCurrentUser();
        setUser(response.data.user);
        apiService.setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await apiService.login(credentials);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await apiService.register(userData);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    apiService.removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: apiService.isAuthenticated(),
    isEmployer: apiService.isEmployer(),
    isStudent: apiService.isStudent()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};