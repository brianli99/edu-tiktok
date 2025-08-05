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
  category: 'data-engineering' | 'ai' | 'data-science' | 'technology';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  source: 'youtube' | 'tiktok';
  createdAt: Date;
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
