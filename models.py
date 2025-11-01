from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import string
import secrets

db = SQLAlchemy()

class Product(db.Model):
    """Product model for storing product information."""
    
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    poster_filename = db.Column(db.String(255))  # Local storage filename
    poster_blob_url = db.Column(db.String(500))  # Azure Blob Storage URL
    checklink_token = db.Column(db.String(32), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with user responses
    user_responses = db.relationship('UserResponse', backref='product', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, name, description=None, poster_filename=None, poster_blob_url=None):
        self.name = name
        self.description = description
        self.poster_filename = poster_filename
        self.poster_blob_url = poster_blob_url
        self.checklink_token = self.generate_checklink_token()
    
    @staticmethod
    def generate_checklink_token():
        """Generate a unique token for the checklink URL."""
        # Generate a 32-character alphanumeric token
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(32))
    
    def get_checklink_url(self, base_url='http://localhost:5000'):
        """Get the full checklink URL for this product."""
        return f"{base_url}/check/{self.checklink_token}"
    
    def get_poster_url(self, base_url='http://localhost:5000'):
        """Get the poster image URL (Azure Blob or local)."""
        if self.poster_blob_url:
            return self.poster_blob_url
        elif self.poster_filename:
            return f"{base_url}/static/uploads/{self.poster_filename}"
        return None
    
    def get_response_count(self):
        """Get the number of user responses for this product."""
        return len(self.user_responses)
    
    def to_dict(self):
        """Convert product to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'poster_filename': self.poster_filename,
            'poster_blob_url': self.poster_blob_url,
            'checklink_token': self.checklink_token,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'response_count': self.get_response_count()
        }
    
    def __repr__(self):
        return f'<Product {self.name}>'

class UserResponse(db.Model):
    """User response model for storing collected user data."""
    
    __tablename__ = 'user_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Additional fields for future expansion
    user_agent = db.Column(db.String(500))  # Browser/device info
    ip_address = db.Column(db.String(45))   # User IP address
    referrer = db.Column(db.String(500))    # Referring page
    
    def __init__(self, product_id, email, user_agent=None, ip_address=None, referrer=None):
        self.product_id = product_id
        self.email = email
        self.user_agent = user_agent
        self.ip_address = ip_address
        self.referrer = referrer
    
    def to_dict(self):
        """Convert user response to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'email': self.email,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'user_agent': self.user_agent,
            'ip_address': self.ip_address,
            'referrer': self.referrer
        }
    
    def __repr__(self):
        return f'<UserResponse {self.email} for Product {self.product_id}>'

