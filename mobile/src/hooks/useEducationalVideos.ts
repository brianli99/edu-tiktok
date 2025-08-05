import { useState, useEffect } from 'react';
import { EducationalVideo } from '../types';
import { mockVideos } from '../data/mockVideos';

export const useEducationalVideos = () => {
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data for now
      const fetchedVideos = mockVideos;
      
      setVideos(fetchedVideos);
    } catch (err) {
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
        setVideos(mockVideos);
      } else {
        const filteredVideos = mockVideos.filter(video => video.category === selectedCategory);
        setVideos(filteredVideos);
      }
    } catch (err) {
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

      // Filter videos based on search query
      const searchResults = mockVideos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.creator.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      setVideos(searchResults);
    } catch (err) {
      setError('Failed to search videos');
      console.error('Error searching videos:', err);
    } finally {
      setLoading(false);
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
  };
};
