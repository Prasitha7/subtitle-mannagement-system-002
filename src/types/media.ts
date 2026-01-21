export interface SubtitleTrack {
  id: string;
  language: string;
  languageCode: string;
  format: 'SRT' | 'VTT' | 'ASS';
  fileUrl?: string;
  addedAt: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnailUrl?: string;
  subtitles: SubtitleTrack[];
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  duration: string;
  posterUrl?: string;
  backdropUrl?: string;
  description?: string;
  subtitles: SubtitleTrack[];
  type: 'movie';
}

export interface Series {
  id: string;
  title: string;
  year: number;
  posterUrl?: string;
  backdropUrl?: string;
  description?: string;
  seasons: Season[];
  type: 'series';
}

export type MediaItem = Movie | Series;
