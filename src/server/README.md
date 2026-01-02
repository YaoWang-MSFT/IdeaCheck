# IdeaCheck API Server

## Overview

The IdeaCheck API Server is a FastAPI-based backend service that powers the IdeaCheck product validation platform. It provides RESTful API endpoints for product owners to manage their products and collect user feedback through unique checklinks.

### Key Features

- **User Authentication**: JWT-based authentication system for product owners
- **Product Management**: Full CRUD operations for product creation and management
- **Checklink Generation**: Automatic generation of unique tracking URLs for products
- **Feedback Collection**: Public endpoints for users to submit feedback on products
- **Database Integration**: SQLAlchemy ORM with SQLite (development) and Azure SQL (production) support
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation

### Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: SQLAlchemy 2.0.23 with SQLite/PostgreSQL/Azure SQL support
- **Authentication**: JWT tokens with python-jose and passlib
- **Validation**: Pydantic models for request/response validation
- **Server**: Uvicorn ASGI server

## Project Structure

```
src/server/
├── api/                    # API endpoints and business logic
│   ├── auth.py            # Authentication endpoints
│   ├── users.py           # User management endpoints
│   ├── products.py        # Product management endpoints
│   ├── public.py          # Public access endpoints
│   ├── schemas.py         # Pydantic request/response models
│   ├── auth_utils.py      # Authentication utilities
│   └── test/              # API test files
├── database/              # Database layer
│   ├── models.py          # SQLAlchemy database models
│   └── connection.py      # Database connection and session management
├── main.py               # FastAPI application entry point
└── requirements.txt      # Python dependencies
```

## API Endpoints

### Authentication & User Management
- `POST /api/v1/auth/register` - Register new product owner
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account
- `POST /api/v1/users/change-password` - Change user password

### Product Management (Authenticated)
- `GET /api/v1/products` - List user's products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products/{id}` - Get product details
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product
- `POST /api/v1/products/{id}/images` - Upload product images
- `GET /api/v1/products/{id}/feedback` - Get product feedback

### Public Access (No Authentication)
- `GET /api/v1/public/products/{checklink}` - Access product by checklink
- `POST /api/v1/public/products/{id}/feedback` - Submit feedback

### System
- `GET /` - Root endpoint with API info
- `GET /health` - Health check endpoint

## Local Development Setup

### Prerequisites

- Python 3.11+
- Virtual environment (recommended)

### Installation Steps

1. **Navigate to the server directory**:
   ```bash
   cd src/server
   ```

2. **Create and activate virtual environment** (if not already done):
   ```bash
   # From project root
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Accessing the API

- **API Server**: http://localhost:8000
- **Interactive API Documentation**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Running Tests

1. **Start the server** (in one terminal):
   ```bash
   cd src/server
   python main.py
   ```

2. **Run tests** (in another terminal):
   ```bash
   cd src/server/api/test
   python quick_test.py
   ```

## Database

The server uses SQLite by default for local development. The database file (`ideacheck.db`) will be created automatically in the server directory on first run.

### Database Models

- **User**: Product owner accounts with authentication
- **Product**: Product information with checklinks
- **Feedback**: User feedback submissions linked to products

## Environment Variables

The server supports the following environment variables:

- `DATABASE_URL`: Database connection string (default: SQLite)
- `SECRET_KEY`: JWT secret key for token signing
- `FLASK_ENV`: Environment mode (development/production)

## Production Deployment

For production deployment, configure:

1. **Database**: Update `DATABASE_URL` to point to Azure SQL or PostgreSQL
2. **Security**: Set a strong `SECRET_KEY` environment variable
3. **CORS**: Configure allowed origins in `main.py`
4. **HTTPS**: Use a reverse proxy (nginx) with SSL certificates

## Development Notes

- The server uses FastAPI's automatic OpenAPI documentation
- JWT tokens expire in 30 minutes by default
- Database tables are created automatically on startup
- CORS is enabled for all origins in development mode
- File uploads are prepared but require implementation of storage logic