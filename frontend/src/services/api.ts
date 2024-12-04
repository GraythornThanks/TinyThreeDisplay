import axios, { AxiosError } from 'axios';
import { LoginForm, AdminUpdateForm, Token, Admin } from '../types/auth';
import { Model3D, PaginatedResponse } from '../types/model';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
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
        try {
            const response = await api.post<Token>('/admin/login', {
                password: data.password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMe: async (): Promise<Admin> => {
        try {
            const response = await api.get<Admin>('admin/me');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },

    updateMe: async (data: AdminUpdateForm): Promise<Admin> => {
        try {
            const response = await api.put<Admin>('admin/me', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },

    updatePassword: async (oldPassword: string, newPassword: string): Promise<Admin> => {
        try {
            const response = await api.post<Admin>('admin/me/password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },

    updateAvatar: async (file: File): Promise<Admin> => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await api.post<Admin>('admin/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },
};

// 模型相关API
export const modelApi = {
    getModels: async (page: number = 1, size: number = 10): Promise<PaginatedResponse<Model3D>> => {
        try {
            const response = await api.get<PaginatedResponse<Model3D>>('models', {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },

    getModel: async (id: number): Promise<Model3D> => {
        try {
            const response = await api.get<Model3D>(`models/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new AxiosError(
                        '网络连接失败，请检查网络后重试',
                        'NETWORK_ERROR'
                    );
                }
            }
            throw error;
        }
    },
};

// 添加响应拦截器
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url?.includes('/login')) {
            // 只有非登录接口的401错误才清除token并跳转
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
        }
        // 统一处理错误消息
        if (error.response?.data?.detail) {
            error.message = error.response.data.detail;
        } else if (!error.response) {
            error.message = '网络连接失败，请检查网络后重试';
        }
        return Promise.reject(error);
    }
);

export default api; 