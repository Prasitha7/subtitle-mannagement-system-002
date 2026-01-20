export interface Subtitle {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
  index: number;
}

export interface SubtitleFile {
  name: string;
  format: 'SRT' | 'VTT' | 'ASS';
  subtitles: Subtitle[];
}

export type ExportFormat = 'SRT' | 'VTT' | 'ASS';

export interface TimelineRange {
  start: number;
  end: number;
  zoom: number;
}
