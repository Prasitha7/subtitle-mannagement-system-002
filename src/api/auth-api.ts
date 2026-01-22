import { User } from '@/types/media'; // We might need a shared User type, or defining one here for now

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

// MOCK CONSTANTS
const MOCK_DELAY = 800;

export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        // PRODUCTION: 
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        // return response.json();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email && credentials.password) {
                    resolve({
                        token: 'dummy-jwt-token-xyz-123',
                        user: {
                            id: 'user-1',
                            email: credentials.email,
                            role: 'USER',
                        },
                    });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, MOCK_DELAY);
        });
    },

    register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
        // PRODUCTION: 
        // const response = await fetch('/api/auth/register', { ... });
        // return response.json();

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    token: 'dummy-jwt-token-abc-456',
                    user: {
                        id: 'user-2',
                        email: credentials.email,
                        role: 'USER',
                    },
                });
            }, MOCK_DELAY);
        });
    },

    verifyToken: async (token: string): Promise<User | null> => {
        // PRODUCTION: Validate token with backend or decode it safely
        // const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });

        return new Promise((resolve) => {
            setTimeout(() => {
                if (token) {
                    resolve({
                        // @ts-ignore - Temporary casting if types don't match exactly yet
                        id: 'user-1',
                        email: 'restored@example.com',
                        role: 'USER',
                    });
                } else {
                    resolve(null);
                }
            }, 200);
        });
    }
};
