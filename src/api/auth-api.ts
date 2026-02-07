import { AUTH_API_URL } from './config';

const AUTH_BASE_URL = `${AUTH_API_URL}/auth`;

export interface LoginRequest {
    username: string;
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
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Invalid username or password');
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
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Registration failed');
        }

        // Registration might not return a token, just 200 OK
        return response.text().then(text => text ? JSON.parse(text) : {});
    },
};
