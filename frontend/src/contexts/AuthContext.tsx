import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Admin, LoginForm, AdminUpdateForm } from '../types/auth';
import { adminApi } from '../services/api';

interface AuthContextType {
    admin: Admin | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginForm) => Promise<void>;
    logout: () => void;
    updateProfile: (data: AdminUpdateForm) => Promise<void>;
    updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
            localStorage.removeItem('token');
            setAdmin(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginForm) => {
        const response = await adminApi.login(data);
        localStorage.setItem('token', response.access_token);
        const adminData = await adminApi.getMe();
        setAdmin(adminData);
        navigate('/admin');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAdmin(null);
        navigate('/login');
    };

    const updateProfile = async (data: AdminUpdateForm) => {
        const adminData = await adminApi.updateMe(data);
        setAdmin(adminData);
    };

    const updateAvatar = async (file: File) => {
        const adminData = await adminApi.updateAvatar(file);
        setAdmin(adminData);
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                isAuthenticated: !!admin,
                isLoading,
                login,
                logout,
                updateProfile,
                updateAvatar,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 