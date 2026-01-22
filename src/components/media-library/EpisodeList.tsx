import { Episode, Season } from '@/types/media';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subtitles, Play, Plus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface EpisodeListProps {
  seasons: Season[];
  onEpisodeSelect: (episode: Episode, seasonNumber: number) => void;
  onAddSubtitle: (episode: Episode, seasonNumber: number) => void;
  onEditSubtitle: (episode: Episode, seasonNumber: number, subtitleId: string) => void;
  canEdit?: boolean;
}

export default function EpisodeList({
  seasons,
  onEpisodeSelect,
  onAddSubtitle,
  onEditSubtitle,
  canEdit = false,
}: EpisodeListProps) {
  return (
    <ScrollArea className="h-full">
      <Accordion type="single" collapsible defaultValue={`season-${seasons[0]?.number}`} className="w-full">
        {seasons.map((season) => (
          <AccordionItem key={season.id} value={`season-${season.number}`}>
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="font-bold">Season {season.number}</span>
                <Badge variant="secondary" className="text-xs">
                  {season.episodes.length} episodes
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 px-4 pb-4">
                {season.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="group bg-secondary/50 rounded-lg p-4 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Episode Thumbnail */}
                      <div className="w-32 h-20 bg-card rounded overflow-hidden flex-shrink-0">
                        {episode.thumbnailUrl ? (
                          <img
                            src={episode.thumbnailUrl}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-sm">
                              E{episode.number}. {episode.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {episode.duration}
                            </p>
                          </div>
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onAddSubtitle(episode, season.number)}
                            >
                              <Plus className="h-3 w-3" />
                              Add Subtitle
                            </Button>
                          )}
                        </div>

                        {/* Subtitles */}
                        <div className="mt-3">
                          {episode.subtitles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {episode.subtitles.map((subtitle) => (
                                <Badge
                                  key={subtitle.id}
                                  variant="outline"
                                  className={`gap-1 ${canEdit ? 'cursor-pointer hover:bg-primary/10 hover:border-primary' : ''}`}
                                  onClick={() => canEdit && onEditSubtitle(episode, season.number, subtitle.id)}
                                >
                                  <Subtitles className="h-3 w-3" />
                                  {subtitle.language}
                                  <span className="text-muted-foreground">
                                    ({subtitle.format})
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Subtitles className="h-3 w-3" />
                              No subtitles available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}
