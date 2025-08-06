from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..services.ai_content_generator import ai_content_generator
from ..services.video_upload import video_upload_service
from ..models.video import Video, VideoCategory, VideoDifficulty, ContentSource, GenerationStatus
from ..schemas.video import VideoResponse, VideoList
from ..auth import get_current_user
from ..models.user import User

router = APIRouter(tags=["Videos"])


@router.get("/", response_model=VideoList)
async def get_videos(
    skip: int = 0,
    limit: int = 20,
    category: VideoCategory = None,
    difficulty: VideoDifficulty = None,
    db: Session = Depends(get_db)
):
    """
    Get all videos with optional filtering
    """
    from sqlalchemy import and_
    
    query = db.query(Video)
    
    if category:
        query = query.filter(Video.category == category)
    
    if difficulty:
        query = query.filter(Video.difficulty == difficulty)
    
    # Prioritize AI-generated content
    query = query.order_by(Video.content_source.desc(), Video.created_at.desc())
    
    total = query.count()
    videos = query.offset(skip).limit(limit).all()
    
    # Convert to response format manually to handle missing user data
    video_responses = []
    for video in videos:
        # Create a safe creator info
        creator_info = {
            "id": video.creator.id,
            "name": video.creator.name,
            "username": video.creator.username or video.creator.name,
            "avatar_url": video.creator.avatar_url,
            "verified": video.creator.verified
        }
        
        # Create video response manually
        video_response = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "views": video.views,
            "likes": video.likes,
            "category": video.category,
            "difficulty": video.difficulty,
            "tags": video.tags,
            "source": video.source,
            "source_id": video.source_id,
            "is_educational": video.is_educational,
            "is_verified": video.is_verified,
            "content_source": video.content_source,
            "generation_status": video.generation_status,
            "ai_prompt": video.ai_prompt,
            "ai_tools_used": video.ai_tools_used,
            "generation_metadata": video.generation_metadata,
            "script_content": video.script_content,
            "voice_settings": video.voice_settings,
            "visual_style": video.visual_style,
            "target_audience": video.target_audience,
            "creator": creator_info,
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        video_responses.append(video_response)
    
    return VideoList(
        videos=video_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        has_next=skip + limit < total,
        has_prev=skip > 0
    )


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific video by ID
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Create a safe creator info
    creator_info = {
        "id": video.creator.id,
        "name": video.creator.name,
        "username": video.creator.username or video.creator.name,
        "avatar_url": video.creator.avatar_url,
        "verified": video.creator.verified
    }
    
    # Create video response manually
    video_response = {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "video_url": video.video_url,
        "thumbnail_url": video.thumbnail_url,
        "duration": video.duration,
        "views": video.views,
        "likes": video.likes,
        "category": video.category,
        "difficulty": video.difficulty,
        "tags": video.tags,
        "source": video.source,
        "source_id": video.source_id,
        "is_educational": video.is_educational,
        "is_verified": video.is_verified,
        "content_source": video.content_source,
        "generation_status": video.generation_status,
        "ai_prompt": video.ai_prompt,
        "ai_tools_used": video.ai_tools_used,
        "generation_metadata": video.generation_metadata,
        "script_content": video.script_content,
        "voice_settings": video.voice_settings,
        "visual_style": video.visual_style,
        "target_audience": video.target_audience,
        "creator": creator_info,
        "created_at": video.created_at,
        "updated_at": video.updated_at
    }
    
    return video_response


