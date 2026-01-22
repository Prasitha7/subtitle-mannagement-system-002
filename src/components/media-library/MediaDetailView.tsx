import { ArrowLeft, Film, Tv, Calendar, Clock } from 'lucide-react';
import { Movie, Series, Episode } from '@/types/media';
import { Button } from '@/components/ui/button';
import EpisodeList from './EpisodeList';
import SubtitlesList from './SubtitlesList';
import { useAuth } from '@/components/AuthProvider';

interface MediaDetailViewProps {
  media: Movie | Series;
  onBack: () => void;
  onEditSubtitle: (subtitleId: string) => void;
  onDeleteSubtitle: (subtitleId: string) => void;
  onDownloadSubtitle: (subtitleId: string) => void;
  onAddSubtitle: (episodeId?: string, seasonNumber?: number) => void;
}

export default function MediaDetailView({
  media,
  onBack,
  onEditSubtitle,
  onDeleteSubtitle,
  onDownloadSubtitle,
  onAddSubtitle,
}: MediaDetailViewProps) {
  const { user } = useAuth();

  const handleEpisodeSelect = (episode: Episode, seasonNumber: number) => {
    // Handle episode selection
  };

  const handleEpisodeAddSubtitle = (episode: Episode, seasonNumber: number) => {
    onAddSubtitle(episode.id, seasonNumber);
  };

  const handleEpisodeEditSubtitle = (episode: Episode, seasonNumber: number, subtitleId: string) => {
    onEditSubtitle(subtitleId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Backdrop */}
      <div className="relative">
        {/* Backdrop */}
        <div className="h-64 bg-secondary overflow-hidden">
          {media.backdropUrl ? (
            <img
              src={media.backdropUrl}
              alt={media.title}
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </div>

        {/* Media Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end gap-6">
            {/* Poster */}
            <div className="w-32 h-48 rounded-lg overflow-hidden bg-card shadow-lg flex-shrink-0 border border-border">
              {media.posterUrl ? (
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {media.type === 'movie' ? (
                    <Film className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Tv className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {media.type === 'movie' ? (
                  <Film className="h-5 w-5 text-primary" />
                ) : (
                  <Tv className="h-5 w-5 text-primary" />
                )}
                <span className="text-sm text-primary font-medium capitalize">
                  {media.type}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{media.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{media.year}</span>
                </div>
                {media.type === 'movie' && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{media.duration}</span>
                  </div>
                )}
                {media.type === 'series' && (
                  <span>
                    {media.seasons.length} {media.seasons.length === 1 ? 'Season' : 'Seasons'}
                  </span>
                )}
              </div>
              {media.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {media.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-hidden">
        {media.type === 'movie' ? (
          <div className="h-full max-w-2xl mx-auto">
            <SubtitlesList
              subtitles={media.subtitles}
              onEdit={onEditSubtitle}
              onDelete={onDeleteSubtitle}
              onDownload={onDownloadSubtitle}
              onAdd={() => onAddSubtitle()}
              canEdit={!!user}
            />
          </div>
        ) : (
          <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Episodes & Subtitles</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse episodes and manage subtitles for each
              </p>
            </div>
            <EpisodeList
              seasons={media.seasons}
              onEpisodeSelect={handleEpisodeSelect}
              onAddSubtitle={handleEpisodeAddSubtitle}
              onEditSubtitle={handleEpisodeEditSubtitle}
              canEdit={!!user}
            />
          </div>
        )}
      </div>
    </div>
  );
}
