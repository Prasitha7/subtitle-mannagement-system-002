export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';
export const SUBTITLE_API_URL = import.meta.env.VITE_SUBTITLE_API_URL || 'http://localhost:8083';
export const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8082';

export const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};
