import { SUBTITLE_API_URL, getAuthHeaders } from './config';

const SUBTITLE_BASE_URL = `${SUBTITLE_API_URL}/api/subtitles`;

export interface SubtitleUploadRequest {
    mediaId?: string;
    mediaSegmentId?: string; // For episodes
    language: string;
    title: string;
    file: File;
}

export const subtitleApi = {
    upload: async (data: SubtitleUploadRequest) => {
        const formData = new FormData();
        if (data.mediaId) formData.append('mediaId', data.mediaId);
        if (data.mediaSegmentId) formData.append('mediaSegmentId', data.mediaSegmentId);
        formData.append('language', data.language);
        formData.append('title', data.title);
        formData.append('file', data.file);

        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(SUBTITLE_BASE_URL, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to upload subtitle');
        }

        return response.json();
    },

    getByMediaId: async (mediaId: string) => {
        const response = await fetch(`${SUBTITLE_BASE_URL}/public?mediaId=${mediaId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getById: async (id: string) => {
        const response = await fetch(`${SUBTITLE_BASE_URL}/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    delete: async (id: string) => {
        const response = await fetch(`${SUBTITLE_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }); // Returns 204 No Content typically

        if (!response.ok) {
            throw new Error('Failed to delete subtitle');
        }
    },

    updateLines: async (id: string, edits: any[], note?: string) => {
        const response = await fetch(`${SUBTITLE_BASE_URL}/${id}/lines`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ edits, note })
        });
        return handleResponse(response);
    }
};

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'API Error');
    }
    return response.json();
}
