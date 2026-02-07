import { MediaItem, PaginatedResponse, SubtitleTrack } from '@/types/media';
import { SUBTITLE_API_URL, getAuthHeaders } from './config';

const MEDIA_BASE_URL = `${SUBTITLE_API_URL}/api/media`;

export const mediaApi = {
    getAll: async (
        page: number = 1,
        limit: number = 10,
        type?: 'movie' | 'series' | 'all',
        search?: string
    ): Promise<PaginatedResponse<MediaItem>> => {
        const params = new URLSearchParams();
        params.append('page', (page - 1).toString()); // Backend is 0-indexed
        params.append('size', limit.toString());
        params.append('sort', 'id,desc');

        // Note: Check if backend supports these filters on the page endpoint
        // If not, we might need a separate search endpoint or client-side filtering
        if (search) params.append('search', search); // Assuming backend uses 'search' or similar
        // if (type && type !== 'all') params.append('type', type.toUpperCase()); 

        const response = await fetch(`${MEDIA_BASE_URL}/page?${params.toString()}`, {
            headers: {
                // Public endpoint usually, but sending auth if available is good practice
                ...getAuthHeaders(),
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch media');
        }

        const data = await response.json();

        // Transform backend response to frontend model
        const items = data.content.map(transformMedia);

        return {
            items,
            total: data.totalElements,
            page: data.number + 1, // Convert back to 1-indexed
            limit: data.size,
            totalPages: data.totalPages
        };
    },

    getById: async (id: string): Promise<MediaItem> => {
        // Fetch media details and subtitles in parallel
        const [mediaRes, subtitlesRes] = await Promise.all([
            fetch(`${MEDIA_BASE_URL}/${id}`, { headers: getAuthHeaders() }),
            fetch(`${SUBTITLE_API_URL}/api/subtitles/public?mediaId=${id}`, { headers: getAuthHeaders() })
        ]);

        if (!mediaRes.ok) {
            throw new Error('Failed to fetch media details');
        }

        const mediaData = await mediaRes.json();
        const media = transformMedia(mediaData);

        if (subtitlesRes.ok) {
            const subtitlesData = await subtitlesRes.json();
            // Map backend subtitles to frontend SubtitleTrack
            const subtitles: SubtitleTrack[] = subtitlesData.map((sub: any) => ({
                id: sub.id,
                language: sub.language,
                languageCode: sub.language.substring(0, 2).toLowerCase(), // heuristics
                format: 'SRT', // Default or derive from file mapping
                fileUrl: sub.fileUrl, // Ensure backend provides this or we construct it
                addedAt: sub.uploadedAt || new Date().toISOString()
            }));

            if (media.type === 'movie') {
                media.subtitles = subtitles;
            } else {
                // TODO: Distribute subtitles to episodes for Series
                // For now, we don't have episode logic fully mapped in backend response
            }
        }

        return media;
    },

    create: async (data: Partial<MediaItem>): Promise<MediaItem> => {
        // Strict payload for creation
        const payload = {
            title: data.title,
            type: data.type?.toUpperCase(), // Backend expects MOVIE or SERIES
            externalId: `manual-${Date.now()}`, // Generate if missing
            releaseDate: data.year ? `${data.year}-01-01` : new Date().toISOString().split('T')[0]
        };

        const response = await fetch(`${MEDIA_BASE_URL}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to create media');
        }

        const responseData = await response.json();
        return transformMedia(responseData);
    },

    // Legacy search compatibility
    search: async (query: string): Promise<MediaItem[]> => {
        const res = await mediaApi.getAll(1, 100, 'all', query);
        return res.items;
    }
};

const transformMedia = (data: any): MediaItem => {
    // Handle transformation from backend entity to MediaItem
    // Backend: id, title, type, externalId, releaseDate
    // Frontend: id, title, type, year, posterUrl?, backdropUrl?, description?

    const year = data.releaseDate ? new Date(data.releaseDate).getFullYear() : new Date().getFullYear();

    return {
        id: data.id,
        title: data.title,
        type: data.type?.toLowerCase() as 'movie' | 'series',
        year: year,
        // Default placeholders since backend doesn't have these yet
        description: data.description || 'No description available.',
        posterUrl: undefined,
        backdropUrl: undefined,
        // For series/movies structure
        ...(data.type === 'SERIES' ? { seasons: [] } : { subtitles: [] })
    } as MediaItem;
};
