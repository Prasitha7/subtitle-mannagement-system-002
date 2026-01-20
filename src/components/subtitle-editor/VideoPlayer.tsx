import { useEffect, useRef, useState } from 'react';
import { Subtitle } from '@/types/subtitle';

interface VideoPlayerProps {
  videoUrl: string | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  playbackSpeed: number;
  subtitles: Subtitle[];
}

export default function VideoPlayer({
  videoUrl,
  currentTime,
  onTimeUpdate,
  isPlaying,
  playbackSpeed,
  subtitles,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const active = subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );
    setCurrentSubtitle(active || null);
  }, [currentTime, subtitles]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  if (!videoUrl) {
    return (
      <div className="w-full h-full bg-card rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No video loaded</p>
          <p className="text-sm">Click "Load Video" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
      />
      
      {currentSubtitle && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8">
          <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded max-w-3xl">
            <p className="text-white text-center text-lg font-medium leading-relaxed whitespace-pre-wrap">
              {currentSubtitle.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
