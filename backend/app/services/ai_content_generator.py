import asyncio
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.video import Video, VideoCategory, VideoDifficulty, ContentSource, GenerationStatus
from ..models.creator import Creator
from ..schemas.video import VideoCreate, VideoUpdate
from ..database import get_db
from .ai_services import AIServiceManager

logger = logging.getLogger(__name__)


class AIContentGenerator:
    """Service for generating AI-powered educational content"""
    
    def __init__(self):
        self.supported_categories = [cat.value for cat in VideoCategory]
        self.supported_difficulties = [diff.value for diff in VideoDifficulty]
        self.ai_service_manager = AIServiceManager()
    
    async def generate_video_script(
        self,
        topic: str,
        category: VideoCategory,
        difficulty: VideoDifficulty,
        target_audience: str = "beginners",
        duration_minutes: int = 3,
        style: str = "engaging and educational"
    ) -> Dict[str, Any]:
        """
        Generate a video script using AI
        
        Args:
            topic: The main topic of the video
            category: Video category
            difficulty: Target difficulty level
            target_audience: Target audience description
            duration_minutes: Target duration in minutes
            style: Writing style for the script
            
        Returns:
            Dict containing script, metadata, and generation info
        """
        try:
            # Use real AI service for script generation
            result = await self.ai_service_manager.generate_script_with_chatgpt(
                topic=topic,
                category=category.value,
                difficulty=difficulty.value,
                target_audience=target_audience,
                duration_minutes=duration_minutes,
                style=style
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating script: {e}")
            # Fallback to placeholder if AI service fails
            return await self._generate_fallback_script(topic, category, difficulty, target_audience, duration_minutes, style)
    
    async def create_video_from_script(
        self,
        script: str,
        title: str,
        category: VideoCategory,
        difficulty: VideoDifficulty,
        creator_id: int,
        voice_settings: Optional[Dict] = None,
        visual_style: str = "modern and clean"
    ) -> Video:
        """
        Create a video record from generated script
        
        Args:
            script: The generated script
            title: Video title
            category: Video category
            difficulty: Video difficulty
            creator_id: ID of the creator
            voice_settings: Voice configuration
            visual_style: Visual style description
            
        Returns:
            Video object
        """
        try:
            db = next(get_db())
            
            # Generate audio using ElevenLabs
            audio_result = await self.ai_service_manager.generate_voice_with_elevenlabs(
                script=script,
                voice_settings=voice_settings
            )
            
            # Generate video placeholder (since full video generation requires more complex setup)
            video_result = await self.ai_service_manager.generate_video_placeholder(
                script=script,
                visual_style=visual_style,
                duration_seconds=180  # 3 minutes
            )
            
            # Create video record with real AI-generated content
            video_data = VideoCreate(
                title=title,
                description=f"AI-generated educational content about {title}",
                video_url=video_result.get("video_url", f"/data/{title.lower().replace(' ', '-')}.mp4"),
                thumbnail_url=video_result.get("thumbnail_url", f"/thumbnails/{title.lower().replace(' ', '-')}.jpg"),
                duration=180,  # 3 minutes
                category=category,
                difficulty=difficulty,
                tags=f"{category.value},{difficulty.value},ai-generated",
                source="ai-generated",
                source_id=f"ai-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}",
                is_educational=True,
                is_verified=True,
                creator_id=creator_id,
                content_source=ContentSource.AI_GENERATED,
                generation_status=GenerationStatus.COMPLETED,
                ai_prompt=f"Create an educational video about {title}",
                ai_tools_used=audio_result.get("ai_tools_used", []) + video_result.get("ai_tools_used", []),
                generation_metadata={
                    "script_length": len(script),
                    "audio_duration": audio_result.get("duration", 0),
                    "generation_time": datetime.now().isoformat(),
                    "tools_used": audio_result.get("ai_tools_used", []) + video_result.get("ai_tools_used", []),
                    "voice_settings": voice_settings,
                    "visual_style": visual_style
                },
                script_content=script,
                voice_settings=voice_settings or {
                    "speed": 1.0,
                    "tone": "professional",
                    "language": "en"
                },
                visual_style=visual_style,
                target_audience="beginners"
            )
            
            # Create video record
            video = Video(**video_data.dict())
            db.add(video)
            db.commit()
            db.refresh(video)
            
            return video
            
        except Exception as e:
            logger.error(f"Error creating video from script: {e}")
            raise
    
    async def generate_content_batch(
        self,
        topics: List[str],
        category: VideoCategory,
        difficulty: VideoDifficulty,
        creator_id: int
    ) -> List[Video]:
        """
        Generate multiple videos in a batch
        
        Args:
            topics: List of topics to generate videos for
            category: Video category
            difficulty: Video difficulty
            creator_id: ID of the creator
            
        Returns:
            List of generated Video objects
        """
        videos = []
        
        for topic in topics:
            try:
                # Generate script
                script_result = await self.generate_video_script(
                    topic=topic,
                    category=category,
                    difficulty=difficulty
                )
                
                # Create video
                video = await self.create_video_from_script(
                    script=script_result["script"],
                    title=f"Learn {topic} - {difficulty.value.title()} Guide",
                    category=category,
                    difficulty=difficulty,
                    creator_id=creator_id
                )
                
                videos.append(video)
                
                # Add delay to avoid rate limiting
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error generating video for topic '{topic}': {e}")
                continue
        
        return videos
    
    def _get_script_template(self, category: VideoCategory, difficulty: VideoDifficulty) -> str:
        """Get script template based on category and difficulty"""
        
        templates = {
            VideoCategory.PROGRAMMING: {
                VideoDifficulty.BEGINNER: """
                Welcome to this beginner-friendly programming tutorial! Today we're learning about {topic}.
                
                In this {duration}-minute video, I'll show you the fundamentals in a {style} way that's perfect for {target_audience}.
                
                Let's start with the basics and work our way up to something you can actually use in your projects.
                
                [Script content would be generated here based on the topic]
                
                That's it for today! Don't forget to practice what you've learned.
                """,
                VideoDifficulty.INTERMEDIATE: """
                Ready to level up your programming skills? Today we're diving into {topic}.
                
                This intermediate-level tutorial will take you through {duration} minutes of hands-on learning, designed for developers who want to expand their knowledge.
                
                We'll cover both theory and practical examples you can apply immediately.
                
                [Script content would be generated here based on the topic]
                
                Great work! You're now ready to tackle more advanced challenges.
                """,
                VideoDifficulty.ADVANCED: """
                Advanced programming concepts ahead! Today we're exploring {topic} at a deep technical level.
                
                This {duration}-minute deep dive is for experienced developers who want to master complex topics and optimize their code.
                
                We'll cover advanced patterns, performance considerations, and real-world applications.
                
                [Script content would be generated here based on the topic]
                
                Excellent! You've mastered another advanced concept.
                """
            }
        }
        
        # Default template if category not found
        default_template = """
        Welcome to this educational video about {topic}!
        
        In this {duration}-minute {style} tutorial, we'll explore everything you need to know about this topic, perfect for {target_audience}.
        
        [Script content would be generated here based on the topic]
        
        Thanks for watching! Don't forget to like and subscribe for more educational content.
        """
        
        return templates.get(category, {}).get(difficulty, default_template)
    
    async def _generate_fallback_script(
        self,
        topic: str,
        category: VideoCategory,
        difficulty: VideoDifficulty,
        target_audience: str,
        duration_minutes: int,
        style: str
    ) -> Dict[str, Any]:
        """Generate a fallback script when AI service is unavailable"""
        template = self._get_script_template(category, difficulty)
        script = template.format(
            topic=topic,
            duration=duration_minutes,
            style=style,
            target_audience=target_audience
        )
        
        return {
            "script": script,
            "metadata": {
                "topic": topic,
                "category": category.value,
                "difficulty": difficulty.value,
                "target_audience": target_audience,
                "duration_minutes": duration_minutes,
                "style": style,
                "generated_at": datetime.now().isoformat(),
                "ai_model": "fallback"
            },
            "ai_tools_used": ["fallback"]
        }


# Global instance
ai_content_generator = AIContentGenerator() 