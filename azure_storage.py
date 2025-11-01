import os
import uuid
from werkzeug.utils import secure_filename
from config import get_config

try:
    from azure.storage.blob import BlobServiceClient, BlobClient
    from azure.core.exceptions import AzureError
    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False
    print("Azure Storage libraries not available. Using local storage only.")

class StorageManager:
    """Manages file storage for both local development and Azure production."""
    
    def __init__(self, app=None):
        self.app = app
        self.config = None
        self.blob_service_client = None
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize storage manager with Flask app."""
        self.app = app
        self.config = app.config
        
        # Initialize Azure Blob Storage if in production and Azure is available
        if (self.config.get('USE_AZURE_STORAGE') and 
            AZURE_AVAILABLE and 
            self.config.get('AZURE_STORAGE_CONNECTION_STRING')):
            
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(
                    self.config['AZURE_STORAGE_CONNECTION_STRING']
                )
                self._ensure_container_exists()
                print("Azure Blob Storage initialized successfully")
            except Exception as e:
                print(f"Failed to initialize Azure Blob Storage: {e}")
                print("Falling back to local storage")
                self.blob_service_client = None
    
    def _ensure_container_exists(self):
        """Ensure the Azure storage container exists."""
        if not self.blob_service_client:
            return False
            
        try:
            container_name = self.config['AZURE_STORAGE_CONTAINER_NAME']
            container_client = self.blob_service_client.get_container_client(container_name)
            
            # Try to get container properties, create if it doesn't exist
            try:
                container_client.get_container_properties()
            except Exception:
                container_client.create_container(public_access='blob')
                print(f"Created Azure storage container: {container_name}")
            
            return True
        except Exception as e:
            print(f"Error ensuring container exists: {e}")
            return False
    
    def save_file(self, file, filename=None):
        """
        Save a file to storage (local or Azure).
        
        Args:
            file: FileStorage object from Flask request
            filename: Optional custom filename
            
        Returns:
            dict: Contains 'filename', 'url', and 'success' keys
        """
        if not file or not file.filename:
            return {'success': False, 'error': 'No file provided'}
        
        # Generate secure filename
        if filename:
            filename = secure_filename(filename)
        else:
            filename = secure_filename(file.filename)
        
        # Add UUID to prevent filename conflicts
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        # Check if file type is allowed
        if not self._is_allowed_file(filename):
            return {
                'success': False, 
                'error': f'File type not allowed. Allowed types: {", ".join(self.config["ALLOWED_EXTENSIONS"])}'
            }
        
        # Try Azure storage first if configured
        if self.blob_service_client:
            result = self._save_to_azure(file, unique_filename)
            if result['success']:
                return result
            else:
                print(f"Azure upload failed: {result.get('error')}")
                print("Falling back to local storage")
        
        # Fall back to local storage
        return self._save_to_local(file, unique_filename)
    
    def _save_to_azure(self, file, filename):
        """Save file to Azure Blob Storage."""
        try:
            container_name = self.config['AZURE_STORAGE_CONTAINER_NAME']
            blob_client = self.blob_service_client.get_blob_client(
                container=container_name, 
                blob=filename
            )
            
            # Upload file
            file.seek(0)  # Reset file pointer
            blob_client.upload_blob(file.read(), overwrite=True)
            
            # Get the blob URL
            blob_url = blob_client.url
            
            return {
                'success': True,
                'filename': filename,
                'url': blob_url,
                'storage_type': 'azure'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Azure upload failed: {str(e)}'
            }
    
    def _save_to_local(self, file, filename):
        """Save file to local storage."""
        try:
            # Ensure upload directory exists
            upload_folder = self.config['UPLOAD_FOLDER']
            os.makedirs(upload_folder, exist_ok=True)
            
            # Save file
            filepath = os.path.join(upload_folder, filename)
            file.seek(0)  # Reset file pointer
            file.save(filepath)
            
            return {
                'success': True,
                'filename': filename,
                'url': f'/static/uploads/{filename}',
                'storage_type': 'local'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Local upload failed: {str(e)}'
            }
    
    def delete_file(self, filename=None, blob_url=None):
        """
        Delete a file from storage.
        
        Args:
            filename: Local filename to delete
            blob_url: Azure blob URL to delete
            
        Returns:
            bool: Success status
        """
        success = True
        
        # Delete from Azure if blob_url is provided
        if blob_url and self.blob_service_client:
            try:
                # Extract blob name from URL
                blob_name = blob_url.split('/')[-1]
                container_name = self.config['AZURE_STORAGE_CONTAINER_NAME']
                
                blob_client = self.blob_service_client.get_blob_client(
                    container=container_name, 
                    blob=blob_name
                )
                blob_client.delete_blob()
                
            except Exception as e:
                print(f"Failed to delete Azure blob: {e}")
                success = False
        
        # Delete from local storage if filename is provided
        if filename:
            try:
                filepath = os.path.join(self.config['UPLOAD_FOLDER'], filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
            except Exception as e:
                print(f"Failed to delete local file: {e}")
                success = False
        
        return success
    
    def _is_allowed_file(self, filename):
        """Check if file extension is allowed."""
        return ('.' in filename and 
                filename.rsplit('.', 1)[1].lower() in self.config['ALLOWED_EXTENSIONS'])
    
    def get_file_url(self, filename=None, blob_url=None, base_url='http://localhost:5000'):
        """
        Get the URL for accessing a file.
        
        Args:
            filename: Local filename
            blob_url: Azure blob URL
            base_url: Base URL for local files
            
        Returns:
            str: File URL or None
        """
        if blob_url:
            return blob_url
        elif filename:
            return f"{base_url}/static/uploads/{filename}"
        return None

# Global storage manager instance
storage_manager = StorageManager()