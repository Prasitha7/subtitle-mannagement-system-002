import { Subtitle, ExportFormat } from '@/types/subtitle';

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function formatTimeVTT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function parseTime(timeStr: string): number {
  const parts = timeStr.replace(',', '.').split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

export function parseSRT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const blocks = content.trim().split(/\n\s*\n/);

  blocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (timeMatch) {
        const startTime = parseTime(timeMatch[1]);
        const endTime = parseTime(timeMatch[2]);
        const text = lines.slice(2).join('\n');

        subtitles.push({
          id: `sub-${Date.now()}-${index}`,
          startTime,
          endTime,
          text,
          index,
        });
      }
    }
  });

  return subtitles;
}

export function parseVTT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const lines = content.split('\n');
  
  let currentSubtitle: Partial<Subtitle> | null = null;
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip WEBVTT header and empty lines
    if (line === '' || line.startsWith('WEBVTT') || line.startsWith('NOTE')) {
      continue;
    }

    // Check for timestamp line
    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (timeMatch) {
      if (currentSubtitle && currentSubtitle.text) {
        subtitles.push(currentSubtitle as Subtitle);
      }

      currentSubtitle = {
        id: `sub-${Date.now()}-${index}`,
        startTime: parseTime(timeMatch[1]),
        endTime: parseTime(timeMatch[2]),
        text: '',
        index,
      };
      index++;
    } else if (currentSubtitle && line !== '') {
      // Add text line
      currentSubtitle.text = currentSubtitle.text 
        ? `${currentSubtitle.text}\n${line}` 
        : line;
    }
  }

  if (currentSubtitle && currentSubtitle.text) {
    subtitles.push(currentSubtitle as Subtitle);
  }

  return subtitles;
}

export function exportToSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub, index) => {
      const startTime = formatTime(sub.startTime);
      const endTime = formatTime(sub.endTime);
      return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}\n`;
    })
    .join('\n');
}

export function exportToVTT(subtitles: Subtitle[]): string {
  const header = 'WEBVTT\n\n';
  const content = subtitles
    .map((sub) => {
      const startTime = formatTimeVTT(sub.startTime);
      const endTime = formatTimeVTT(sub.endTime);
      return `${startTime} --> ${endTime}\n${sub.text}\n`;
    })
    .join('\n');
  return header + content;
}

export function exportToASS(subtitles: Subtitle[]): string {
  const header = `[Script Info]
Title: Subtitle Export
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = subtitles
    .map((sub) => {
      const start = formatTimeASS(sub.startTime);
      const end = formatTimeASS(sub.endTime);
      const text = sub.text.replace(/\n/g, '\\N');
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
    })
    .join('\n');

  return header + events;
}

function formatTimeASS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export function exportSubtitles(subtitles: Subtitle[], format: ExportFormat): string {
  switch (format) {
    case 'SRT':
      return exportToSRT(subtitles);
    case 'VTT':
      return exportToVTT(subtitles);
    case 'ASS':
      return exportToASS(subtitles);
    default:
      return exportToSRT(subtitles);
  }
}

export function downloadFile(content: string, filename: string, format: ExportFormat) {
  const mimeTypes = {
    SRT: 'application/x-subrip',
    VTT: 'text/vtt',
    ASS: 'text/x-ssa',
  };

  const blob = new Blob([content], { type: mimeTypes[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format.toLowerCase()}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function checkOverlap(subtitle: Subtitle, allSubtitles: Subtitle[]): boolean {
  return allSubtitles.some(
    (other) =>
      other.id !== subtitle.id &&
      ((subtitle.startTime >= other.startTime && subtitle.startTime < other.endTime) ||
        (subtitle.endTime > other.startTime && subtitle.endTime <= other.endTime) ||
        (subtitle.startTime <= other.startTime && subtitle.endTime >= other.endTime))
  );
}

export function generateId(): string {
  return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
