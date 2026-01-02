"""
Public access endpoints for product viewers
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Product, Feedback
from .schemas import ProductPublicResponse, FeedbackCreate, MessageResponse

router = APIRouter()


@router.get("/products/{checklink}", response_model=ProductPublicResponse)
async def get_product_by_checklink(
    checklink: str,
    db: Session = Depends(get_db)
):
    """Get product by checklink token"""
    
    product = db.query(Product).filter(
        Product.checklink == checklink,
        Product.status == "active"
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or not active"
        )
    
    return product


@router.post("/products/{product_id}/feedback", response_model=MessageResponse)
async def submit_feedback(
    product_id: str,
    feedback: FeedbackCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Submit product feedback"""
    
    # Check if product exists and is active
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.status == "active"
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or not active"
        )
    
    # Create feedback
    db_feedback = Feedback(
        product_id=product_id,
        email=feedback.email,
        rating=feedback.rating,
        comment=feedback.comment,
        referrer_url=feedback.referrer_url,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    db.add(db_feedback)
    db.commit()
    
    return {"message": "Feedback submitted successfully"}