// src/api/authApi.ts

const AUTH_BASE_URL = 'http://localhost:8081/auth';

export interface LoginRequest {
    username: string;   // 🔴 must be username
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    roles: string[];
}

export interface AuthResponse {
    token: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${AUTH_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Invalid username or password');
        }

        return response.json();
    },

    register: async (credentials: RegisterRequest) => {
        const response = await fetch(`${AUTH_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return response.json();
    },
};
