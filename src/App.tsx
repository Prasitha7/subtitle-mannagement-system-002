import { Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SubtitleEditor from "./components/subtitle-editor/SubtitleEditor";
import MediaLibrary from "./components/media-library/MediaLibrary";
import { Toaster } from "./components/ui/sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MySubtitles from "./pages/MySubtitles";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";

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
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<MediaLibraryPage />} />
          <Route path="/library" element={<MediaLibraryPage />} />
          <Route path="/editor" element={
            <ProtectedRoute>
              <SubtitleEditor />
            </ProtectedRoute>
          } />
          <Route path="/my-subtitles" element={
            <ProtectedRoute>
              <MySubtitles />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
