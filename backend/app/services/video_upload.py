import os
import shutil
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from ..models.video import Video, VideoCategory, VideoDifficulty, ContentSource, GenerationStatus
from ..models.creator import Creator
from ..schemas.video import VideoCreate
from ..database import get_db

logger = logging.getLogger(__name__)

class VideoUploadService:
    """Service for handling video uploads"""
    
    def __init__(self):
        self.upload_dir = "uploads/videos"
        self.thumbnail_dir = "uploads/thumbnails"
        self.max_file_size = 100 * 1024 * 1024  # 100MB
        self.allowed_extensions = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
        
        # Create upload directories
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.thumbnail_dir, exist_ok=True)
    
    async def upload_video(
        self,
        file: UploadFile,
        title: str,
        description: str,
        category: VideoCategory,
        difficulty: VideoDifficulty,
        creator_id: int,
        tags: Optional[str] = None,
        is_educational: bool = True
    ) -> Video:
        """
        Upload and process a video file
        
        Args:
            file: Uploaded video file
            title: Video title
            description: Video description
            category: Video category
            difficulty: Video difficulty
            creator_id: ID of the creator
            tags: Comma-separated tags
            is_educational: Whether the video is educational
            
        Returns:
            Video object
        """
        try:
            # Validate file
            self._validate_file(file)
            
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_extension = os.path.splitext(file.filename)[1].lower()
            filename = f"{title.lower().replace(' ', '_')}_{timestamp}{file_extension}"
            
            # Save video file
            video_path = os.path.join(self.upload_dir, filename)
            with open(video_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Generate thumbnail (placeholder for now)
            thumbnail_filename = f"thumb_{filename.replace(file_extension, '.jpg')}"
            thumbnail_path = os.path.join(self.thumbnail_dir, thumbnail_filename)
            
            # Create placeholder thumbnail
            self._create_placeholder_thumbnail(thumbnail_path)
            
            # Get video duration (placeholder)
            duration = self._get_video_duration(video_path)
            
            # Create video record
            db = next(get_db())
            
            video_data = VideoCreate(
                title=title,
                description=description,
                video_url=f"/uploads/videos/{filename}",
                thumbnail_url=f"/uploads/thumbnails/{thumbnail_filename}",
                duration=duration,
                category=category,
                difficulty=difficulty,
                tags=tags or f"{category.value},{difficulty.value},uploaded",
                source="uploaded",
                source_id=f"upload-{timestamp}",
                is_educational=is_educational,
                is_verified=True,
                creator_id=creator_id,
                content_source=ContentSource.UPLOADED,
                generation_status=GenerationStatus.COMPLETED,
                ai_prompt=None,
                ai_tools_used=None,
                generation_metadata={
                    "upload_time": datetime.now().isoformat(),
                    "original_filename": file.filename,
                    "file_size": os.path.getsize(video_path),
                    "upload_method": "manual"
                },
                script_content=None,
                voice_settings=None,
                visual_style=None,
                target_audience=None
            )
            
            # Create video record
            video = Video(**video_data.dict())
            db.add(video)
            db.commit()
            db.refresh(video)
            
            logger.info(f"Video uploaded successfully: {video.id} - {title}")
            return video
            
        except Exception as e:
            logger.error(f"Error uploading video: {e}")
            raise HTTPException(status_code=500, detail=f"Error uploading video: {str(e)}")
    
    def _validate_file(self, file: UploadFile):
        """Validate uploaded file"""
        # Check file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in self.allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(self.allowed_extensions)}"
            )
        
        # Check file size
        if file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {self.max_file_size // (1024*1024)}MB"
            )
    
    def _create_placeholder_thumbnail(self, thumbnail_path: str):
        """Create a placeholder thumbnail"""
        # For now, create an empty file
        # In production, you'd use a library like Pillow to generate thumbnails
        with open(thumbnail_path, "w") as f:
            f.write("placeholder")
    
    def _get_video_duration(self, video_path: str) -> int:
        """Get video duration in seconds"""
        # Placeholder - in production, use ffmpeg or similar
        return 180  # Default 3 minutes
    
    def get_upload_stats(self) -> Dict[str, Any]:
        """Get upload directory statistics"""
        try:
            video_count = len([f for f in os.listdir(self.upload_dir) if f.endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm'))])
            total_size = sum(os.path.getsize(os.path.join(self.upload_dir, f)) for f in os.listdir(self.upload_dir) if os.path.isfile(os.path.join(self.upload_dir, f)))
            
            return {
                "video_count": video_count,
                "total_size_mb": total_size // (1024 * 1024),
                "upload_dir": self.upload_dir,
                "thumbnail_dir": self.thumbnail_dir
            }
        except Exception as e:
            logger.error(f"Error getting upload stats: {e}")
            return {"error": str(e)}

# Global instance
video_upload_service = VideoUploadService() 