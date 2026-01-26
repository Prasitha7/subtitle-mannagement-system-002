import { UserProfile } from "../types/user";

export const userApi = {
    getProfile: async (): Promise<UserProfile> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Return dummy data
        return {
            username: 'demo_user',
            email: 'demo@example.com',
            roles: ['USER', 'EDITOR'],
            avatarUrl: 'https://ui.shadcn.com/avatars/02.png', // Using a placeholder that looks nice
            stats: {
                totalSubtitles: 12,
                totalTranslations: 45,
                storageUsedMb: 156.4,
                joinedDate: '2025-01-15T10:00:00Z',
            },
            recentActivity: [
                {
                    id: '1',
                    title: 'Inception Movie Subs',
                    action: 'edited',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                },
                {
                    id: '2',
                    title: 'Interstellar - Spanish',
                    action: 'translated',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                },
                {
                    id: '3',
                    title: 'The Dark Knight',
                    action: 'created',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                },
            ],
        };
    },
};
