# EduTok - AI-Powered Educational Mobile Platform

A TikTok-style mobile application focused on AI-generated educational content in data engineering, AI, technology, and data science. This platform uses artificial intelligence to create personalized educational videos, providing a productive learning experience through engaging short-form content.

## Features

- **AI-Generated Content**: Personalized educational videos created using AI
- **Mobile-First Design**: Native React Native app with TikTok-like interface
- **Vertical Video Interface**: Swipe-based navigation for educational videos
- **Content Categories**: Data Engineering, AI, Technology, Data Science
- **User Content Generation**: Users can generate their own educational content
- **Progress Tracking**: Track learning progress across different topics
- **Responsive Design**: Optimized for mobile devices

## Tech Stack

### Mobile App
- React Native with TypeScript
- Expo for development and deployment
- React Navigation for routing
- Expo AV for video playback
- AsyncStorage for local data

### Backend
- FastAPI (Python)
- SQLAlchemy for database management
- Pydantic for data validation
- AI content generation services
- Video processing and storage

### AI Services
- OpenAI GPT for script generation
- ElevenLabs for text-to-speech
- Video synthesis and editing
- Content personalization algorithms

## Project Structure

```
edu-tiktok/
├── mobile/            # React Native mobile application
├── backend/           # FastAPI server with AI services
├── data/              # Sample video content
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8+
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/edu-tiktok.git
   cd edu-tiktok
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your API keys
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. **Set up the mobile app**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

4. **Run the application**
   - Backend will be available at `http://localhost:8000`
   - Mobile app will be available through Expo Go app

## AI Content Generation

### Current Capabilities
- **Script Generation**: AI creates educational scripts based on topics
- **Voice Synthesis**: Natural-sounding narration using ElevenLabs
- **Video Creation**: Automated video generation with educational content
- **Content Personalization**: Tailored content based on user preferences

### Future Capabilities
- **User-Generated Content**: Users can create their own educational videos
- **Interactive Learning**: Quizzes and assessments integrated into videos
- **Collaborative Learning**: Social features for sharing and commenting
- **Advanced AI**: More sophisticated content generation and personalization

## Content Categories

### Data Engineering
- SQL tutorials
- Data pipeline concepts
- ETL processes
- Database design

### AI & Machine Learning
- Machine learning fundamentals
- Neural networks
- Deep learning concepts
- AI applications

### Technology
- Programming tutorials
- Software development
- Cloud computing
- DevOps practices

### Data Science
- Statistical analysis
- Data visualization
- Predictive modeling
- Business intelligence

## Development

### Backend Development
- FastAPI with automatic API documentation
- SQLAlchemy ORM for database operations
- Pydantic models for data validation
- AI service integration

### Mobile Development
- React Native with TypeScript
- Expo for cross-platform development
- Video playback optimization
- Offline capability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

## Roadmap

- [ ] User authentication and profiles
- [ ] User-generated content creation
- [ ] Advanced AI content generation
- [ ] Social features (likes, comments, shares)
- [ ] Offline video caching
- [ ] Push notifications
- [ ] Analytics and progress tracking
- [ ] Multi-language support
