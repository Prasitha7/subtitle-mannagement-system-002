import { useState } from 'react';
import { MediaItem, Movie, Series } from '@/types/media';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Film, Tv, Library } from 'lucide-react';
import MediaCard from './MediaCard';
import MediaDetailView from './MediaDetailView';
import AddMediaModal from './AddMediaModal';
import { toast } from 'sonner';

// Sample data for demonstration
const sampleMedia: MediaItem[] = [
  {
    id: 'movie-1',
    title: 'Inception',
    year: 2010,
    duration: '2h 28m',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.',
    subtitles: [
      { id: 'sub-1', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-15' },
      { id: 'sub-2', language: 'Spanish', languageCode: 'es', format: 'SRT', addedAt: '2024-01-16' },
    ],
  },
  {
    id: 'movie-2',
    title: 'Interstellar',
    year: 2014,
    duration: '2h 49m',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    subtitles: [
      { id: 'sub-3', language: 'English', languageCode: 'en', format: 'VTT', addedAt: '2024-02-10' },
    ],
  },
  {
    id: 'series-1',
    title: 'Breaking Bad',
    year: 2008,
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80',
    description: 'A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.',
    seasons: [
      {
        id: 'season-1',
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'ep-1-1',
            number: 1,
            title: 'Pilot',
            duration: '58m',
            subtitles: [
              { id: 'sub-4', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-20' },
            ],
          },
          {
            id: 'ep-1-2',
            number: 2,
            title: "Cat's in the Bag...",
            duration: '48m',
            subtitles: [],
          },
          {
            id: 'ep-1-3',
            number: 3,
            title: '...And the Bag\'s in the River',
            duration: '48m',
            subtitles: [
              { id: 'sub-5', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-21' },
              { id: 'sub-6', language: 'German', languageCode: 'de', format: 'SRT', addedAt: '2024-01-22' },
            ],
          },
        ],
      },
      {
        id: 'season-2',
        number: 2,
        title: 'Season 2',
        episodes: [
          {
            id: 'ep-2-1',
            number: 1,
            title: 'Seven Thirty-Seven',
            duration: '47m',
            subtitles: [],
          },
          {
            id: 'ep-2-2',
            number: 2,
            title: 'Grilled',
            duration: '48m',
            subtitles: [
              { id: 'sub-7', language: 'English', languageCode: 'en', format: 'VTT', addedAt: '2024-02-01' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'series-2',
    title: 'Stranger Things',
    year: 2016,
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.',
    seasons: [
      {
        id: 'st-season-1',
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'st-ep-1-1',
            number: 1,
            title: 'The Vanishing of Will Byers',
            duration: '47m',
            subtitles: [
              { id: 'sub-8', language: 'English', languageCode: 'en', format: 'SRT', addedAt: '2024-01-25' },
              { id: 'sub-9', language: 'French', languageCode: 'fr', format: 'SRT', addedAt: '2024-01-26' },
            ],
          },
        ],
      },
    ],
  },
];

interface MediaLibraryProps {
  onNavigateToEditor: (subtitleId?: string) => void;
}

export default function MediaLibrary({ onNavigateToEditor }: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(sampleMedia);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

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
          <Button className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Media
          </Button>
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
              {!searchQuery && (
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
