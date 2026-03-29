import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, apiFetch } from '../config';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/auth/check/`);
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string) => {
    try {
      // First, hit the check endpoint to get the CSRF cookie
      await apiFetch(`${API_BASE_URL}/api/auth/check/`);

      const res = await apiFetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'Network error. Is the server running?' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: 'POST',
      });
    } catch {
      // Logout even if request fails
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
