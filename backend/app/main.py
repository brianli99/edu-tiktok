from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from .routers import auth, users, ai_content
from .database import engine, Base
from .models import *
import os
import re
from pathlib import Path

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduTok AI Content API",
    description="AI-powered educational content platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads (non-video files)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Custom video streaming endpoint with range request support
@app.get("/data/{filename}")
async def stream_video(filename: str, request: Request):
    """
    Stream video files with HTTP range request support for iOS compatibility
    """
    data_dir = Path("../data")
    file_path = data_dir / filename
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    # Get file size
    file_size = file_path.stat().st_size
    
    # Parse range header
    range_header = request.headers.get('Range')
    
    if range_header:
        # Parse range header (e.g., "bytes=0-1023")
        range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if range_match:
            start = int(range_match.group(1))
            end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
            
            # Ensure end doesn't exceed file size
            end = min(end, file_size - 1)
            
            # Calculate content length
            content_length = end - start + 1
            
            def iter_file():
                with open(file_path, 'rb') as file:
                    file.seek(start)
                    remaining = content_length
                    while remaining > 0:
                        chunk_size = min(8192, remaining)
                        chunk = file.read(chunk_size)
                        if not chunk:
                            break
                        remaining -= len(chunk)
                        yield chunk
            
            headers = {
                'Content-Range': f'bytes {start}-{end}/{file_size}',
                'Accept-Ranges': 'bytes',
                'Content-Length': str(content_length),
                'Content-Type': 'video/mp4',
            }
            
            return StreamingResponse(
                iter_file(),
                status_code=206,
                headers=headers
            )
    
    # If no range header, serve the entire file
    def iter_entire_file():
        with open(file_path, 'rb') as file:
            while chunk := file.read(8192):
                yield chunk
    
    headers = {
        'Accept-Ranges': 'bytes',
        'Content-Length': str(file_size),
        'Content-Type': 'video/mp4',
    }
    
    return StreamingResponse(
        iter_entire_file(),
        headers=headers
    )

# Include only essential routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(ai_content.router, prefix="/videos", tags=["Videos"])


@app.get("/")
async def root():
    return {"message": "Welcome to EduTok AI Content API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"} 