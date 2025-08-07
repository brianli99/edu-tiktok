#!/usr/bin/env python3
"""
Test script for AI integration
Run this to verify OpenAI and ElevenLabs are working
"""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.ai_services import AIServiceManager
from app.services.ai_content_generator import AIContentGenerator
from app.models.video import VideoCategory, VideoDifficulty

async def test_ai_services():
    """Test AI services integration"""
    print("🤖 Testing AI Services Integration")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check API keys
    openai_key = os.getenv("OPENAI_API_KEY")
    elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
    
    print(f"OpenAI API Key: {'✅ Set' if openai_key else '❌ Missing'}")
    print(f"ElevenLabs API Key: {'✅ Set' if elevenlabs_key else '❌ Missing'}")
    print()
    
    # Initialize AI service manager
    ai_manager = AIServiceManager()
    
    # Test service status
    status = ai_manager.get_service_status()
    print("Service Status:")
    for service, is_available in status.items():
        status_icon = "✅" if is_available else "❌"
        print(f"  {service}: {status_icon}")
    print()
    
    # Test script generation
    print("📝 Testing Script Generation...")
    try:
        script_result = await ai_manager.generate_script_with_chatgpt(
            topic="Python Basics",
            category="ai-machine-learning",
            difficulty="beginner",
            target_audience="beginners",
            duration_minutes=3,
            style="engaging and educational"
        )
        
        print("✅ Script generated successfully!")
        print(f"Script length: {len(script_result['script'])} characters")
        print(f"AI tools used: {script_result.get('ai_tools_used', [])}")
        print()
        
        # Test voice generation
        print("🎤 Testing Voice Generation...")
        voice_result = await ai_manager.generate_voice_with_elevenlabs(
            script=script_result['script'][:200],  # Use first 200 chars for testing
            voice_settings={
                "voice": "Josh",  # Default voice
                "model": "eleven_monolingual_v1"
            }
        )
        
        print("✅ Voice generated successfully!")
        print(f"Audio duration: {voice_result.get('duration', 0)} seconds")
        print(f"Audio URL: {voice_result.get('audio_url', 'N/A')}")
        print()
        
        # Test complete video generation
        print("🎬 Testing Complete Video Generation...")
        video_result = await ai_manager.create_complete_video(
            topic="Python Basics",
            category="ai-machine-learning",
            difficulty="beginner",
            target_audience="beginners",
            duration_minutes=3,
            style="engaging and educational"
        )
        
        print("✅ Complete video generation successful!")
        print(f"Video URL: {video_result.get('video_url', 'N/A')}")
        print(f"Thumbnail URL: {video_result.get('thumbnail_url', 'N/A')}")
        print()
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        print("This might be due to missing API keys or network issues.")
    
    print("=" * 50)
    print("🎉 AI Integration Test Complete!")

if __name__ == "__main__":
    asyncio.run(test_ai_services())
