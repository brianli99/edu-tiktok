export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  category: 'data-engineering' | 'ai' | 'data-science' | 'technology' | 'programming' | 'machine-learning' | 'web-development' | 'mobile-development';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  source: 'youtube' | 'tiktok' | 'ai-generated';
  createdAt: Date;
  
  // AI Content Generation fields
  isAIGenerated?: boolean;
  generationStatus?: 'pending' | 'generating' | 'completed' | 'failed';
  aiToolsUsed?: string[];
  scriptContent?: string;
  voiceSettings?: {
    speed?: number;
    tone?: string;
    language?: string;
    voice_id?: string;
  };
  visualStyle?: string;
  targetAudience?: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  verified: boolean;
  categories: string[];
  bio: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
