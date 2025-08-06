from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from ..database import Base


class VideoCategory(str, PyEnum):
    DATA_ENGINEERING = "data-engineering"
    AI = "ai"
    DATA_SCIENCE = "data-science"
    TECHNOLOGY = "technology"
    PROGRAMMING = "programming"
    MACHINE_LEARNING = "machine-learning"
    WEB_DEVELOPMENT = "web-development"
    MOBILE_DEVELOPMENT = "mobile-development"


class VideoDifficulty(str, PyEnum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ContentSource(str, PyEnum):
    AI_GENERATED = "ai-generated"
    MANUAL = "manual"
    UPLOADED = "uploaded"


class GenerationStatus(str, PyEnum):
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    video_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    duration = Column(Integer)  # Duration in seconds
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    category = Column(Enum(VideoCategory), nullable=False, index=True)
    difficulty = Column(Enum(VideoDifficulty), nullable=False, index=True)
    tags = Column(String(500))  # Comma-separated tags
    source = Column(String(20))  # 'youtube', 'tiktok', 'ai-generated'
    source_id = Column(String(100))  # External platform video ID
    is_educational = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    creator_id = Column(Integer, ForeignKey("creators.id"), nullable=False)
    
    # AI Content Generation Fields
    content_source = Column(Enum(ContentSource), default=ContentSource.MANUAL)
    generation_status = Column(Enum(GenerationStatus), default=GenerationStatus.COMPLETED)
    ai_prompt = Column(Text)  # The prompt used to generate the content
    ai_tools_used = Column(JSON)  # List of AI tools used (e.g., ["chatgpt", "runway", "elevenlabs"])
    generation_metadata = Column(JSON)  # Additional metadata about generation process
    script_content = Column(Text)  # The generated script
    voice_settings = Column(JSON)  # Voice configuration (speed, tone, etc.)
    visual_style = Column(String(100))  # Visual style description
    target_audience = Column(String(100))  # Target audience description
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    creator = relationship("Creator", back_populates="videos") 