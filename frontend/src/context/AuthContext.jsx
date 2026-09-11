import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ngo_user');
    const token = localStorage.getItem('ngo_auth_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ngo_user');
        localStorage.removeItem('ngo_auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('ngo_auth_token', data.token);
    localStorage.setItem('ngo_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await api.register(name, email, password, role);
    localStorage.setItem('ngo_auth_token', data.token);
    localStorage.setItem('ngo_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const demoLogin = async (role = 'citizen') => {
    const data = await api.demoLogin(role);
    localStorage.setItem('ngo_auth_token', data.token);
    localStorage.setItem('ngo_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const loginWithGoogle = async (googleData) => {
    const data = await api.loginWithGoogle(googleData);
    localStorage.setItem('ngo_auth_token', data.token);
    localStorage.setItem('ngo_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ngo_auth_token');
    localStorage.removeItem('ngo_user');
    setUser(null);
  };

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    demoLogin,
    loginWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
