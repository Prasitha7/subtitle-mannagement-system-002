import { MediaItem } from '@/types/media';

// Reuse the sample media for the mock
const sampleMedia: MediaItem[] = [
    {
        id: 'movie-1',
        title: 'Inception',
        year: 2010,
        duration: '2h 28m',
        type: 'movie',
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.',
        subtitles: [
            { id: 'sub-1', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-15' },
            { id: 'sub-2', language: 'Spanish', languageCode: 'es', format: 'SRT', addedAt: '2024-01-16' },
        ],
    },
    {
        id: 'movie-2',
        title: 'Interstellar',
        year: 2014,
        duration: '2h 49m',
        type: 'movie',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        subtitles: [
            { id: 'sub-3', language: 'English', languageCode: 'en', format: 'VTT', addedAt: '2024-02-10' },
        ],
    },
    {
        id: 'series-1',
        title: 'Breaking Bad',
        year: 2008,
        type: 'series',
        posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80',
        description: 'A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.',
        seasons: [
            {
                id: 'season-1',
                number: 1,
                title: 'Season 1',
                episodes: [
                    {
                        id: 'ep-1-1',
                        number: 1,
                        title: 'Pilot',
                        duration: '58m',
                        subtitles: [
                            { id: 'sub-4', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-20' },
                        ],
                    },
                    {
                        id: 'ep-1-2',
                        number: 2,
                        title: "Cat's in the Bag...",
                        duration: '48m',
                        subtitles: [],
                    },
                ],
            },
        ],
    },
];

const MOCK_DELAY = 600;

export const mediaApi = {
    getAll: async (
        page: number = 1,
        limit: number = 10,
        type?: 'movie' | 'series' | 'all',
        search?: string
    ): Promise<{ items: MediaItem[], total: number }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...sampleMedia];

                // 1. Filter by Type
                if (type && type !== 'all') {
                    filtered = filtered.filter(item => item.type === type);
                }

                // 2. Filter by Search
                if (search) {
                    const query = search.toLowerCase();
                    filtered = filtered.filter(item =>
                        item.title.toLowerCase().includes(query)
                    );
                }

                // 3. Paginate
                const total = filtered.length;
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const items = filtered.slice(startIndex, endIndex);

                resolve({ items, total });
            }, MOCK_DELAY);
        });
    },

    // Legacy search method kept for backward compatibility if needed, 
    // but the new unified getAll is preferred.
    search: async (query: string): Promise<MediaItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = sampleMedia.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
                resolve(results);
            }, MOCK_DELAY);
        });
    },

    // Add other methods as needed: addMedia, addSubtitle, etc.
};
