import { useState, useEffect } from 'react';
import { Subtitle } from '@/types/subtitle';
import { formatTime, parseTime } from '@/lib/subtitle-utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface ActiveSubtitleEditorProps {
  subtitle: Subtitle | null;
  onSubtitleUpdate: (subtitle: Subtitle) => void;
}

export default function ActiveSubtitleEditor({
  subtitle,
  onSubtitleUpdate,
}: ActiveSubtitleEditorProps) {
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (subtitle) {
      setText(subtitle.text);
      setStartTime(formatTime(subtitle.startTime).substring(3, 11));
      setEndTime(formatTime(subtitle.endTime).substring(3, 11));
      setHasChanges(false);
    } else {
      setText('');
      setStartTime('');
      setEndTime('');
      setHasChanges(false);
    }
  }, [subtitle]);

  const handleSave = () => {
    if (!subtitle) return;

    const newStartTime = parseTime(`00:${startTime}`);
    const newEndTime = parseTime(`00:${endTime}`);

    const updatedSubtitle: Subtitle = {
      ...subtitle,
      text,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    onSubtitleUpdate(updatedSubtitle);
    setHasChanges(false);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setHasChanges(true);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    setHasChanges(true);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    setHasChanges(true);
  };

  const charCount = text.length;
  const duration = subtitle ? subtitle.endTime - subtitle.startTime : 0;
  const readingSpeed = duration > 0 ? (charCount / duration).toFixed(1) : '0';

  if (!subtitle) {
    return (
      <div className="h-full flex flex-col bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-bold text-sm text-foreground">Subtitle Editor</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No subtitle selected</p>
            <p className="text-xs mt-1">Click on a subtitle to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg fade-transition">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">Subtitle Editor</h3>
          <span className="text-xs font-mono-time text-primary">
            #{subtitle.index + 1}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div>
          <Label htmlFor="subtitle-text" className="text-sm font-medium mb-2 block">
            Text
          </Label>
          <Textarea
            id="subtitle-text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px] resize-none font-normal"
            placeholder="Enter subtitle text..."
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {charCount} characters
            </span>
            <span className="text-xs text-muted-foreground">
              Reading speed: {readingSpeed} chars/sec
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="start-time" className="text-sm font-medium mb-2 block">
              Start Time
            </Label>
            <Input
              id="start-time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="font-mono-time"
              placeholder="00:00.000"
            />
          </div>
          <div>
            <Label htmlFor="end-time" className="text-sm font-medium mb-2 block">
              End Time
            </Label>
            <Input
              id="end-time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="font-mono-time"
              placeholder="00:00.000"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
