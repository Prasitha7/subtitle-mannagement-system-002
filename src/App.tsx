import { Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SubtitleEditor from "./components/subtitle-editor/SubtitleEditor";
import MediaLibrary from "./components/media-library/MediaLibrary";
import { Toaster } from "./components/ui/sonner";

function MediaLibraryPage() {
  const navigate = useNavigate();
  
  const handleNavigateToEditor = (subtitleId?: string) => {
    navigate('/editor');
  };

  return <MediaLibrary onNavigateToEditor={handleNavigateToEditor} />;
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<MediaLibraryPage />} />
          <Route path="/library" element={<MediaLibraryPage />} />
          <Route path="/editor" element={<SubtitleEditor />} />
        </Routes>
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
