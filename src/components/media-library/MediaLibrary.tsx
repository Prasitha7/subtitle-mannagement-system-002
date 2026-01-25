import { useState, useEffect } from 'react';
import { MediaItem, Movie, Series } from '@/types/media';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Film, Tv, Library } from 'lucide-react';
import MediaCard from './MediaCard';
import MediaDetailView from './MediaDetailView';
import AddMediaModal from './AddMediaModal';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

import { mediaApi } from '@/api/media-api';

interface MediaLibraryProps {
  onNavigateToEditor: (subtitleId?: string) => void;
}

export default function MediaLibrary({ onNavigateToEditor }: MediaLibraryProps) {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    mediaApi.getAll().then((data) => {
      setMediaItems(data);
      setLoading(false);
    });
  }, []);

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const handleBack = () => {
    setSelectedMedia(null);
  };

  const handleEditSubtitle = (subtitleId: string) => {
    onNavigateToEditor(subtitleId);
    toast.success('Opening subtitle in editor');
  };

  const handleDeleteSubtitle = (subtitleId: string) => {
    // In a real app, this would update the state/backend
    toast.success('Subtitle deleted');
  };

  const handleDownloadSubtitle = (subtitleId: string) => {
    toast.success('Downloading subtitle...');
  };

  const handleAddSubtitle = (episodeId?: string, seasonNumber?: number) => {
    // Navigate to editor to create new subtitle
    onNavigateToEditor();
  };

  const handleAddMedia = (data: {
    title: string;
    year: number;
    type: 'movie' | 'series';
    duration?: string;
    description?: string;
  }) => {
    const newMedia: MediaItem = data.type === 'movie'
      ? {
        id: `movie-${Date.now()}`,
        title: data.title,
        year: data.year,
        duration: data.duration || '0m',
        type: 'movie',
        description: data.description,
        subtitles: [],
      }
      : {
        id: `series-${Date.now()}`,
        title: data.title,
        year: data.year,
        type: 'series',
        description: data.description,
        seasons: [],
      };

    setMediaItems((prev) => [newMedia, ...prev]);
    toast.success(`Added "${data.title}" to library`);
  };

  if (selectedMedia) {
    return (
      <MediaDetailView
        media={selectedMedia}
        onBack={handleBack}
        onEditSubtitle={handleEditSubtitle}
        onDeleteSubtitle={handleDeleteSubtitle}
        onDownloadSubtitle={handleDownloadSubtitle}
        onAddSubtitle={handleAddSubtitle}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Media Library</h1>
              <p className="text-sm text-muted-foreground">
                Manage subtitles for your movies and TV series
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <Button className="gap-2" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4" />
                Add Media
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Library className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="movie" className="gap-2">
                <Film className="h-4 w-4" />
                Movies
              </TabsTrigger>
              <TabsTrigger value="series" className="gap-2">
                <Tv className="h-4 w-4" />
                Series
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-auto p-8">
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={handleMediaClick} />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Library className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-bold text-lg mb-2">No media found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Add your first movie or series to get started'}
              </p>
              {!searchQuery && user && (
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Media
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AddMediaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMedia}
      />
    </div>
  );
}
