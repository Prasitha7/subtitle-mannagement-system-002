import { SubtitleTrack } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Subtitles, Edit, Trash2, Download, Plus } from 'lucide-react';

interface SubtitlesListProps {
  subtitles: SubtitleTrack[];
  onEdit: (subtitleId: string) => void;
  onDelete: (subtitleId: string) => void;
  onDownload: (subtitleId: string) => void;
  onAdd: () => void;
}

export default function SubtitlesList({
  subtitles,
  onEdit,
  onDelete,
  onDownload,
  onAdd,
}: SubtitlesListProps) {
  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-foreground">Available Subtitles</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitles.length} {subtitles.length === 1 ? 'language' : 'languages'}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Subtitle
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {subtitles.length > 0 ? (
            subtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                className="group bg-secondary/50 rounded-lg p-4 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Subtitles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{subtitle.language}</h4>
                        <Badge variant="outline" className="text-xs">
                          {subtitle.format}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Added {new Date(subtitle.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDownload(subtitle.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(subtitle.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(subtitle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Subtitles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No subtitles available</p>
              <p className="text-xs mt-1">Add a subtitle to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
