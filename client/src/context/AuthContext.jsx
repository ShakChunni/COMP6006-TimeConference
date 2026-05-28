import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const data = await apiRequest('/auth/user');
    setUser(data.user);
    setLoading(false);
  }

  async function demoLogin(name) {
    const loggedInUser = await apiRequest('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    setUser(loggedInUser);
  }

  async function logout() {
    await apiRequest('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  useEffect(() => {
    refreshUser().catch(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ user, loading, demoLogin, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
