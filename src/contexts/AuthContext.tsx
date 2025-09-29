import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  updateUserRole: (newRole: string) => void;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    // localStorage.setItem('user', JSON.stringify(userData));
    // localStorage.setItem('accessToken', token);
  };

  const logout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      await axios.post(
        `${API_URL}/auth/refresh/logout`,
        {},
        { withCredentials: true } // ✅ Make sure cookies are included
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      // localStorage.removeItem("user");
      // localStorage.removeItem("accessToken");
    }
  };

  const updateUserRole = (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      // localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   const storedToken = localStorage.getItem('accessToken');

  //   if (storedUser && storedToken) {
  //     setUser(JSON.parse(storedUser));
  //     setAccessToken(storedToken);
  //   }
  // }, []);

  const value = {
    user,
    accessToken,
    login,
    logout,
    updateUserRole,
    isAuthenticated: !!user && !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};