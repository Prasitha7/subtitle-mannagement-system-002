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
  const { isAuthenticated } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);
    // Use the new paginated API
    mediaApi.getAll(
      currentPage,
      ITEMS_PER_PAGE,
      activeTab as 'movie' | 'series' | 'all',
      searchQuery
    ).then((data) => {
      setMediaItems(data.items);
      setTotalItems(data.total);
      setLoading(false);
    });
  }, [currentPage, activeTab, searchQuery]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // No more client-side filtering needed, as the API handles it

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

    // Re-fetch to update the list, or optimistic update (simplified here)
    setMediaItems((prev) => [newMedia, ...prev]);
    toast.success(`Added "${data.title}" to library`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / ITEMS_PER_PAGE)) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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
            {isAuthenticated && (
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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
            {mediaItems.map((media) => (
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
              {!searchQuery && isAuthenticated && (
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Media
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls - Fixed Bottom */}
      {!loading && totalPages > 1 && (
        <div className="px-8 py-4 border-t border-border bg-background">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddMediaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMedia}
      />
    </div>
  );
}
