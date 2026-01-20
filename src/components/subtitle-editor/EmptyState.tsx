import { Upload, FileVideo, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  onImportSubtitle: () => void;
  onImportVideo: () => void;
  onShowShortcuts: () => void;
}

export default function EmptyState({
  onImportSubtitle,
  onImportVideo,
  onShowShortcuts,
}: EmptyStateProps) {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Subtitle Management System
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional subtitle editing and synchronization tool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Import Subtitles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Load your subtitle file to start editing. Supports SRT and VTT formats.
              </p>
              <Button onClick={onImportSubtitle} className="w-full">
                Choose Subtitle File
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <FileVideo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Load Video</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a video file to preview subtitles in real-time as you edit.
              </p>
              <Button onClick={onImportVideo} variant="outline" className="w-full">
                Choose Video File
              </Button>
            </div>
          </Card>
        </div>

        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={onShowShortcuts}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Keyboard className="h-4 w-4" />
            View Keyboard Shortcuts
          </Button>
        </div>

        <div className="pt-8 space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Features:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-medium text-primary mb-1">Frame-Perfect Editing</p>
              <p>Navigate frame-by-frame for precise timing adjustments</p>
            </div>
            <div>
              <p className="font-medium text-primary mb-1">Visual Timeline</p>
              <p>Drag and drop subtitle blocks with overlap detection</p>
            </div>
            <div>
              <p className="font-medium text-primary mb-1">Multiple Formats</p>
              <p>Export to SRT, VTT, or ASS subtitle formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
