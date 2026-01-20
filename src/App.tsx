import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import SubtitleEditor from "./components/subtitle-editor/SubtitleEditor";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<SubtitleEditor />} />
        </Routes>
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
