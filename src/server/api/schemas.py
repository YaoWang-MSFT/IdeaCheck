"""
Pydantic schemas for request/response models
"""

from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password cannot be longer than 72 bytes')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    checklink: str
    status: str
    image_url: Optional[str] = None
    owner_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductPublicResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True


# Feedback schemas
class FeedbackBase(BaseModel):
    email: Optional[EmailStr] = None
    rating: Optional[int] = None
    comment: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    referrer_url: Optional[str] = None


class FeedbackResponse(FeedbackBase):
    id: str
    product_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Generic response schemas
class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str