"""
Product management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User, Product, Feedback
from .schemas import (
    ProductCreate, 
    ProductUpdate, 
    ProductResponse, 
    FeedbackResponse,
    MessageResponse
)
from .auth_utils import get_current_user

router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all products for authenticated owner"""
    products = db.query(Product).filter(Product.owner_id == current_user.id).all()
    return products


@router.post("/", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new product"""
    
    # Create new product
    db_product = Product(
        name=product.name,
        description=product.description,
        category=product.category,
        owner_id=current_user.id
    )
    
    # Generate unique checklink
    db_product.checklink = db_product.generate_checklink()
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific product details"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.owner_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing product"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.owner_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update product fields
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}", response_model=MessageResponse)
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete product"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.owner_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}


@router.post("/{product_id}/images", response_model=MessageResponse)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload product image"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.owner_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # TODO: Implement actual file upload logic
    # For now, just return success message
    return {"message": "Image upload functionality to be implemented"}


@router.get("/{product_id}/feedback", response_model=List[FeedbackResponse])
async def get_product_feedback(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all feedback for product"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.owner_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    feedbacks = db.query(Feedback).filter(Feedback.product_id == product_id).all()
    return feedbacks