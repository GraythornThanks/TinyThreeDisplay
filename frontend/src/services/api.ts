import axios from 'axios';
import { LoginForm, AdminUpdateForm, Token, Admin } from '../types/auth';

const API_URL = '/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 管理员相关API
export const adminApi = {
    login: async (data: LoginForm): Promise<Token> => {
        const formData = new FormData();
        formData.append('username', 'admin'); // 固定用户名
        formData.append('password', data.password);
        
        const response = await api.post<Token>('/admin/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getMe: async (): Promise<Admin> => {
        const response = await api.get<Admin>('/admin/me');
        return response.data;
    },

    updateMe: async (data: AdminUpdateForm): Promise<Admin> => {
        const response = await api.put<Admin>('/admin/me', data);
        return response.data;
    },

    updateAvatar: async (file: File): Promise<Admin> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<Admin>('/admin/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

// 添加响应拦截器
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 清除本地存储的token
            localStorage.removeItem('token');
            // 重定向到登录页
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 