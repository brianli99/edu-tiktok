import { useState, useEffect } from 'react';
import { EducationalVideo } from '../types';
import { videosAPI } from '../services/api';

export const useEducationalVideos = () => {
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');

  const mapVideoData = (video: any): EducationalVideo => ({
    id: video.id.toString(),
    title: video.title,
    description: video.description,
    creator: video.creator.name,
    creatorAvatar: video.creator.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    videoUrl: video.video_url,
    thumbnailUrl: video.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
    duration: video.duration,
    views: video.views,
    likes: video.likes,
    category: video.category,
    tags: video.tags ? video.tags.split(',') : [],
    difficulty: video.difficulty,
    source: video.source,
    createdAt: new Date(video.created_at),
    // AI Content Generation fields
    isAIGenerated: video.content_source === 'ai-generated',
    generationStatus: video.generation_status,
    aiToolsUsed: video.ai_tools_used || [],
    scriptContent: video.script_content,
    voiceSettings: video.voice_settings,
    visualStyle: video.visual_style,
    targetAudience: video.target_audience
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await videosAPI.getVideos();
      const fetchedVideos = response.data.videos.map(mapVideoData);
      
      setVideos(fetchedVideos);
    } catch (err: any) {
      setError('Failed to fetch educational videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosByCategory = async (selectedCategory: string) => {
    try {
      setLoading(true);
      setError(null);
      setCategory(selectedCategory);

      if (selectedCategory === 'all') {
        await fetchVideos();
      } else {
        const response = await videosAPI.getVideosByCategory(selectedCategory);
        const fetchedVideos = response.data.videos.map(mapVideoData);
        setVideos(fetchedVideos);
      }
    } catch (err: any) {
      setError('Failed to fetch videos by category');
      console.error('Error fetching videos by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await videosAPI.searchVideos(query);
      const searchResults = response.data.videos.map(mapVideoData);
      setVideos(searchResults);
    } catch (err: any) {
      setError('Failed to search videos');
      console.error('Error searching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  // AI Content Generation functions
  const generateVideoScript = async (data: {
    topic: string;
    category: string;
    difficulty: string;
    target_audience?: string;
    duration_minutes?: number;
    style?: string;
  }) => {
    try {
      const response = await videosAPI.generateScript(data);
      return response.data;
    } catch (err: any) {
      console.error('Error generating script:', err);
      throw err;
    }
  };

  const createVideoFromScript = async (data: {
    script: string;
    title: string;
    category: string;
    difficulty: string;
    voice_settings?: any;
    visual_style?: string;
  }) => {
    try {
      const response = await videosAPI.createVideoFromScript(data);
      return response.data;
    } catch (err: any) {
      console.error('Error creating video:', err);
      throw err;
    }
  };

  const generateBatchVideos = async (data: {
    topics: string[];
    category: string;
    difficulty: string;
  }) => {
    try {
      const response = await videosAPI.generateBatchVideos(data);
      return response.data;
    } catch (err: any) {
      console.error('Error generating batch videos:', err);
      throw err;
    }
  };

  const getGenerationStats = async () => {
    try {
      const response = await videosAPI.getGenerationStats();
      return response.data;
    } catch (err: any) {
      console.error('Error getting generation stats:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    category,
    fetchVideos,
    fetchVideosByCategory,
    searchVideos,
    // AI Content Generation functions
    generateVideoScript,
    createVideoFromScript,
    generateBatchVideos,
    getGenerationStats,
  };
};
