# EduTok Backend

A FastAPI-based backend for the EduTok educational content platform. This backend provides APIs for video management, user authentication, progress tracking, and social interactions.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Video Management**: CRUD operations for educational videos with search and filtering
- **Progress Tracking**: Watch history and learning analytics
- **Social Features**: Likes, comments, and bookmarks
- **Creator Management**: Educational content creator profiles
- **YouTube Integration**: API utilities for fetching educational content

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation using Python type annotations
- **Alembic**: Database migrations

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/edutok_db
DATABASE_URL_ASYNC=postgresql+asyncpg://user:password@localhost:5432/edutok_db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration
REDIS_URL=redis://localhost:6379

# YouTube API (Optional)
YOUTUBE_API_KEY=your-youtube-api-key

# Environment
ENVIRONMENT=development
DEBUG=true
```

### 3. Database Setup

#### Option A: Using SQLite (Development)

For quick development setup, you can use SQLite by modifying the database URLs in `.env`:

```env
DATABASE_URL=sqlite:///./edutok.db
DATABASE_URL_ASYNC=sqlite+aiosqlite:///./edutok.db
```

#### Option B: Using PostgreSQL (Production)

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE edutok_db;
   ```
3. Update the `.env` file with your PostgreSQL credentials

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
- 5 educational content creators
- 5 sample videos
- 2 test users (test@example.com / password123)

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

### Videos
- `GET /videos` - List videos with filtering
- `GET /videos/{id}` - Get specific video
- `GET /videos/category/{category}` - Get videos by category
- `POST /videos` - Create video (admin only)
- `PUT /videos/{id}` - Update video (admin only)
- `DELETE /videos/{id}` - Delete video (admin only)

### Progress
- `GET /progress/me` - Get user progress
- `GET /progress/watch-history` - Get watch history
- `POST /progress/watch-history` - Add watch record
- `DELETE /progress/watch-history/{video_id}` - Delete watch record

### Interactions
- `POST /interactions/likes` - Like a video
- `DELETE /interactions/likes/{video_id}` - Unlike a video
- `GET /interactions/likes/{video_id}` - Check like status
- `GET /interactions/comments/{video_id}` - Get video comments
- `POST /interactions/comments` - Add comment
- `DELETE /interactions/comments/{comment_id}` - Delete comment
- `POST /interactions/bookmarks` - Bookmark video
- `DELETE /interactions/bookmarks/{video_id}` - Remove bookmark
- `GET /interactions/bookmarks` - Get user bookmarks

### Creators
- `GET /creators` - List creators
- `GET /creators/{id}` - Get specific creator
- `POST /creators` - Create creator (admin only)
- `PUT /creators/{id}` - Update creator (admin only)
- `DELETE /creators/{id}` - Delete creator (admin only)

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user

## Database Schema

### Users
- Authentication and profile information
- Learning progress tracking
- Social interactions

### Videos
- Educational content metadata
- Creator relationships
- Engagement metrics

### Creators
- Educational content creator profiles
- Platform integration data
- Verification status

### Progress
- User learning analytics
- Watch history tracking
- Streak calculations

### Interactions
- Likes, comments, and bookmarks
- User engagement tracking
- Social features

## Development

### Adding New Endpoints

1. Create a new router in `app/routers/`
2. Add schemas in `app/schemas/`
3. Update models if needed in `app/models/`
4. Include the router in `app/main.py`

### Database Migrations

For production, use Alembic for database migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

### Testing

Run tests with pytest:

```bash
pytest
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

Set these environment variables in production:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Strong secret key for JWT
- `REDIS_URL`: Redis connection string
- `ENVIRONMENT`: Set to "production"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License 