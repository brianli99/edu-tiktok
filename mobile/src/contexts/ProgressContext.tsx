import React, { createContext, useContext, useState, useEffect } from 'react';
import { EducationalVideo } from '../types';

interface ProgressData {
  watchedVideos: string[];
  completedCategories: string[];
  totalWatchTime: number;
  learningStreak: number;
  lastWatchedDate: Date | null;
}

interface ProgressContextType {
  progress: ProgressData;
  markVideoWatched: (videoId: string) => void;
  getCategoryProgress: (category: string) => number;
  getTotalProgress: () => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>({
    watchedVideos: [],
    completedCategories: [],
    totalWatchTime: 0,
    learningStreak: 0,
    lastWatchedDate: null,
  });

  const markVideoWatched = (videoId: string) => {
    setProgress(prev => {
      const newWatchedVideos = prev.watchedVideos.includes(videoId) 
        ? prev.watchedVideos 
        : [...prev.watchedVideos, videoId];

      // Calculate learning streak
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = prev.learningStreak;
      if (!prev.lastWatchedDate || 
          prev.lastWatchedDate.toDateString() === yesterday.toDateString() ||
          prev.lastWatchedDate.toDateString() === today.toDateString()) {
        newStreak = prev.learningStreak + 1;
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        watchedVideos: newWatchedVideos,
        totalWatchTime: prev.totalWatchTime + 180, // Assume 3 minutes per video
        learningStreak: newStreak,
        lastWatchedDate: today,
      };
    });
  };

  const getCategoryProgress = (category: string): number => {
    // This would be calculated based on watched videos in that category
    const categoryVideos = progress.watchedVideos.length; // Simplified for now
    return Math.min((categoryVideos / 10) * 100, 100); // Assume 10 videos per category
  };

  const getTotalProgress = (): number => {
    const totalVideos = 40; // Total videos in the app
    return Math.min((progress.watchedVideos.length / totalVideos) * 100, 100);
  };

  const resetProgress = () => {
    setProgress({
      watchedVideos: [],
      completedCategories: [],
      totalWatchTime: 0,
      learningStreak: 0,
      lastWatchedDate: null,
    });
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      markVideoWatched,
      getCategoryProgress,
      getTotalProgress,
      resetProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
