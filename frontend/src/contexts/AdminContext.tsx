import React, { createContext, useState, useEffect } from 'react';
import { Admin } from '../types/auth';
import { adminApi } from '../services/api';

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  updateAdmin: (admin: Admin) => void;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const adminData = await adminApi.getMe();
        setAdmin(adminData);
      }
    } catch (error) {
      console.error('Failed to fetch admin info:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string) => {
    try {
      const response = await adminApi.login({ password });
      localStorage.setItem('token', response.access_token);
      const adminData = await adminApi.getMe();
      setAdmin(adminData);
    } catch (error) {
      setAdmin(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  const updateAdmin = (updatedAdmin: Admin) => {
    setAdmin(updatedAdmin);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        updateAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}; 