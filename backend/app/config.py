from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database - Using SQLite for testing
    database_url: str = "sqlite:///./edutok.db"
    database_url_async: str = "sqlite+aiosqlite:///./edutok.db"
    
    # Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # External APIs
    youtube_api_key: Optional[str] = None
    tiktok_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # File Storage
    upload_dir: str = "./uploads"
    max_file_size: int = 10485760  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 