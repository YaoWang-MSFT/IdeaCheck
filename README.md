# IdeaCheck

IdeaCheck is a lightweight product validation platform that helps entrepreneurs and product managers quickly validate product ideas by collecting user feedback through unique trackable links.

## Overview

IdeaCheck provides a simple yet powerful solution for product validation:

- **Product Owners** can create and manage product concepts, generate unique checklinks for distribution, and collect valuable user feedback
- **Users** can easily view products and provide feedback through simple, accessible interfaces
- **Analytics** help product owners understand user engagement and make data-driven decisions

### Key Features

- **Secure Authentication**: JWT-based authentication system for product owners
- **Product Management**: Create, update, and manage product concepts with descriptions and images
- **Checklink Generation**: Automatic generation of unique, trackable URLs for each product
- **Feedback Collection**: Public interfaces for users to submit ratings, comments, and feedback
- **Multi-Platform Support**: API-first architecture supporting web, mobile, and future integrations
- **Scalable Architecture**: Modular design supporting local development and cloud deployment

## Project Structure

```
IdeaCheck/
├── src/
│   ├── server/              # FastAPI Backend Server
│   │   ├── api/             # REST API endpoints and business logic
│   │   ├── database/        # Database models and connection management
│   │   └── README.md        # Server-specific documentation
│   └── client/              # Client Applications
│       ├── web/             # React Web Application (future)
│       └── mobile/          # React Native Mobile App (future)
├── requirements.txt         # Project overview (see server/requirements.txt for actual deps)
└── README.md               # This file
```

### Technology Stack

**Backend (Server):**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM with SQLite/PostgreSQL support
- **JWT Authentication** - Secure token-based authentication
- **Pydantic** - Data validation and serialization

**Frontend (Planned):**
- **React** - Web application framework
- **React Native** - Mobile application framework

**Database:**
- **SQLite** (development) / **Azure SQL** (production)

## Getting Started

### Prerequisites
- Python 3.11+
- Virtual environment support

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd IdeaCheck
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   ```

2. **Start the API server**:
   ```bash
   cd src/server
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access the application**:
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Development

Each component has its own documentation:
- **Server API**: See `src/server/README.md` for detailed backend setup and API documentation
- **Web Client**: See `src/client/web/README.md` (coming soon)
- **Mobile Client**: See `src/client/mobile/README.md` (coming soon)

## Deployment

The application is designed for flexible deployment:
- **Development**: Local SQLite database with FastAPI dev server
- **Production**: Azure App Service with Azure SQL Database and Blob Storage
- **Container**: Docker support for containerized deployments

## Contributing

1. Follow the modular architecture (server/client separation)
2. API-first development approach
3. Comprehensive testing for all components
4. Documentation updates for any architectural changes
