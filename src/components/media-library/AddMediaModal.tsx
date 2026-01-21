import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Film, Tv } from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    year: number;
    type: 'movie' | 'series';
    duration?: string;
    description?: string;
  }) => void;
}

export default function AddMediaModal({ isOpen, onClose, onAdd }: AddMediaModalProps) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      type,
      duration: type === 'movie' ? duration : undefined,
      description: description.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setYear(new Date().getFullYear().toString());
    setType('movie');
    setDuration('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Media</DialogTitle>
          <DialogDescription>
            Add a movie or TV series to your library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Type Selection */}
          <div className="flex gap-4">
            <button
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                type === 'movie'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setType('movie')}
            >
              <Film className={`h-8 w-8 mx-auto mb-2 ${type === 'movie' ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-sm font-medium ${type === 'movie' ? 'text-primary' : 'text-foreground'}`}>
                Movie
              </p>
            </button>
            <button
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                type === 'series'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setType('series')}
            >
              <Tv className={`h-8 w-8 mx-auto mb-2 ${type === 'series' ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-sm font-medium ${type === 'series' ? 'text-primary' : 'text-foreground'}`}>
                TV Series
              </p>
            </button>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
            />
          </div>

          {/* Year */}
          <div>
            <Label htmlFor="year" className="text-sm font-medium mb-2 block">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </div>

          {/* Duration (Movies only) */}
          {type === 'movie' && (
            <div>
              <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
                Duration
              </Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2h 15m"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Add {type === 'movie' ? 'Movie' : 'Series'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
