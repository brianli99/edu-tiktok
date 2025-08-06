from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Creator(Base):
    __tablename__ = "creators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    username = Column(String(50), unique=True, index=True)
    avatar_url = Column(String(255))
    bio = Column(Text)
    followers_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    platform = Column(String(20))  # 'youtube', 'tiktok', 'both'
    platform_id = Column(String(100))  # External platform ID
    categories = Column(String(255))  # Comma-separated categories
    user_id = Column(Integer, ForeignKey("users.id"))  # Link to user
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    videos = relationship("Video", back_populates="creator")
    user = relationship("User", back_populates="creators") 