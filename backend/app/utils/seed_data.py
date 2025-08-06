from sqlalchemy.orm import Session
from ..models.creator import Creator
from ..models.video import Video, VideoCategory, VideoDifficulty
from ..models.user import User
from ..auth import get_password_hash


def seed_creators(db: Session):
    """Seed the database with educational content creators"""
    creators_data = [
        {
            "name": "DataCamp",
            "username": "datacamp",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "bio": "Learn data science and analytics with interactive courses",
            "followers_count": 2500000,
            "verified": True,
            "platform": "youtube",
            "platform_id": "UC79s7EdN9uXX77-Ly2HmEjQ",
            "categories": "data-science,data-engineering,ai"
        },
        {
            "name": "StatQuest",
            "username": "statquest",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            "bio": "Clear, step-by-step explanations of machine learning and statistics",
            "followers_count": 1800000,
            "verified": True,
            "platform": "youtube",
            "platform_id": "UCtYLUTtgS3k1Fg4y5tAhLbw",
            "categories": "ai,data-science,statistics"
        },
        {
            "name": "3Blue1Brown",
            "username": "3blue1brown",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            "bio": "Mathematics and science education through beautiful animations",
            "followers_count": 4500000,
            "verified": True,
            "platform": "youtube",
            "platform_id": "UCYO_jab_esuFRV4b17AJtAw",
            "categories": "ai,mathematics,data-science"
        },
        {
            "name": "Tech With Tim",
            "username": "techwithtim",
            "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            "bio": "Programming tutorials and tech education",
            "followers_count": 1200000,
            "verified": True,
            "platform": "youtube",
            "platform_id": "UC4JX40jZq3qKJvQhZbNs8xw",
            "categories": "technology,programming,ai"
        },
        {
            "name": "Corey Schafer",
            "username": "coreyschafer",
            "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
            "bio": "Python programming tutorials and software development",
            "followers_count": 800000,
            "verified": True,
            "platform": "youtube",
            "platform_id": "UCsT0YIqwnpJCM-mx7-gSA4Q",
            "categories": "technology,programming,data-science"
        }
    ]
    
    for creator_data in creators_data:
        existing_creator = db.query(Creator).filter(Creator.username == creator_data["username"]).first()
        if not existing_creator:
            creator = Creator(**creator_data)
            db.add(creator)
    
    db.commit()
    return db.query(Creator).all()


def seed_videos(db: Session, creators: list):
    """Seed the database with educational videos"""
    videos_data = [
        {
            "title": "Introduction to Data Engineering",
            "description": "Learn the fundamentals of data engineering, ETL pipelines, and data architecture. Perfect for beginners!",
            "video_url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
            "duration": 180,
            "views": 15420,
            "likes": 1247,
            "category": VideoCategory.DATA_ENGINEERING,
            "difficulty": VideoDifficulty.BEGINNER,
            "tags": "data-engineering,etl,pipeline,beginner",
            "source": "youtube",
            "source_id": "sample_video_1",
            "is_educational": True,
            "is_verified": True,
            "creator_id": creators[0].id  # DataCamp
        },
        {
            "title": "Machine Learning Basics",
            "description": "Understanding the core concepts of machine learning algorithms and neural networks.",
            "video_url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
            "duration": 240,
            "views": 25340,
            "likes": 2156,
            "category": VideoCategory.AI,
            "difficulty": VideoDifficulty.INTERMEDIATE,
            "tags": "machine-learning,ai,algorithms,neural-networks",
            "source": "youtube",
            "source_id": "sample_video_2",
            "is_educational": True,
            "is_verified": True,
            "creator_id": creators[1].id  # StatQuest
        },
        {
            "title": "Python for Data Science",
            "description": "Master Python programming for data analysis, visualization, and statistical modeling.",
            "video_url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=600&fit=crop",
            "duration": 300,
            "views": 18750,
            "likes": 1689,
            "category": VideoCategory.DATA_SCIENCE,
            "difficulty": VideoDifficulty.BEGINNER,
            "tags": "python,data-science,pandas,numpy",
            "source": "youtube",
            "source_id": "sample_video_3",
            "is_educational": True,
            "is_verified": True,
            "creator_id": creators[4].id  # Corey Schafer
        },
        {
            "title": "SQL Fundamentals",
            "description": "Learn SQL from scratch - queries, joins, and database management for data professionals.",
            "video_url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=600&fit=crop",
            "duration": 210,
            "views": 22100,
            "likes": 1923,
            "category": VideoCategory.DATA_ENGINEERING,
            "difficulty": VideoDifficulty.BEGINNER,
            "tags": "sql,database,queries,joins",
            "source": "youtube",
            "source_id": "sample_video_4",
            "is_educational": True,
            "is_verified": True,
            "creator_id": creators[0].id  # DataCamp
        },
        {
            "title": "Deep Learning with TensorFlow",
            "description": "Build neural networks and deep learning models using TensorFlow framework.",
            "video_url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=600&fit=crop",
            "duration": 360,
            "views": 32450,
            "likes": 2876,
            "category": VideoCategory.AI,
            "difficulty": VideoDifficulty.ADVANCED,
            "tags": "deep-learning,tensorflow,neural-networks,ai",
            "source": "youtube",
            "source_id": "sample_video_5",
            "is_educational": True,
            "is_verified": True,
            "creator_id": creators[2].id  # 3Blue1Brown
        }
    ]
    
    for video_data in videos_data:
        existing_video = db.query(Video).filter(Video.source_id == video_data["source_id"]).first()
        if not existing_video:
            video = Video(**video_data)
            db.add(video)
    
    db.commit()


def seed_users(db: Session):
    """Seed the database with test users"""
    users_data = [
        {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User",
            "bio": "Learning data science and AI"
        },
        {
            "username": "learner",
            "email": "learner@example.com",
            "password": "password123",
            "full_name": "Active Learner",
            "bio": "Passionate about educational content"
        }
    ]
    
    for user_data in users_data:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            hashed_password = get_password_hash(user_data["password"])
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=hashed_password,
                full_name=user_data["full_name"],
                bio=user_data["bio"]
            )
            db.add(user)
    
    db.commit()


def seed_database(db: Session):
    """Seed the entire database with initial data"""
    print("Seeding creators...")
    creators = seed_creators(db)
    
    print("Seeding videos...")
    seed_videos(db, creators)
    
    print("Seeding users...")
    seed_users(db)
    
    print("Database seeding completed!") 