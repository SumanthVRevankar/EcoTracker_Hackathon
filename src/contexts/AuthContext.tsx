import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  city: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, city: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    if (username === 'admin' && password === '123') {
      const user = { id: 1, username: 'admin', email: 'admin@example.com', city: 'New York', isAdmin: true };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    if (username && password) {
      const user = { id: 2, username, email: `${username}@example.com`, city: 'Default City' };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, city: string): Promise<boolean> => {
    // Mock registration
    if (username && email && password && city) {
      const user = { id: Date.now(), username, email, city };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};