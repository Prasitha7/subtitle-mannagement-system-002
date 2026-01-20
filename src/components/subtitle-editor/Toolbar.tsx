import { Upload, Download, Play, Pause, SkipForward, SkipBack, Keyboard, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportFormat } from '@/types/subtitle';

interface ToolbarProps {
  onImportSubtitle: () => void;
  onImportVideo: () => void;
  onExport: (format: ExportFormat) => void;
  onTogglePlay: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onToggleShortcuts: () => void;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  hasVideo: boolean;
  hasSubtitles: boolean;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function Toolbar({
  onImportSubtitle,
  onImportVideo,
  onExport,
  onTogglePlay,
  onStepBackward,
  onStepForward,
  onToggleShortcuts,
  isPlaying,
  playbackSpeed,
  onPlaybackSpeedChange,
  hasVideo,
  hasSubtitles,
}: ToolbarProps) {
  return (
    <div className="stagger-1 h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Subtitle Editor</h1>
        
        <div className="h-8 w-px bg-border" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onImportSubtitle}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Subtitle
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onImportVideo}
          className="gap-2"
        >
          <FileVideo className="h-4 w-4" />
          {hasVideo ? 'Change Video' : 'Load Video'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!hasSubtitles}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport('SRT')}>
              Export as SRT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('VTT')}>
              Export as VTT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('ASS')}>
              Export as ASS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        {hasVideo && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onStepBackward}
              disabled={!hasVideo}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={onTogglePlay}
              disabled={!hasVideo}
              className="bg-primary hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onStepForward}
              disabled={!hasVideo}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="h-8 w-px bg-border" />

            <div className="flex items-center gap-2 min-w-[120px]">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-mono-time">
                    {playbackSpeed}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => onPlaybackSpeedChange(speed)}
                      className="font-mono-time"
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        <div className="h-8 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleShortcuts}
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
