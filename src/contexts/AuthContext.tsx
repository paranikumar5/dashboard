import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole') as 'customer' | 'admin' | null;
    
    if (isLoggedIn && userEmail) {
      const mockUser: User = {
        id: 'mock-id',
        name: userEmail.split('@')[0],
        email: userEmail,
        role: userRole || (userEmail.includes('admin') ? 'admin' : 'customer')
      };
      setToken('mock-token');
      setUser(mockUser);
    }
  }, []);

  const login = (email: string, role?: 'customer' | 'admin') => {
    const finalRole = role || (email.includes('admin') ? 'admin' : 'customer');
    const mockUser: User = {
      id: 'mock-id',
      name: email.split('@')[0],
      email: email,
      role: finalRole
    };
    setToken('mock-token');
    setUser(mockUser);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', finalRole);
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
