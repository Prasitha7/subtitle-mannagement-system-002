import { Film, Tv, Subtitles } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MediaCardProps {
  media: MediaItem;
  onClick: (media: MediaItem) => void;
}

export default function MediaCard({ media, onClick }: MediaCardProps) {
  const subtitleCount = media.type === 'movie' 
    ? media.subtitles.length 
    : media.seasons.reduce((acc, season) => 
        acc + season.episodes.reduce((epAcc, ep) => epAcc + ep.subtitles.length, 0), 0
      );

  const episodeCount = media.type === 'series'
    ? media.seasons.reduce((acc, season) => acc + season.episodes.length, 0)
    : null;

  return (
    <Card 
      className="group overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
      onClick={() => onClick(media)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-secondary">
        {media.posterUrl ? (
          <img 
            src={media.posterUrl} 
            alt={media.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {media.type === 'movie' ? (
              <Film className="h-16 w-16 text-muted-foreground" />
            ) : (
              <Tv className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge variant={media.type === 'movie' ? 'default' : 'secondary'} className="text-xs">
            {media.type === 'movie' ? 'Movie' : 'Series'}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <h3 className="font-bold text-white text-sm truncate">{media.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/70">{media.year}</span>
            {media.type === 'movie' && (
              <span className="text-xs text-white/70">• {media.duration}</span>
            )}
            {episodeCount !== null && (
              <span className="text-xs text-white/70">• {episodeCount} episodes</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Subtitles className="h-4 w-4" />
            <span className="text-xs">
              {subtitleCount} {subtitleCount === 1 ? 'subtitle' : 'subtitles'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
