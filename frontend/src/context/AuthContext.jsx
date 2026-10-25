import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skincare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('skincare_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on app launch
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('skincare_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
          localStorage.setItem('skincare_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session verification failed, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    // Listen for 401 unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { user: userData, access_token } = res.data;
    setUser(userData);
    setToken(access_token);
    localStorage.setItem('skincare_token', access_token);
    localStorage.setItem('skincare_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (fullName, email, password, confirmPassword) => {
    const res = await authService.register(fullName, email, password, confirmPassword);
    const { user: userData, access_token } = res.data;
    setUser(userData);
    setToken(access_token);
    localStorage.setItem('skincare_token', access_token);
    localStorage.setItem('skincare_user', JSON.stringify(userData));
    return userData;
  };

  const verifyRegistrationOtp = async (data) => {
    const res = await authService.verifyRegistrationOtp(data);
    const { user: userData, access_token } = res.data;
    setUser(userData);
    setToken(access_token);
    localStorage.setItem('skincare_token', access_token);
    localStorage.setItem('skincare_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    try {
      authService.logout().catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('skincare_token');
      localStorage.removeItem('skincare_user');
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('skincare_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        verifyRegistrationOtp,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
