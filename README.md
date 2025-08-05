# EduTikTok - Educational Content Platform

A TikTok-like application focused exclusively on educational content in data engineering, AI, technology, and data science. This platform filters out entertainment content to provide a productive learning experience.

## Features

- **Content Filtering**: Only educational content from verified creators
- **Vertical Video Interface**: TikTok-like swipe interface for educational videos
- **Content Categories**: Data Engineering, AI, Technology, Data Science
- **Creator Verification**: Curated list of educational content creators
- **Content Scraping**: Automated collection from YouTube and TikTok
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching

### Backend
- FastAPI (Python)
- SQLAlchemy for database management
- Pydantic for data validation
- Celery for background tasks

### Content Scraping
- yt-dlp for YouTube content
- TikTok API integration
- Content classification using AI

## Project Structure

```
edu-tiktok/
├── frontend/          # React application
├── backend/           # FastAPI server
├── scraper/           # Content scraping scripts
├── data/              # Database and data files
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies for each component
3. Set up environment variables
4. Run the development servers

## Content Sources

### YouTube Channels
- DataCamp
- StatQuest
- 3Blue1Brown
- Sentdex
- Krish Naik
- CodeWithHarry
- Tech With Tim
- Corey Schafer

### TikTok Creators
- @datascience
- @ai_explained
- @tech_tips
- @coding_tutorials
- @machinelearning

## License

MIT License
