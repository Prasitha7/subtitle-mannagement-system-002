import { useState } from 'react';
import { Subtitle } from '@/types/subtitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubtitles: Subtitle[];
  onApplyOffset: (offset: number) => void;
  onFindReplace: (find: string, replace: string) => void;
  onAdjustReadingSpeed: (charsPerSecond: number) => void;
}

export default function BulkOperationsModal({
  isOpen,
  onClose,
  selectedSubtitles,
  onApplyOffset,
  onFindReplace,
  onAdjustReadingSpeed,
}: BulkOperationsModalProps) {
  const [timeOffset, setTimeOffset] = useState('0');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [readingSpeed, setReadingSpeed] = useState('15');

  const handleApplyOffset = () => {
    const offset = parseFloat(timeOffset);
    if (!isNaN(offset)) {
      onApplyOffset(offset);
      onClose();
    }
  };

  const handleFindReplace = () => {
    if (findText) {
      onFindReplace(findText, replaceText);
      onClose();
    }
  };

  const handleAdjustSpeed = () => {
    const speed = parseFloat(readingSpeed);
    if (!isNaN(speed) && speed > 0) {
      onAdjustReadingSpeed(speed);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Operations</DialogTitle>
          <DialogDescription>
            Apply changes to {selectedSubtitles.length} selected{' '}
            {selectedSubtitles.length === 1 ? 'subtitle' : 'subtitles'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="offset" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="offset">Time Offset</TabsTrigger>
            <TabsTrigger value="find-replace">Find & Replace</TabsTrigger>
            <TabsTrigger value="reading-speed">Reading Speed</TabsTrigger>
          </TabsList>

          <TabsContent value="offset" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="time-offset" className="text-sm font-medium mb-2 block">
                Time Offset (seconds)
              </Label>
              <Input
                id="time-offset"
                type="number"
                step="0.1"
                value={timeOffset}
                onChange={(e) => setTimeOffset(e.target.value)}
                placeholder="0.0"
                className="font-mono-time"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Positive values shift subtitles forward, negative values shift them backward
              </p>
            </div>
            <Button onClick={handleApplyOffset} className="w-full">
              Apply Time Offset
            </Button>
          </TabsContent>

          <TabsContent value="find-replace" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="find-text" className="text-sm font-medium mb-2 block">
                Find
              </Label>
              <Input
                id="find-text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Text to find..."
              />
            </div>
            <div>
              <Label htmlFor="replace-text" className="text-sm font-medium mb-2 block">
                Replace with
              </Label>
              <Input
                id="replace-text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement text..."
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will replace all occurrences in selected subtitles
            </p>
            <Button onClick={handleFindReplace} disabled={!findText} className="w-full">
              Find & Replace
            </Button>
          </TabsContent>

          <TabsContent value="reading-speed" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="reading-speed" className="text-sm font-medium mb-2 block">
                Target Reading Speed (characters per second)
              </Label>
              <Input
                id="reading-speed"
                type="number"
                step="1"
                value={readingSpeed}
                onChange={(e) => setReadingSpeed(e.target.value)}
                placeholder="15"
                className="font-mono-time"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 15-20 characters/second for comfortable reading
              </p>
            </div>
            <Button onClick={handleAdjustSpeed} className="w-full">
              Adjust Duration
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
