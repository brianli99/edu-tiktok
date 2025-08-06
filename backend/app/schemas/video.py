from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from ..models.video import VideoCategory, VideoDifficulty, ContentSource, GenerationStatus


class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    category: VideoCategory
    difficulty: VideoDifficulty
    tags: Optional[str] = None
    source: str
    source_id: Optional[str] = None
    is_educational: bool = True
    is_verified: bool = False
    
    # AI Content Generation Fields
    content_source: Optional[ContentSource] = ContentSource.MANUAL
    generation_status: Optional[GenerationStatus] = GenerationStatus.COMPLETED
    ai_prompt: Optional[str] = None
    ai_tools_used: Optional[List[str]] = None
    generation_metadata: Optional[Dict[str, Any]] = None
    script_content: Optional[str] = None
    voice_settings: Optional[Dict[str, Any]] = None
    visual_style: Optional[str] = None
    target_audience: Optional[str] = None


class VideoCreate(VideoBase):
    creator_id: int


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    category: Optional[VideoCategory] = None
    difficulty: Optional[VideoDifficulty] = None
    tags: Optional[str] = None
    is_educational: Optional[bool] = None
    is_verified: Optional[bool] = None
    
    # AI Content Generation Fields
    generation_status: Optional[GenerationStatus] = None
    ai_prompt: Optional[str] = None
    ai_tools_used: Optional[List[str]] = None
    generation_metadata: Optional[Dict[str, Any]] = None
    script_content: Optional[str] = None
    voice_settings: Optional[Dict[str, Any]] = None
    visual_style: Optional[str] = None
    target_audience: Optional[str] = None


class CreatorInfo(BaseModel):
    id: int
    name: str
    username: str
    avatar_url: Optional[str] = None
    verified: bool

    class Config:
        from_attributes = True


class VideoResponse(VideoBase):
    id: int
    views: int
    likes: int
    creator: CreatorInfo
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VideoList(BaseModel):
    videos: List[VideoResponse]
    total: int
    page: int
    size: int
    has_next: bool
    has_prev: bool


# AI Content Generation Schemas
class ScriptGenerationRequest(BaseModel):
    topic: str
    category: VideoCategory
    difficulty: VideoDifficulty
    target_audience: str = "beginners"
    duration_minutes: int = 3
    style: str = "engaging and educational"


class ScriptGenerationResponse(BaseModel):
    success: bool
    script: str
    metadata: Dict[str, Any]
    ai_tools_used: List[str]


class VideoCreationRequest(BaseModel):
    script: str
    title: str
    category: VideoCategory
    difficulty: VideoDifficulty
    voice_settings: Optional[Dict[str, Any]] = None
    visual_style: str = "modern and clean"


class BatchGenerationRequest(BaseModel):
    topics: List[str]
    category: VideoCategory
    difficulty: VideoDifficulty


class GenerationStatusResponse(BaseModel):
    video_id: int
    title: str
    generation_status: GenerationStatus
    content_source: ContentSource
    ai_tools_used: Optional[List[str]] = None
    created_at: datetime


class GenerationStatsResponse(BaseModel):
    total_videos: int
    ai_generated: int
    pending_generation: int
    failed_generation: int
    by_category: Dict[str, int]
    by_difficulty: Dict[str, int] 