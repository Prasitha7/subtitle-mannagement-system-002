export interface UserProfile {
    username: string;
    email: string; // usually not public, but for profile owner it's fine
    roles: string[];
    avatarUrl?: string; // Optional URL for profile picture
    stats: {
        totalSubtitles: number;
        totalTranslations: number;
        storageUsedMb: number;
        joinedDate: string; // ISO Date string
    };
    recentActivity: {
        id: string; // subtitle ID
        title: string;
        action: 'created' | 'edited' | 'translated';
        timestamp: string;
    }[];
}
