import { EducationalVideo } from "../types";
export const mockVideos: EducationalVideo[] = [
  {
    id: "1",
    title: "Introduction to Data Engineering",
    description: "Learn the fundamentals of data engineering, ETL pipelines, and data architecture.",
    creator: "DataCamp",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
    duration: 180,
    views: 15420,
    likes: 1247,
    category: "data-engineering",
    tags: ["data-engineering", "etl", "pipeline"],
    difficulty: "beginner",
    source: "youtube",
    createdAt: new Date()
  }
];
