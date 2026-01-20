import { useState, useEffect, useCallback, useRef } from 'react';
import { Subtitle, ExportFormat } from '@/types/subtitle';
import {
  parseSRT,
  parseVTT,
  generateId,
  downloadFile,
  exportSubtitles,
} from '@/lib/subtitle-utils';
import Toolbar from './Toolbar';
import VideoPlayer from './VideoPlayer';
import Timeline from './Timeline';
import SubtitleList from './SubtitleList';
import ActiveSubtitleEditor from './ActiveSubtitleEditor';
import KeyboardShortcutsPanel from './KeyboardShortcutsPanel';
import ExportWizard from './ExportWizard';
import EmptyState from './EmptyState';
import BulkOperationsModal from './BulkOperationsModal';
import { toast } from 'sonner';

export default function SubtitleEditor() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>(null);
  const [selectedSubtitleIds, setSelectedSubtitleIds] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExportWizard, setShowExportWizard] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('SRT');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  const selectedSubtitle = subtitles.find((s) => s.id === selectedSubtitleId) || null;
  const selectedSubtitlesForBulk = subtitles.filter((s) => selectedSubtitleIds.includes(s.id));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs/textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime((prev) => Math.max(0, prev - 0.033)); // 1 frame at 30fps
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime((prev) => Math.min(duration, prev + 0.033));
      } else if (e.ctrlKey && e.code === 'Slash') {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      } else if (e.ctrlKey && e.code === 'KeyI') {
        e.preventDefault();
        handleImportSubtitle();
      } else if (e.code === 'Delete' && selectedSubtitleId) {
        e.preventDefault();
        handleSubtitleDelete(selectedSubtitleId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, selectedSubtitleId]);

  const handleImportSubtitle = () => {
    subtitleInputRef.current?.click();
  };

  const handleImportVideo = () => {
    videoInputRef.current?.click();
  };

  const handleSubtitleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let parsedSubtitles: Subtitle[] = [];

      if (file.name.endsWith('.srt')) {
        parsedSubtitles = parseSRT(content);
      } else if (file.name.endsWith('.vtt')) {
        parsedSubtitles = parseVTT(content);
      } else {
        toast.error('Unsupported file format. Please use .srt or .vtt files.');
        return;
      }

      setSubtitles(parsedSubtitles);
      toast.success(`Loaded ${parsedSubtitles.length} subtitles`);
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Get video duration
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      toast.success('Video loaded successfully');
    };

    // Reset input
    e.target.value = '';
  };

  const handleSubtitleUpdate = useCallback((updatedSubtitle: Subtitle) => {
    setSubtitles((prev) =>
      prev.map((s) => (s.id === updatedSubtitle.id ? updatedSubtitle : s))
    );
  }, []);

  const handleSubtitleSplit = useCallback(
    (subtitle: Subtitle, splitTime: number) => {
      if (splitTime <= subtitle.startTime || splitTime >= subtitle.endTime) {
        toast.error('Split time must be within subtitle duration');
        return;
      }

      const firstPart: Subtitle = {
        ...subtitle,
        endTime: splitTime,
        id: generateId(),
      };

      const secondPart: Subtitle = {
        ...subtitle,
        startTime: splitTime,
        id: generateId(),
        index: subtitle.index + 1,
      };

      setSubtitles((prev) => {
        const index = prev.findIndex((s) => s.id === subtitle.id);
        const newSubtitles = [...prev];
        newSubtitles.splice(index, 1, firstPart, secondPart);
        return newSubtitles.map((s, i) => ({ ...s, index: i }));
      });

      toast.success('Subtitle split successfully');
    },
    []
  );

  const handleSubtitlesMerge = useCallback(
    (subtitle1: Subtitle, subtitle2: Subtitle) => {
      const mergedSubtitle: Subtitle = {
        ...subtitle1,
        endTime: subtitle2.endTime,
        text: `${subtitle1.text}\n${subtitle2.text}`,
      };

      setSubtitles((prev) => {
        const newSubtitles = prev.filter(
          (s) => s.id !== subtitle1.id && s.id !== subtitle2.id
        );
        newSubtitles.push(mergedSubtitle);
        return newSubtitles
          .sort((a, b) => a.startTime - b.startTime)
          .map((s, i) => ({ ...s, index: i }));
      });

      toast.success('Subtitles merged successfully');
    },
    []
  );

  const handleSubtitleDelete = useCallback((id: string) => {
    setSubtitles((prev) => {
      const newSubtitles = prev.filter((s) => s.id !== id);
      return newSubtitles.map((s, i) => ({ ...s, index: i }));
    });
    if (selectedSubtitleId === id) {
      setSelectedSubtitleId(null);
    }
    toast.success('Subtitle deleted');
  }, [selectedSubtitleId]);

  const handleSubtitleSelect = useCallback((subtitle: Subtitle, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      setSelectedSubtitleIds((prev) => {
        if (prev.includes(subtitle.id)) {
          // Remove if already selected
          return prev.filter((id) => id !== subtitle.id);
        } else {
          // Add to selection
          return [...prev, subtitle.id];
        }
      });
    } else {
      // Single select
      setSelectedSubtitleId(subtitle.id);
      setSelectedSubtitleIds([subtitle.id]);
      setCurrentTime(subtitle.startTime);
    }
  }, []);

  const handleBulkApplyOffset = useCallback((offset: number) => {
    setSubtitles((prev) =>
      prev.map((s) => {
        if (selectedSubtitleIds.includes(s.id)) {
          return {
            ...s,
            startTime: Math.max(0, s.startTime + offset),
            endTime: s.endTime + offset,
          };
        }
        return s;
      })
    );
    toast.success(`Applied time offset to ${selectedSubtitleIds.length} subtitles`);
  }, [selectedSubtitleIds]);

  const handleBulkFindReplace = useCallback((find: string, replace: string) => {
    let count = 0;
    setSubtitles((prev) =>
      prev.map((s) => {
        if (selectedSubtitleIds.includes(s.id) && s.text.includes(find)) {
          count++;
          return {
            ...s,
            text: s.text.replace(new RegExp(find, 'g'), replace),
          };
        }
        return s;
      })
    );
    toast.success(`Replaced ${count} occurrences in ${selectedSubtitleIds.length} subtitles`);
  }, [selectedSubtitleIds]);

  const handleBulkAdjustReadingSpeed = useCallback((charsPerSecond: number) => {
    setSubtitles((prev) =>
      prev.map((s) => {
        if (selectedSubtitleIds.includes(s.id)) {
          const newDuration = s.text.length / charsPerSecond;
          return {
            ...s,
            endTime: s.startTime + newDuration,
          };
        }
        return s;
      })
    );
    toast.success(`Adjusted duration for ${selectedSubtitleIds.length} subtitles`);
  }, [selectedSubtitleIds]);

  const handleExport = (format: ExportFormat) => {
    setExportFormat(format);
    setShowExportWizard(true);
  };

  const handleExportConfirm = (filename: string) => {
    const content = exportSubtitles(subtitles, exportFormat);
    downloadFile(content, filename, exportFormat);
    toast.success(`Exported as ${filename}.${exportFormat.toLowerCase()}`);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Hidden file inputs */}
      <input
        ref={subtitleInputRef}
        type="file"
        accept=".srt,.vtt"
        className="hidden"
        onChange={handleSubtitleFileSelect}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoFileSelect}
      />

      {/* Toolbar */}
      <Toolbar
        onImportSubtitle={handleImportSubtitle}
        onImportVideo={handleImportVideo}
        onExport={handleExport}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        onStepBackward={() => setCurrentTime((prev) => Math.max(0, prev - 0.033))}
        onStepForward={() => setCurrentTime((prev) => Math.min(duration, prev + 0.033))}
        onToggleShortcuts={() => setShowShortcuts((prev) => !prev)}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={setPlaybackSpeed}
        hasVideo={!!videoUrl}
        hasSubtitles={subtitles.length > 0}
      />

      {/* Main Content */}
      {subtitles.length === 0 && !videoUrl ? (
        <EmptyState
          onImportSubtitle={handleImportSubtitle}
          onImportVideo={handleImportVideo}
          onShowShortcuts={() => setShowShortcuts(true)}
        />
      ) : (
        <div className="flex-1 flex gap-8 p-8 overflow-hidden">
          {/* Left Panel: Video & Timeline (60%) */}
          <div className="stagger-2 w-[60%] flex flex-col gap-6">
            {/* Video Player */}
            <div className="flex-1 min-h-0">
              <VideoPlayer
                videoUrl={videoUrl}
                currentTime={currentTime}
                onTimeUpdate={setCurrentTime}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                subtitles={subtitles}
              />
            </div>

            {/* Timeline */}
            <div className="stagger-3">
              <Timeline
                subtitles={subtitles}
                currentTime={currentTime}
                duration={duration || 100}
                onSeek={setCurrentTime}
                onSubtitleUpdate={handleSubtitleUpdate}
                onSubtitleSplit={handleSubtitleSplit}
                onSubtitlesMerge={handleSubtitlesMerge}
                onSubtitleSelect={handleSubtitleSelect}
                selectedSubtitleId={selectedSubtitleId}
              />
            </div>
          </div>

          {/* Right Panel: Subtitle List & Editor (40%) */}
          <div className="stagger-4 w-[40%] flex flex-col gap-6 min-w-0">
            {/* Subtitle List */}
            <div className="flex-1 min-h-0">
              <SubtitleList
                subtitles={subtitles}
                selectedSubtitleId={selectedSubtitleId}
                selectedSubtitleIds={selectedSubtitleIds}
                onSubtitleSelect={handleSubtitleSelect}
                onSubtitleDelete={handleSubtitleDelete}
                onBulkOperationsClick={() => setShowBulkOperations(true)}
                currentTime={currentTime}
              />
            </div>

          {/* Active Subtitle Editor */}
          <div className="h-[320px]">
            <ActiveSubtitleEditor
              subtitle={selectedSubtitle}
              onSubtitleUpdate={handleSubtitleUpdate}
            />
          </div>
        </div>
      </div>
      )}

      {/* Modals */}
      <KeyboardShortcutsPanel
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      
      <ExportWizard
        isOpen={showExportWizard}
        onClose={() => setShowExportWizard(false)}
        subtitles={subtitles}
        format={exportFormat}
        onExport={handleExportConfirm}
      />
    </div>
  );
}
