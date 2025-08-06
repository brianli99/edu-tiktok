import { useState, useCallback } from 'react';
import { VideoPlayerStatus } from 'expo-video';
import { progressAPI } from '../services/api';

interface UseVideoPlaybackProps {
  videoId: number;
  onProgressUpdate?: (progress: number) => void;
}

export const useVideoPlayback = ({ videoId, onProgressUpdate }: UseVideoPlaybackProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlaybackStatusUpdate = useCallback((status: VideoPlayerStatus) => {
    if (status === 'readyToPlay') {
      // Video is ready to play
      console.log('Video ready to play');
    } else if (status === 'loading') {
      // Video is loading
      console.log('Video loading');
    } else if (status === 'error') {
      // Video encountered an error
      console.error('Video playback error');
    }
  }, [videoId, onProgressUpdate]);

  const markVideoAsCompleted = useCallback(async () => {
    try {
      await progressAPI.addWatchHistory({
        video_id: videoId,
        watch_duration: Math.floor(currentTime),
        watch_percentage: progress,
        completed: true,
      });
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    }
  }, [videoId, currentTime, progress]);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    setIsCompleted(true);
    markVideoAsCompleted();
  }, [markVideoAsCompleted]);

  const handleVideoError = useCallback((error: string) => {
    console.error('Video playback error:', error);
    setIsPlaying(false);
  }, []);

  const updateProgress = useCallback(async (watchDuration: number, watchPercentage: number) => {
    try {
      await progressAPI.addWatchHistory({
        video_id: videoId,
        watch_duration: watchDuration,
        watch_percentage: watchPercentage,
        completed: watchPercentage >= 90,
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, [videoId]);

  return {
    isPlaying,
    currentTime,
    duration,
    progress,
    isCompleted,
    handlePlaybackStatusUpdate,
    handleVideoEnd,
    handleVideoError,
    updateProgress,
  };
}; 