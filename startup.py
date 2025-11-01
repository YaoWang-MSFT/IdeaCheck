#!/usr/bin/env python3
"""
Startup script for Azure App Service deployment.
This script handles initialization tasks required for Azure deployment.
"""

import os
import sys
from app import create_app
from models import db

def setup_azure_environment():
    """Set up environment variables for Azure deployment."""
    
    # Set Flask environment to production if not specified
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'production'
    
    # Ensure required Azure environment variables are set
    required_vars = [
        'AZURE_SQL_CONNECTION_STRING',
        'AZURE_STORAGE_CONNECTION_STRING'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"WARNING: Missing required environment variables: {', '.join(missing_vars)}")
        print("Application may not function correctly without these variables.")
    
    return True

def initialize_database(app):
    """Initialize database tables if they don't exist."""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            print("Database tables initialized successfully")
            return True
    except Exception as e:
        print(f"Error initializing database: {e}")
        return False

def main():
    """Main startup function."""
    print("Starting IdeaCheck application...")
    
    # Setup Azure environment
    if not setup_azure_environment():
        print("Failed to setup Azure environment")
        sys.exit(1)
    
    # Create Flask application
    try:
        app = create_app()
        print("Flask application created successfully")
    except Exception as e:
        print(f"Failed to create Flask application: {e}")
        sys.exit(1)
    
    # Initialize database
    if not initialize_database(app):
        print("Failed to initialize database")
        # Don't exit here - app might still work with existing database
    
    print("IdeaCheck application started successfully")
    return app

# For Azure App Service
app = main()

if __name__ == '__main__':
    # For local testing of startup script
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))