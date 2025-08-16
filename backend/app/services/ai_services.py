import os
import json
import logging
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any
from datetime import datetime

# Optional imports for AI services
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    from elevenlabs import generate, save, set_api_key
    from elevenlabs.api import History
    ELEVENLABS_AVAILABLE = True
except ImportError:
    ELEVENLABS_AVAILABLE = False

logger = logging.getLogger(__name__)

class AIServiceManager:
    def __init__(self):
        self.openai_client = None
        self.elevenlabs_api_key = None
        self._initialize_services()
    
    def _initialize_services(self):
        """Initialize AI service clients"""
        # OpenAI/ChatGPT
        if OPENAI_AVAILABLE:
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key:
                openai.api_key = openai_api_key
                self.openai_client = openai
                logger.info("✅ OpenAI/ChatGPT service initialized")
            else:
                logger.warning("⚠️ OpenAI API key not found. ChatGPT features will be disabled.")
        else:
            logger.warning("⚠️ OpenAI package not available. ChatGPT features will be disabled.")
        
        # ElevenLabs
        if ELEVENLABS_AVAILABLE:
            self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
            if self.elevenlabs_api_key:
                set_api_key(self.elevenlabs_api_key)
                logger.info("✅ ElevenLabs service initialized")
            else:
                logger.warning("⚠️ ElevenLabs API key not found. Voice synthesis will be disabled.")
        else:
            logger.warning("⚠️ ElevenLabs package not available. Voice synthesis will be disabled.")
        
        # Note: Runway ML removed due to 10-second video limit
        # For longer videos, consider alternatives like:
        # - Synthesia
        # - Lumen5
        # - InVideo
        # - Manual video creation
    
    async def generate_script_with_chatgpt(
        self,
        topic: str,
        category: str,
        difficulty: str,
        target_audience: str = "beginners",
        duration_minutes: int = 3,
        style: str = "engaging and educational"
    ) -> Dict[str, Any]:
        """Generate video script using ChatGPT"""
        if not self.openai_client:
            return self._generate_placeholder_script(topic, category, difficulty, target_audience, duration_minutes, style)
        
        try:
            prompt = f"""
            Create an educational video script about "{topic}" for {target_audience}.
            
            Requirements:
            - Category: {category}
            - Difficulty: {difficulty}
            - Duration: {duration_minutes} minutes
            - Style: {style}
            
            The script should be engaging, educational, and suitable for {duration_minutes}-minute video format.
            Include clear explanations, examples, and a logical flow.
            
            Format the script with:
            1. Introduction (30 seconds)
            2. Main content (2-2.5 minutes)
            3. Summary and call-to-action (30 seconds)
            """
            
            response = await asyncio.to_thread(
                self.openai_client.ChatCompletion.create,
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert educational content creator specializing in creating engaging video scripts."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            script = response.choices[0].message.content.strip()
            
            return {
                "script": script,
                "metadata": {
                    "topic": topic,
                    "category": category,
                    "difficulty": difficulty,
                    "target_audience": target_audience,
                    "duration_minutes": duration_minutes,
                    "style": style,
                    "generated_at": datetime.now().isoformat(),
                    "ai_model": "gpt-4",
                    "word_count": len(script.split())
                },
                "ai_tools_used": ["chatgpt"]
            }
            
        except Exception as e:
            logger.error(f"Error generating script with ChatGPT: {e}")
            return self._generate_placeholder_script(topic, category, difficulty, target_audience, duration_minutes, style)
    
    async def generate_voice_with_elevenlabs(
        self,
        script: str,
        voice_settings: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate voice audio using ElevenLabs"""
        if not ELEVENLABS_AVAILABLE or not self.elevenlabs_api_key:
            return self._generate_placeholder_audio(script)
        
        try:
            # Default voice settings
            default_settings = {
                "voice": "Josh",  # Default voice
                "model": "eleven_monolingual_v1",
                "stability": 0.5,
                "similarity_boost": 0.75
            }
            
            if voice_settings:
                default_settings.update(voice_settings)
            
            # Generate audio
            audio = await asyncio.to_thread(
                generate,
                text=script,
                voice=default_settings["voice"],
                model=default_settings["model"]
            )
            
            # Save audio file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"audio_{timestamp}.mp3"
            filepath = f"temp/{filename}"
            
            os.makedirs("temp", exist_ok=True)
            await asyncio.to_thread(save, audio, filepath)
            
            return {
                "audio_file": filepath,
                "duration_seconds": len(audio) / 22050,  # Approximate duration
                "voice_settings": default_settings,
                "metadata": {
                    "generated_at": datetime.now().isoformat(),
                    "script_length": len(script),
                    "ai_model": "eleven_monolingual_v1"
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating voice with ElevenLabs: {e}")
            return self._generate_placeholder_audio(script)
    
    async def generate_video_placeholder(
        self,
        script: str,
        visual_style: str = "modern and clean",
        duration_seconds: int = 180
    ) -> Dict[str, Any]:
        """Generate placeholder video (for manual video creation)"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_filename = f"placeholder_video_{timestamp}.mp4"
        thumbnail_filename = f"placeholder_thumbnail_{timestamp}.jpg"
        
        return {
            "video_file": f"temp/{video_filename}",
            "thumbnail_file": f"temp/{thumbnail_filename}",
            "duration_seconds": duration_seconds,
            "visual_style": visual_style,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "script_length": len(script),
                "ai_model": "placeholder",
                "resolution": "1920x1080",
                "fps": 30,
                "note": "Manual video creation required - upload your video using the upload endpoint"
            }
        }
    
    async def create_complete_video(
        self,
        topic: str,
        category: str,
        difficulty: str,
        target_audience: str = "beginners",
        duration_minutes: int = 3,
        style: str = "engaging and educational",
        voice_settings: Optional[Dict[str, Any]] = None,
        visual_style: str = "modern and clean"
    ) -> Dict[str, Any]:
        """Create a complete video using all AI services"""
        
        # Step 1: Generate script
        logger.info(f"🎬 Generating script for topic: {topic}")
        script_result = await self.generate_script_with_chatgpt(
            topic=topic,
            category=category,
            difficulty=difficulty,
            target_audience=target_audience,
            duration_minutes=duration_minutes,
            style=style
        )
        
        # Step 2: Generate voice audio
        logger.info("🎤 Generating voice audio...")
        audio_result = await self.generate_voice_with_elevenlabs(
            script=script_result["script"],
            voice_settings=voice_settings
        )
        
        # Step 3: Generate video placeholder (manual creation required)
        logger.info("🎥 Creating video placeholder...")
        video_result = await self.generate_video_placeholder(
            script=script_result["script"],
            visual_style=visual_style,
            duration_seconds=audio_result["duration_seconds"]
        )
        
        # Combine results
        return {
            "script": script_result,
            "audio": audio_result,
            "video": video_result,
            "metadata": {
                "topic": topic,
                "category": category,
                "difficulty": difficulty,
                "target_audience": target_audience,
                "duration_minutes": duration_minutes,
                "style": style,
                "visual_style": visual_style,
                "created_at": datetime.now().isoformat(),
                "ai_tools_used": script_result.get("ai_tools_used", []) + ["elevenlabs", "placeholder"]
            }
        }
    
    def _generate_placeholder_script(
        self,
        topic: str,
        category: str,
        difficulty: str,
        target_audience: str,
        duration_minutes: int,
        style: str
    ) -> Dict[str, Any]:
        """Generate placeholder script when AI service is not available"""
        script = f"""
        Welcome to this {difficulty}-friendly {category} tutorial! Today we're learning about {topic}.
        
        In this {duration_minutes}-minute video, I'll show you the fundamentals in a {style} way that's perfect for {target_audience}.
        
        Let's start with the basics and work our way up to something you can actually use in your projects.
        
        [Script content would be generated here based on the topic]
        
        That's it for today! Don't forget to practice what you've learned.
        """
        
        return {
            "script": script,
            "metadata": {
                "topic": topic,
                "category": category,
                "difficulty": difficulty,
                "target_audience": target_audience,
                "duration_minutes": duration_minutes,
                "style": style,
                "generated_at": datetime.now().isoformat(),
                "ai_model": "placeholder"
            },
            "ai_tools_used": ["placeholder"]
        }
    
    def _generate_placeholder_audio(self, script: str) -> Dict[str, Any]:
        """Generate placeholder audio when ElevenLabs is not available"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"placeholder_audio_{timestamp}.mp3"
        
        return {
            "audio_file": f"temp/{filename}",
            "duration_seconds": 180,  # 3 minutes
            "voice_settings": {"voice": "placeholder", "model": "placeholder"},
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "script_length": len(script),
                "ai_model": "placeholder"
            }
        }
    
    def _generate_placeholder_video(
        self,
        script: str,
        visual_style: str,
        duration_seconds: int
    ) -> Dict[str, Any]:
        """Generate placeholder video when Runway ML is not available"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_filename = f"placeholder_video_{timestamp}.mp4"
        thumbnail_filename = f"placeholder_thumbnail_{timestamp}.jpg"
        
        return {
            "video_file": f"temp/{video_filename}",
            "thumbnail_file": f"temp/{thumbnail_filename}",
            "duration_seconds": duration_seconds,
            "visual_style": visual_style,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "script_length": len(script),
                "ai_model": "placeholder",
                "resolution": "1920x1080",
                "fps": 30
            }
        }
    
    def get_service_status(self) -> Dict[str, bool]:
        """Get status of all AI services"""
        return {
            "chatgpt": OPENAI_AVAILABLE and self.openai_client is not None,
            "elevenlabs": ELEVENLABS_AVAILABLE and self.elevenlabs_api_key is not None,
            "video_generation": "Manual upload required (Runway ML removed due to 10s limit)"
        }

# Global instance
ai_service_manager = AIServiceManager() 