import { Subtitle } from '@/types/subtitle';
import { formatTime } from '@/lib/subtitle-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubtitleListProps {
  subtitles: Subtitle[];
  selectedSubtitleId: string | null;
  selectedSubtitleIds: string[];
  onSubtitleSelect: (subtitle: Subtitle, multi: boolean) => void;
  onSubtitleDelete: (id: string) => void;
  onBulkOperationsClick: () => void;
  currentTime: number;
}

export default function SubtitleList({
  subtitles,
  selectedSubtitleId,
  selectedSubtitleIds,
  onSubtitleSelect,
  onSubtitleDelete,
  onBulkOperationsClick,
  currentTime,
}: SubtitleListProps) {
  const sortedSubtitles = [...subtitles].sort((a, b) => a.startTime - b.startTime);

  const handleSubtitleClick = (subtitle: Subtitle, e: React.MouseEvent) => {
    const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    onSubtitleSelect(subtitle, isMultiSelect);
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Subtitles</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subtitles.length} {subtitles.length === 1 ? 'subtitle' : 'subtitles'}
              {selectedSubtitleIds.length > 1 && ` • ${selectedSubtitleIds.length} selected`}
            </p>
          </div>
          {selectedSubtitleIds.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkOperationsClick}
              className="gap-2"
            >
              <Edit className="h-3 w-3" />
              Bulk Edit
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedSubtitles.map((subtitle) => {
            const isSelected = subtitle.id === selectedSubtitleId;
            const isMultiSelected = selectedSubtitleIds.includes(subtitle.id);
            const isActive = currentTime >= subtitle.startTime && currentTime <= subtitle.endTime;
            const duration = subtitle.endTime - subtitle.startTime;

            return (
              <div
                key={subtitle.id}
                className={`group relative p-3 rounded cursor-pointer transition-all hover:bg-secondary/80 ${
                  isSelected
                    ? 'bg-accent/20 border-2 border-accent'
                    : isMultiSelected
                    ? 'bg-primary/20 border-2 border-primary'
                    : isActive
                    ? 'bg-primary/10 border-2 border-primary/50'
                    : 'border-2 border-transparent'
                }`}
                onClick={(e) => handleSubtitleClick(subtitle, e)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-mono-time text-primary">
                      #{subtitle.index + 1}
                    </span>
                    <span className="text-xs font-mono-time text-muted-foreground">
                      {formatTime(subtitle.startTime).substring(3, 11)} → {formatTime(subtitle.endTime).substring(3, 11)}
                    </span>
                    <span className="text-xs font-mono-time text-muted-foreground">
                      ({duration.toFixed(2)}s)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubtitleDelete(subtitle.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {subtitle.text}
                </p>
              </div>
            );
          })}

          {subtitles.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No subtitles loaded</p>
              <p className="text-xs mt-1">Import a subtitle file to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
