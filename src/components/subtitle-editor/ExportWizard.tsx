import { useState } from 'react';
import { ExportFormat } from '@/types/subtitle';
import { exportSubtitles } from '@/lib/subtitle-utils';
import { Subtitle } from '@/types/subtitle';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: Subtitle[];
  format: ExportFormat;
  onExport: (filename: string) => void;
}

export default function ExportWizard({
  isOpen,
  onClose,
  subtitles,
  format,
  onExport,
}: ExportWizardProps) {
  const [filename, setFilename] = useState('subtitles');
  const preview = exportSubtitles(subtitles, format);

  const handleExport = () => {
    onExport(filename);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export as {format}</DialogTitle>
          <DialogDescription>
            Review the formatted output before downloading
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden flex flex-col">
          <div>
            <Label htmlFor="filename" className="text-sm font-medium mb-2 block">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="font-mono-time"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Extension .{format.toLowerCase()} will be added automatically
            </p>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Label className="text-sm font-medium mb-2 block">Preview</Label>
            <Textarea
              value={preview}
              readOnly
              className="flex-1 font-mono-time text-xs resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
