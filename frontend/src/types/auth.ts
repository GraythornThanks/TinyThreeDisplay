export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface LoginForm {
    password: string;
}

export interface RegisterForm extends LoginForm {
    email: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface Admin {
    id: number;
    nickname: string | null;
    avatar_path: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface AdminUpdateForm {
    nickname?: string;
    bio?: string;
    password?: string;
} 