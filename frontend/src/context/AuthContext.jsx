import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('truengo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('truengo_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session with server on boot
  useEffect(() => {
    const verifySession = async () => {
      // Check for OAuth redirect token in URL hash (e.g. #auth_success=<token>)
      const hash = window.location.hash;
      if (hash && hash.includes('auth_success=')) {
        const urlToken = decodeURIComponent(hash.split('auth_success=')[1].split('&')[0]);
        if (urlToken) {
          localStorage.setItem('truengo_token', urlToken);
          setToken(urlToken);
          window.location.hash = 'home';
        }
      }

      const activeToken = localStorage.getItem('truengo_token');
      if (!activeToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        if (data && data.user) {
          setUser(data.user);
          localStorage.setItem('truengo_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const saveAuthSession = (authData) => {
    if (!authData || !authData.user || !authData.token) return;
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('truengo_user', JSON.stringify(authData.user));
    localStorage.setItem('truengo_token', authData.token);
  };

  const demoLogin = async (role = 'citizen') => {
    const data = await api.demoLogin(role);
    saveAuthSession(data);
    return data;
  };

  const loginWithCredentials = async (email, password) => {
    const data = await api.login(email, password);
    saveAuthSession(data);
    return data;
  };

  const registerWithCredentials = async (name, email, password) => {
    const data = await api.register(name, email, password);
    saveAuthSession(data);
    return data;
  };

  const verifyEmailCode = async (email, code) => {
    const data = await api.verifyEmail(email, code);
    if (data && data.user && data.token) {
      saveAuthSession(data);
    } else if (data && data.emailVerified) {
      // Refresh current user
      await refreshUser();
    }
    return data;
  };

  const resendVerificationCode = async (email) => {
    return await api.resendVerification(email);
  };

  const loginWithGoogleToken = async (idToken) => {
    const data = await api.loginWithGoogle(idToken);
    saveAuthSession(data);
    return data;
  };

  const loginWithGithubCode = async (code, state) => {
    const data = await api.verifyGithubCallback(code, state);
    saveAuthSession(data);
    return data;
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('truengo_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.warn('Could not refresh user:', err.message);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('truengo_user');
    localStorage.removeItem('truengo_token');
    window.location.hash = 'home';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isEmailVerified: Boolean(user?.emailVerified || user?.email_verified),
        loginWithCredentials,
        registerWithCredentials,
        demoLogin,
        verifyEmailCode,
        resendVerificationCode,
        loginWithGoogleToken,
        loginWithGithubCode,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
