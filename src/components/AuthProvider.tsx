import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, LoginRequest, RegisterRequest } from '@/api/auth-api';

interface AuthContextType {
    token: string | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on page refresh
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        const res = await authApi.login(data);
        localStorage.setItem('auth_token', res.token);
        setToken(res.token);
    };

    const register = async (data: RegisterRequest) => {
        await authApi.register(data);
        // registration does NOT log in automatically
    };

    const signOut = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
    };

    const value: AuthContextType = {
        token,
        loading,
        login,
        register,
        signOut,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
