"""
IdeaCheck API Server
Main FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.auth import router as auth_router
from api.users import router as users_router
from api.products import router as products_router
from api.public import router as public_router
from database.connection import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="IdeaCheck API",
    description="API server for IdeaCheck product validation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/users", tags=["User Management"])
app.include_router(products_router, prefix="/api/v1/products", tags=["Product Management"])
app.include_router(public_router, prefix="/api/v1/public", tags=["Public Access"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "IdeaCheck API Server", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)