import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KeyboardShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Playback',
    items: [
      { key: 'Space', action: 'Play / Pause' },
      { key: '← →', action: 'Step backward / forward (frame by frame)' },
      { key: 'J K L', action: 'Rewind / Pause / Fast forward' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { key: 'Ctrl + ↑ ↓', action: 'Previous / Next subtitle' },
      { key: 'Ctrl + Home', action: 'Jump to first subtitle' },
      { key: 'Ctrl + End', action: 'Jump to last subtitle' },
    ],
  },
  {
    category: 'Editing',
    items: [
      { key: 'Ctrl + S', action: 'Save current subtitle' },
      { key: 'Ctrl + D', action: 'Duplicate subtitle' },
      { key: 'Delete', action: 'Delete selected subtitle' },
      { key: 'Ctrl + X', action: 'Split at playhead' },
      { key: 'Ctrl + M', action: 'Merge with next' },
    ],
  },
  {
    category: 'Timeline',
    items: [
      { key: 'Ctrl + Scroll', action: 'Zoom timeline' },
      { key: 'Click', action: 'Jump to time' },
      { key: 'Drag', action: 'Move subtitle' },
    ],
  },
  {
    category: 'General',
    items: [
      { key: 'Ctrl + I', action: 'Import subtitle file' },
      { key: 'Ctrl + E', action: 'Export subtitles' },
      { key: 'Ctrl + /', action: 'Toggle shortcuts panel' },
    ],
  },
];

export default function KeyboardShortcutsPanel({
  isOpen,
  onClose,
}: KeyboardShortcutsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Keyboard Shortcuts</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-bold text-primary mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-2 px-3 rounded bg-secondary/50"
                    >
                      <span className="text-sm text-foreground">{item.action}</span>
                      <kbd className="px-2 py-1 text-xs font-mono-time bg-card border border-border rounded">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono-time bg-secondary border border-border rounded">Ctrl + /</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  );
}
