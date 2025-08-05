import axios from 'axios';
import { EducationalVideo } from '../types';

// YouTube API configuration
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // You'll need to get this from Google Cloud Console
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Educational channels to fetch content from
const EDUCATIONAL_CHANNELS = [
  'UCVHFxqKqHsG5NfOrY9Jq6bg', // DataCamp
  'UCtYLUTtgS3k1Fg4y5GIdzTQ', // StatQuest
  'UCYO_jab_esuFRV4b17AJtAw', // 3Blue1Brown
  'UC8butISFwT-Wl7EV0hUK0BQ', // freeCodeCamp
  'UCWr0mx597DnSGLFk1WfvSkQ', // Corey Schafer
  'UCsT0YIqwnpJCM-mx7-gSA4Q', // Tech With Tim
];

// Educational search terms
const EDUCATIONAL_TOPICS = [
  'data engineering tutorial',
  'machine learning basics',
  'python for data science',
  'SQL tutorial',
  'deep learning explained',
  'data science projects',
  'ETL pipeline tutorial',
  'artificial intelligence basics',
];

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
}

class YouTubeApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Search for educational videos
  async searchEducationalVideos(query: string, maxResults: number = 20): Promise<EducationalVideo[]> {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          key: this.apiKey,
          videoDuration: 'short', // Prefer shorter videos for TikTok-style
          videoEmbeddable: true,
          relevanceLanguage: 'en',
        },
      });

      const videos = response.data.items as YouTubeVideo[];
      
      // Get additional statistics for each video
      const videosWithStats = await this.getVideoStatistics(videos);
      
      return videosWithStats.map(this.mapYouTubeToEducationalVideo);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  // Get video statistics (views, likes, etc.)
  private async getVideoStatistics(videos: YouTubeVideo[]): Promise<YouTubeVideo[]> {
    try {
      const videoIds = videos.map(video => video.id.videoId).join(',');
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          part: 'statistics,snippet',
          id: videoIds,
          key: this.apiKey,
        },
      });

      return response.data.items as YouTubeVideo[];
    } catch (error) {
      console.error('Error fetching video statistics:', error);
      return videos;
    }
  }

  // Get videos from specific educational channels
  async getChannelVideos(channelId: string, maxResults: number = 20): Promise<EducationalVideo[]> {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          channelId,
          type: 'video',
          maxResults,
          key: this.apiKey,
          order: 'date',
        },
      });

      const videos = response.data.items as YouTubeVideo[];
      const videosWithStats = await this.getVideoStatistics(videos);
      
      return videosWithStats.map(this.mapYouTubeToEducationalVideo);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return [];
    }
  }

  // Get trending educational videos
  async getTrendingEducationalVideos(maxResults: number = 20): Promise<EducationalVideo[]> {
    const allVideos: EducationalVideo[] = [];
    
    for (const topic of EDUCATIONAL_TOPICS) {
      const videos = await this.searchEducationalVideos(topic, Math.ceil(maxResults / EDUCATIONAL_TOPICS.length));
      allVideos.push(...videos);
    }

    // Sort by view count and remove duplicates
    const uniqueVideos = this.removeDuplicateVideos(allVideos);
    return uniqueVideos
      .sort((a, b) => b.views - a.views)
      .slice(0, maxResults);
  }

  // Remove duplicate videos based on video ID
  private removeDuplicateVideos(videos: EducationalVideo[]): EducationalVideo[] {
    const seen = new Set();
    return videos.filter(video => {
      const duplicate = seen.has(video.id);
      seen.add(video.id);
      return !duplicate;
    });
  }

  // Map YouTube API response to our EducationalVideo type
  private mapYouTubeToEducationalVideo(youtubeVideo: YouTubeVideo): EducationalVideo {
    const category = this.determineCategory(youtubeVideo.snippet.title, youtubeVideo.snippet.description);
    const difficulty = this.determineDifficulty(youtubeVideo.snippet.title, youtubeVideo.snippet.description);
    
    return {
      id: youtubeVideo.id.videoId,
      title: youtubeVideo.snippet.title,
      description: youtubeVideo.snippet.description,
      creator: youtubeVideo.snippet.channelTitle,
      creatorAvatar: `https://yt3.ggpht.com/a/default-user=s88-c-k-c0x00ffffff-no-rj-mo`, // Default YouTube avatar
      videoUrl: `https://www.youtube.com/watch?v=${youtubeVideo.id.videoId}`,
      thumbnailUrl: youtubeVideo.snippet.thumbnails.medium.url,
      duration: 0, // YouTube API doesn't provide duration in search results
      views: parseInt(youtubeVideo.statistics?.viewCount || '0'),
      likes: parseInt(youtubeVideo.statistics?.likeCount || '0'),
      category,
      tags: this.extractTags(youtubeVideo.snippet.title, youtubeVideo.snippet.description),
      difficulty,
      source: 'youtube',
      createdAt: new Date(youtubeVideo.snippet.publishedAt),
    };
  }

  // Determine video category based on title and description
  private determineCategory(title: string, description: string): EducationalVideo['category'] {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('data engineering') || text.includes('etl') || text.includes('pipeline')) {
      return 'data-engineering';
    }
    if (text.includes('machine learning') || text.includes('ai') || text.includes('neural network')) {
      return 'ai';
    }
    if (text.includes('data science') || text.includes('analytics') || text.includes('statistics')) {
      return 'data-science';
    }
    return 'technology';
  }

  // Determine difficulty level
  private determineDifficulty(title: string, description: string): EducationalVideo['difficulty'] {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert') || text.includes('deep dive')) {
      return 'advanced';
    }
    if (text.includes('intermediate') || text.includes('tutorial') || text.includes('guide')) {
      return 'intermediate';
    }
    return 'beginner';
  }

  // Extract relevant tags from title and description
  private extractTags(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const commonTags = [
      'python', 'sql', 'javascript', 'react', 'node.js', 'docker', 'kubernetes',
      'aws', 'azure', 'gcp', 'spark', 'hadoop', 'kafka', 'redis', 'mongodb',
      'postgresql', 'mysql', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
      'numpy', 'matplotlib', 'seaborn', 'jupyter', 'git', 'linux', 'bash'
    ];
    
    return commonTags.filter(tag => text.includes(tag));
  }
}

// Create and export the service instance
export const youtubeApiService = new YouTubeApiService(YOUTUBE_API_KEY);

export default YouTubeApiService;
