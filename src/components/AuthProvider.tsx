
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, LoginRequest, RegisterRequest } from '@/api/auth-api';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    signOut: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('auth_token');
        const restoreSession = async () => {
            if (token) {
                try {
                    // Verify token or decode it.
                    // For now, authApi.verifyToken mocks this.
                    const userData = await authApi.verifyToken(token);
                    // @ts-ignore
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to restore session", error);
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        restoreSession();
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        localStorage.setItem('auth_token', response.token);
        // @ts-ignore
        setUser(response.user);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        localStorage.setItem('auth_token', response.token);
        // @ts-ignore
        setUser(response.user);
    };

    const signOut = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
