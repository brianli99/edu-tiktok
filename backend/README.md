# EduTok Backend - AI-Powered Educational Content API

A FastAPI-based backend for the EduTok educational content platform. This backend provides APIs for AI-generated video content, user authentication, progress tracking, and content generation services.

## Features

- **AI Content Generation**: Automated creation of educational videos using AI
- **User Authentication**: JWT-based authentication with registration and login
- **Video Management**: CRUD operations for AI-generated educational videos
- **Progress Tracking**: Watch history and learning analytics
- **Content Creation**: User-generated content capabilities
- **AI Services Integration**: OpenAI GPT and ElevenLabs for content generation
- **Video Processing**: Automated video synthesis and editing

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Development database (PostgreSQL for production)
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation using Python type annotations
- **OpenAI GPT**: AI script generation
- **ElevenLabs**: Text-to-speech synthesis
- **Video Processing**: Automated video creation and editing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
pip install -r requirements_ai.txt  # AI-specific dependencies
```

### 2. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL=sqlite:///./edutok.db
DATABASE_URL_ASYNC=sqlite+aiosqlite:///./edutok.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Environment
ENVIRONMENT=development
DEBUG=true
```

### 3. Database Setup

The application uses SQLite by default for development. For production, you can switch to PostgreSQL by updating the database URLs in `.env`.

### 4. Run the Application

#### Development Mode

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 5. Seed the Database

Populate the database with initial data:

```bash
python seed_db.py
```

This will create:
- Sample educational content creators
- AI-generated video content
- Test users for development

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Videos (AI-Generated Content)
- `GET /videos` - List AI-generated videos with filtering
- `GET /videos/{id}` - Get specific video
- `GET /videos/category/{category}` - Get videos by category
- `POST /videos/generate` - Generate new AI content
- `POST /videos` - Create video (admin only)
- `PUT /videos/{id}` - Update video (admin only)
- `DELETE /videos/{id}` - Delete video (admin only)

### AI Content Generation
- `POST /videos/generate-script` - Generate educational script
- `POST /videos/generate-audio` - Generate voice narration
- `POST /videos/create-video` - Create complete video
- `GET /videos/generation-status/{id}` - Check generation status

### Progress
- `GET /progress/me` - Get user progress
- `GET /progress/watch-history` - Get watch history
- `POST /progress/watch-history` - Add watch record
- `DELETE /progress/watch-history/{video_id}` - Delete watch record

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user

## AI Content Generation

### Script Generation
The backend uses OpenAI GPT to generate educational scripts based on:
- Topic selection
- Difficulty level
- Target audience
- Learning objectives

### Voice Synthesis
ElevenLabs integration provides:
- Natural-sounding narration
- Multiple voice options
- Emotion and tone control
- High-quality audio output

### Video Creation
Automated video generation includes:
- Script-to-video conversion
- Visual content generation
- Audio-video synchronization
- Quality optimization

## Database Schema

### Users
- Authentication and profile information
- Learning progress tracking
- Content generation preferences

### Videos
- AI-generated educational content metadata
- Generation parameters and settings
- Engagement metrics and analytics

### Creators
- AI content creator profiles
- Generation style preferences
- Content quality metrics

### Progress
- User learning analytics
- Watch history tracking
- Content engagement patterns

## Development

### Adding New AI Features

1. Create new services in `app/services/`
2. Add schemas for AI requests/responses in `app/schemas/`
3. Update routers to include AI endpoints
4. Test with sample content generation

### AI Service Integration

The backend integrates with multiple AI services:

```python
# Example: Generate educational script
from app.services.ai_content_generator import ai_content_generator

script = await ai_content_generator.generate_script(
    topic="Machine Learning Basics",
    difficulty="beginner",
    duration_minutes=3
)
```

### Testing AI Features

```bash
# Test AI content generation
python -m pytest tests/test_ai_content.py
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt requirements_ai.txt ./
RUN pip install -r requirements.txt -r requirements_ai.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

Set these environment variables in production:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Strong secret key for JWT
- `OPENAI_API_KEY`: OpenAI API key for content generation
- `ELEVENLABS_API_KEY`: ElevenLabs API key for voice synthesis
- `ENVIRONMENT`: Set to "production"

## AI Content Categories

### Data Engineering
- SQL tutorials and best practices
- Data pipeline concepts and implementation
- ETL process design and optimization
- Database design and architecture

### AI & Machine Learning
- Machine learning fundamentals
- Neural network concepts
- Deep learning applications
- AI ethics and responsible development

### Technology
- Programming language tutorials
- Software development methodologies
- Cloud computing and DevOps
- Emerging technology trends

### Data Science
- Statistical analysis techniques
- Data visualization principles
- Predictive modeling approaches
- Business intelligence applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for AI features
5. Submit a pull request

## License

MIT License 