@router.get("/category/{category}")
async def get_videos_by_category(
    category: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get videos by category
    """
    try:
        video_category = VideoCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    query = db.query(Video).filter(Video.category == video_category)
    total = query.count()
    videos = query.offset(skip).limit(limit).all()
    
    # Convert to response format manually to handle missing user data
    video_responses = []
    for video in videos:
        # Create a safe creator info
        creator_info = {
            "id": video.creator.id,
            "name": video.creator.name,
            "username": video.creator.username or video.creator.name,
            "avatar_url": video.creator.avatar_url,
            "verified": video.creator.verified
        }
        
        # Create video response manually
        video_response = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "views": video.views,
            "likes": video.likes,
            "category": video.category,
            "difficulty": video.difficulty,
            "tags": video.tags,
            "source": video.source,
            "source_id": video.source_id,
            "is_educational": video.is_educational,
            "is_verified": video.is_verified,
            "content_source": video.content_source,
            "generation_status": video.generation_status,
            "ai_prompt": video.ai_prompt,
            "ai_tools_used": video.ai_tools_used,
            "generation_metadata": video.generation_metadata,
            "script_content": video.script_content,
            "voice_settings": video.voice_settings,
            "visual_style": video.visual_style,
            "target_audience": video.target_audience,
            "creator": creator_info,
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        video_responses.append(video_response)
    
    return VideoList(
        videos=video_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        has_next=skip + limit < total,
        has_prev=skip > 0
    )


@router.get("/search/")
async def search_videos(
    q: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search videos by title or description
    """
    from sqlalchemy import or_
    
    query = db.query(Video).filter(
        or_(
            Video.title.ilike(f"%{q}%"),
            Video.description.ilike(f"%{q}%")
        )
    )
    
    total = query.count()
    videos = query.offset(skip).limit(limit).all()
    
    # Convert to response format manually to handle missing user data
    video_responses = []
    for video in videos:
        # Create a safe creator info
        creator_info = {
            "id": video.creator.id,
            "name": video.creator.name,
            "username": video.creator.username or video.creator.name,
            "avatar_url": video.creator.avatar_url,
            "verified": video.creator.verified
        }
        
        # Create video response manually
        video_response = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "views": video.views,
            "likes": video.likes,
            "category": video.category,
            "difficulty": video.difficulty,
            "tags": video.tags,
            "source": video.source,
            "source_id": video.source_id,
            "is_educational": video.is_educational,
            "is_verified": video.is_verified,
            "content_source": video.content_source,
            "generation_status": video.generation_status,
            "ai_prompt": video.ai_prompt,
            "ai_tools_used": video.ai_tools_used,
            "generation_metadata": video.generation_metadata,
            "script_content": video.script_content,
            "voice_settings": video.voice_settings,
            "visual_style": video.visual_style,
            "target_audience": video.target_audience,
            "creator": creator_info,
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        video_responses.append(video_response)
    
    return VideoList(
        videos=video_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        has_next=skip + limit < total,
        has_prev=skip > 0
    )


# AI Content Generation Endpoints
@router.post("/ai/generate-script")
async def generate_video_script(
    topic: str,
    category: VideoCategory,
    difficulty: VideoDifficulty,
    target_audience: str = "beginners",
    duration_minutes: int = 3,
    style: str = "engaging and educational",
    current_user: User = Depends(get_current_user)
):
    """
    Generate a video script using AI
    """
    try:
        script_result = await ai_content_generator.generate_video_script(
            topic=topic,
            category=category,
            difficulty=difficulty,
            target_audience=target_audience,
            duration_minutes=duration_minutes,
            style=style
        )
        
        return {
            "success": True,
            "script": script_result["script"],
            "metadata": script_result["metadata"],
            "ai_tools_used": script_result["ai_tools_used"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating script: {str(e)}")


@router.post("/ai/create-video")
async def create_video_from_script(
    script: str,
    title: str,
    category: VideoCategory,
    difficulty: VideoDifficulty,
    voice_settings: Dict[str, Any] = None,
    visual_style: str = "modern and clean",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a video from generated script
    """
    try:
        # Get or create creator for the current user
        from ..models.creator import Creator
        creator = db.query(Creator).filter(Creator.user_id == current_user.id).first()
        
        if not creator:
            # Create a creator for the user
            creator = Creator(
                name=current_user.username or "AI Content Creator",
                username=current_user.username or f"ai_creator_{current_user.id}",
                bio="AI-powered educational content creator",
                avatar_url="https://example.com/ai-creator-avatar.jpg",
                user_id=current_user.id,
                verified=True
            )
            db.add(creator)
            db.commit()
            db.refresh(creator)
        
        video = await ai_content_generator.create_video_from_script(
            script=script,
            title=title,
            category=category,
            difficulty=difficulty,
            creator_id=creator.id,
            voice_settings=voice_settings,
            visual_style=visual_style
        )
        
        # Create a safe creator info
        creator_info = {
            "id": video.creator.id,
            "name": video.creator.name,
            "username": video.creator.username or video.creator.name,
            "avatar_url": video.creator.avatar_url,
            "verified": video.creator.verified
        }
        
        # Create video response manually
        video_response = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "views": video.views,
            "likes": video.likes,
            "category": video.category,
            "difficulty": video.difficulty,
            "tags": video.tags,
            "source": video.source,
            "source_id": video.source_id,
            "is_educational": video.is_educational,
            "is_verified": video.is_verified,
            "content_source": video.content_source,
            "generation_status": video.generation_status,
            "ai_prompt": video.ai_prompt,
            "ai_tools_used": video.ai_tools_used,
            "generation_metadata": video.generation_metadata,
            "script_content": video.script_content,
            "voice_settings": video.voice_settings,
            "visual_style": video.visual_style,
            "target_audience": video.target_audience,
            "creator": creator_info,
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        
        return video_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating video: {str(e)}")


@router.post("/ai/generate-batch")
async def generate_content_batch(
    topics: List[str],
    category: VideoCategory,
    difficulty: VideoDifficulty,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate multiple videos in a batch (runs in background)
    """
    try:
        # Get or create creator for the current user
        from ..models.creator import Creator
        creator = db.query(Creator).filter(Creator.user_id == current_user.id).first()
        
        if not creator:
            creator = Creator(
                name=current_user.username or "AI Content Creator",
                username=current_user.username or f"ai_creator_{current_user.id}",
                bio="AI-powered educational content creator",
                avatar_url="https://example.com/ai-creator-avatar.jpg",
                user_id=current_user.id,
                verified=True
            )
            db.add(creator)
            db.commit()
            db.refresh(creator)
        
        # Add batch generation to background tasks
        background_tasks.add_task(
            ai_content_generator.generate_content_batch,
            topics=topics,
            category=category,
            difficulty=difficulty,
            creator_id=creator.id
        )
        
        return {
            "success": True,
            "message": f"Started generating {len(topics)} videos in background",
            "topics": topics,
            "category": category.value,
            "difficulty": difficulty.value
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting batch generation: {str(e)}")


@router.get("/ai/generation-status/{video_id}")
async def get_generation_status(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the generation status of a video
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {
        "video_id": video.id,
        "title": video.title,
        "generation_status": video.generation_status,
        "content_source": video.content_source,
        "ai_tools_used": video.ai_tools_used,
        "created_at": video.created_at
    }


@router.get("/ai/generated")
async def get_ai_generated_videos(
    skip: int = 0,
    limit: int = 20,
    category: VideoCategory = None,
    difficulty: VideoDifficulty = None,
    db: Session = Depends(get_db)
):
    """
    Get all AI-generated videos with optional filtering
    """
    query = db.query(Video).filter(Video.content_source == ContentSource.AI_GENERATED)
    
    if category:
        query = query.filter(Video.category == category)
    
    if difficulty:
        query = query.filter(Video.difficulty == difficulty)
    
    videos = query.offset(skip).limit(limit).all()
    
    # Convert to response format manually to handle missing user data
    video_responses = []
    for video in videos:
        # Create a safe creator info
        creator_info = {
            "id": video.creator.id,
            "name": video.creator.name,
            "username": video.creator.username or video.creator.name,
            "avatar_url": video.creator.avatar_url,
            "verified": video.creator.verified
        }
        
        # Create video response manually
        video_response = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "views": video.views,
            "likes": video.likes,
            "category": video.category,
            "difficulty": video.difficulty,
            "tags": video.tags,
            "source": video.source,
            "source_id": video.source_id,
            "is_educational": video.is_educational,
            "is_verified": video.is_verified,
            "content_source": video.content_source,
            "generation_status": video.generation_status,
            "ai_prompt": video.ai_prompt,
            "ai_tools_used": video.ai_tools_used,
            "generation_metadata": video.generation_metadata,
            "script_content": video.script_content,
            "voice_settings": video.voice_settings,
            "visual_style": video.visual_style,
            "target_audience": video.target_audience,
            "creator": creator_info,
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        video_responses.append(video_response)
    
    return video_responses


@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(...),
    category: VideoCategory = Form(...),
    difficulty: VideoDifficulty = Form(...),
    tags: str = Form(None),
    is_educational: bool = Form(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a video file
    """
    try:
        # Get or create creator for the current user
        from ..models.creator import Creator
        creator = db.query(Creator).filter(Creator.user_id == current_user.id).first()
        
        if not creator:
            creator = Creator(
                name=current_user.username or "Video Creator",
                username=current_user.username or f"creator_{current_user.id}",
                bio="Educational content creator",
                avatar_url="https://example.com/creator-avatar.jpg",
                user_id=current_user.id,
                verified=True
            )
            db.add(creator)
            db.commit()
            db.refresh(creator)
        
        # Upload video
        video = await video_upload_service.upload_video(
            file=file,
            title=title,
            description=description,
            category=category,
            difficulty=difficulty,
            creator_id=creator.id,
            tags=tags,
            is_educational=is_educational
        )
        
        return VideoResponse.from_orm(video)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading video: {str(e)}")


@router.get("/upload/stats")
async def get_upload_stats():
    """
    Get upload directory statistics
    """
    return video_upload_service.get_upload_stats()


@router.get("/ai/service-status")
async def get_ai_service_status():
    """
    Get status of all AI services
    """
    return {
        "chatgpt": False,
        "elevenlabs": False,
        "video_generation": "Manual upload required (AI services temporarily disabled)"
    }


@router.get("/ai/stats")
async def get_generation_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics about AI content generation
    """
    from sqlalchemy import func
    
    # Get creator for current user
    from ..models.creator import Creator
    creator = db.query(Creator).filter(Creator.user_id == current_user.id).first()
    
    if not creator:
        return {
            "total_videos": 0,
            "ai_generated": 0,
            "pending_generation": 0,
            "failed_generation": 0,
            "by_category": {},
            "by_difficulty": {}
        }
    
    # Get stats for this creator
    total_videos = db.query(Video).filter(Video.creator_id == creator.id).count()
    ai_generated = db.query(Video).filter(
        Video.creator_id == creator.id,
        Video.content_source == ContentSource.AI_GENERATED
    ).count()
    
    pending_generation = db.query(Video).filter(
        Video.creator_id == creator.id,
        Video.generation_status == GenerationStatus.PENDING
    ).count()
    
    failed_generation = db.query(Video).filter(
        Video.creator_id == creator.id,
        Video.generation_status == GenerationStatus.FAILED
    ).count()
    
    # Stats by category
    category_stats = db.query(
        Video.category,
        func.count(Video.id)
    ).filter(
        Video.creator_id == creator.id,
        Video.content_source == ContentSource.AI_GENERATED
    ).group_by(Video.category).all()
    
    # Stats by difficulty
    difficulty_stats = db.query(
        Video.difficulty,
        func.count(Video.id)
    ).filter(
        Video.creator_id == creator.id,
        Video.content_source == ContentSource.AI_GENERATED
    ).group_by(Video.difficulty).all()
    
    return {
        "total_videos": total_videos,
        "ai_generated": ai_generated,
        "pending_generation": pending_generation,
        "failed_generation": failed_generation,
        "by_category": {cat.value: count for cat, count in category_stats},
        "by_difficulty": {diff.value: count for diff, count in difficulty_stats}
    } 