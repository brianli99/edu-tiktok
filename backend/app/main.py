from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import auth, users, ai_content
from .database import engine, Base
from .models import *

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

# Mount static files for uploaded videos and data
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/data", StaticFiles(directory="../data"), name="data")

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