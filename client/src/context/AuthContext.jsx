import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('voyanta_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profileData = await api.getProfile();
          setUser(profileData.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('voyanta_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password, preferences) => {
    const res = await api.register({ name, email, password, preferences });
    localStorage.setItem('voyanta_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('voyanta_token');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = async (preferences) => {
    if (!user) return;
    const res = await api.updateProfile({ preferences });
    setUser(res.user);
  };

  const updateAvatar = async (avatar) => {
    if (!user) return;
    const res = await api.updateProfile({ avatar });
    setUser(res.user);
    return res.user;
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const res = await api.updateProfile(data);
    setUser(res.user);
    return res.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePreferences,
        updateAvatar,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
