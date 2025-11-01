# IdeaCheck
IdeaCheck is a lightweight tool that helps you validate product ideas quickly and effortlessly.

## Features
- Create product items with descriptions and poster images
- Generate unique checklinks for data collection
- Collect user email addresses through simple forms
- Admin dashboard for managing products and viewing responses
- Support for both local development and Azure deployment

## Project Structure
```
IdeaCheck/
├── app.py                 # Main Flask application
├── models.py              # Database models (Product, UserResponse)
├── config.py              # Configuration for local/Azure environments
├── azure_storage.py       # Azure Blob Storage integration
├── startup.py             # Azure App Service startup script
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (local)
├── .env.example           # Environment template
├── static/                # Static files (CSS, JS, uploads)
├── templates/             # HTML templates
│   ├── admin/             # Admin interface templates
│   └── public/            # Public-facing templates
└── migrations/            # Database migration files
```

## Quick Start (Local Development)

1. **Create and Activate Virtual Environment**
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # On Windows (PowerShell/Command Prompt):
   .venv\Scripts\activate
   
   # On macOS/Linux:
   source .venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```

4. **Access the Application**
   - Main app: http://localhost:5000
   - Admin dashboard: http://localhost:5000/admin (default: admin/secure-password-123)

## Azure Deployment

This application is designed to work with Azure resources:

- **Azure App Service**: Host the web application
- **Azure SQL Database**: Store products and responses
- **Azure Blob Storage**: Store product poster images
- **Azure Key Vault**: Manage secrets and connection strings

Set the following environment variables in Azure App Service:
- `FLASK_ENV=production`
- `AZURE_SQL_CONNECTION_STRING`
- `AZURE_STORAGE_CONNECTION_STRING`
- `SECRET_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Usage

### Admin Workflow
1. Login to `/admin` with admin credentials
2. Create new products with name, description, and poster image
3. Copy the generated checklink URL for distribution
4. Monitor responses in the admin dashboard

### User Workflow
1. User clicks on checklink URL
2. User fills out simple email collection form
3. Response is automatically linked to the specific product

## Architecture

The application follows a simple Flask architecture:
- **Models**: SQLAlchemy models for database operations
- **Views**: Flask routes for handling requests
- **Templates**: Jinja2 templates for rendering HTML
- **Storage**: Flexible storage system (local files or Azure Blob Storage)
- **Configuration**: Environment-based configuration for different deployments
