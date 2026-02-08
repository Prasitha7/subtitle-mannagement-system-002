import { USER_API_URL } from "./config";
import { UserProfile } from "../types/user";

export const userApi = {
    getProfile: async (): Promise<UserProfile> => {
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${USER_API_URL}/api/user/profile`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return response.json();
    },
};
