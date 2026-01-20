import { useRef, useState, useEffect } from 'react';
import { Subtitle } from '@/types/subtitle';
import { formatTime, checkOverlap } from '@/lib/subtitle-utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface TimelineProps {
  subtitles: Subtitle[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSubtitleUpdate: (subtitle: Subtitle) => void;
  onSubtitleSplit: (subtitle: Subtitle, splitTime: number) => void;
  onSubtitlesMerge: (subtitle1: Subtitle, subtitle2: Subtitle) => void;
  onSubtitleSelect: (subtitle: Subtitle, isMultiSelect?: boolean) => void;
  selectedSubtitleId: string | null;
}

export default function Timeline({
  subtitles,
  currentTime,
  duration,
  onSeek,
  onSubtitleUpdate,
  onSubtitleSplit,
  onSubtitlesMerge,
  onSubtitleSelect,
  selectedSubtitleId,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [contextMenuSubtitle, setContextMenuSubtitle] = useState<Subtitle | null>(null);

  const pixelsPerSecond = duration > 0 ? (timelineRef.current?.clientWidth || 800) / duration : 50;

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current && !draggingId) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const time = (x / rect.width) * duration;
      onSeek(time);
    }
  };

  const handleSubtitleMouseDown = (e: React.MouseEvent, subtitle: Subtitle) => {
    e.stopPropagation();
    setDraggingId(subtitle.id);
    setDragStartX(e.clientX);
    setDragStartTime(subtitle.startTime);
    onSubtitleSelect(subtitle, false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX;
        const deltaTime = (deltaX / rect.width) * duration;
        const newStartTime = Math.max(0, dragStartTime + deltaTime);
        
        const subtitle = subtitles.find((s) => s.id === draggingId);
        if (subtitle) {
          const subtitleDuration = subtitle.endTime - subtitle.startTime;
          const updatedSubtitle = {
            ...subtitle,
            startTime: newStartTime,
            endTime: newStartTime + subtitleDuration,
          };
          onSubtitleUpdate(updatedSubtitle);
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, dragStartX, dragStartTime, subtitles, duration, onSubtitleUpdate]);

  const handleSplit = () => {
    if (contextMenuSubtitle) {
      onSubtitleSplit(contextMenuSubtitle, currentTime);
    }
  };

  const handleMerge = () => {
    if (contextMenuSubtitle) {
      const index = subtitles.findIndex((s) => s.id === contextMenuSubtitle.id);
      const nextSubtitle = subtitles[index + 1];
      if (nextSubtitle) {
        onSubtitlesMerge(contextMenuSubtitle, nextSubtitle);
      }
    }
  };

  const getAdjacentSubtitle = (subtitle: Subtitle): Subtitle | null => {
    const index = subtitles.findIndex((s) => s.id === subtitle.id);
    return subtitles[index + 1] || null;
  };

  return (
    <div className="relative w-full h-32 bg-card border border-border rounded-lg timeline-noise overflow-hidden">
      <div
        ref={timelineRef}
        className="relative w-full h-full cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-6 border-b border-border/50 flex items-center px-2">
          {Array.from({ length: Math.ceil(duration / 10) }).map((_, i) => {
            const time = i * 10;
            const left = (time / duration) * 100;
            return (
              <div
                key={i}
                className="absolute text-xs text-muted-foreground font-mono-time"
                style={{ left: `${left}%` }}
              >
                {formatTime(time).substring(3, 8)}
              </div>
            );
          })}
        </div>

        {/* Subtitle blocks */}
        <div className="absolute top-6 left-0 right-0 bottom-0 px-2 py-4">
          {subtitles.map((subtitle) => {
            const left = (subtitle.startTime / duration) * 100;
            const width = ((subtitle.endTime - subtitle.startTime) / duration) * 100;
            const hasOverlap = checkOverlap(subtitle, subtitles);
            const isSelected = subtitle.id === selectedSubtitleId;

            return (
              <ContextMenu key={subtitle.id}>
                <ContextMenuTrigger>
                  <div
                    className={`absolute h-16 rounded cursor-move subtitle-block-glow transition-all ${
                      hasOverlap
                        ? 'bg-destructive border-2 border-destructive'
                        : isSelected
                        ? 'bg-accent border-2 border-accent'
                        : 'bg-secondary border-2 border-border'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      minWidth: '4px',
                    }}
                    onMouseDown={(e) => handleSubtitleMouseDown(e, subtitle)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubtitleSelect(subtitle, false);
                    }}
                    onContextMenu={() => setContextMenuSubtitle(subtitle)}
                  >
                    <div className="px-2 py-1 h-full overflow-hidden">
                      <p className="text-xs font-mono-time text-foreground truncate">
                        {formatTime(subtitle.startTime).substring(3, 11)}
                      </p>
                      <p className="text-xs text-foreground/80 truncate mt-1">
                        {subtitle.text}
                      </p>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={handleSplit}>
                    Split at Playhead
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={handleMerge}
                    disabled={!getAdjacentSubtitle(subtitle)}
                  >
                    Merge with Next
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary playhead-glow pointer-events-none z-10"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        >
          <div className="absolute -top-1 -left-2 w-4 h-4 bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}
