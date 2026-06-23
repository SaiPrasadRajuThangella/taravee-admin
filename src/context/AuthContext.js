import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, clearToken, getToken, setToken } from '../api';
import { ADMIN_KEY } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const stored = await AsyncStorage.getItem(ADMIN_KEY);
        if (stored) setAdmin(JSON.parse(stored));
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password);
    await setToken(data.token);
    const user = data.admin || { username };
    await AsyncStorage.setItem(ADMIN_KEY, JSON.stringify(user));
    setAdmin(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    await AsyncStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      bootstrapping,
      isAuthenticated: Boolean(admin),
      login,
      logout,
    }),
    [admin, bootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
