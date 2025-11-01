from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from datetime import datetime

# Import our modules
from config import get_config
from models import db, Product, UserResponse
from azure_storage import storage_manager

def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    storage_manager.init_app(app)
    
    # Initialize database
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Add sample data for development
        if app.config.get('FLASK_ENV') == 'development':
            from models import Product, UserResponse
            # Check if we already have data
            if not Product.query.first():
                # Create a sample product
                sample_product = Product(
                    name="Sample Product",
                    description="This is a sample product for testing the IdeaCheck application."
                )
                
                db.session.add(sample_product)
                db.session.commit()
                
                # Create a sample user response
                sample_response = UserResponse(
                    product_id=sample_product.id,
                    email="test@example.com"
                )
                
                db.session.add(sample_response)
                db.session.commit()
                
                print("Sample data created successfully!")
    
    return app

app = create_app()

# Utility functions
def login_required(f):
    """Decorator to require admin login."""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# Public Routes
@app.route('/')
def index():
    """Home page."""
    return render_template('public/index.html')

@app.route('/check/<token>')
def collect_data(token):
    """Public data collection page accessed via checklink."""
    # Find product by token
    product = Product.query.filter_by(checklink_token=token).first()
    
    if not product:
        flash('Invalid or expired link.', 'error')
        return render_template('public/error.html', 
                             message='This link is invalid or has expired.')
    
    return render_template('public/collect_data.html', product=product)

@app.route('/api/submit', methods=['POST'])
def submit_data():
    """Handle form submission from public data collection."""
    try:
        # Get form data
        token = request.form.get('token')
        email = request.form.get('email', '').strip()
        
        if not token or not email:
            return jsonify({
                'success': False, 
                'message': 'Missing required fields'
            }), 400
        
        # Find product by token
        product = Product.query.filter_by(checklink_token=token).first()
        if not product:
            return jsonify({
                'success': False, 
                'message': 'Invalid link'
            }), 404
        
        # Get additional request info
        user_agent = request.headers.get('User-Agent', '')
        ip_address = request.remote_addr
        referrer = request.headers.get('Referer', '')
        
        # Create user response
        user_response = UserResponse(
            product_id=product.id,
            email=email,
            user_agent=user_agent,
            ip_address=ip_address,
            referrer=referrer
        )
        
        db.session.add(user_response)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Thank you! Your response has been recorded.'
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error submitting data: {e}')
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again.'
        }), 500

# Admin Routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin login page."""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if (username == app.config['ADMIN_USERNAME'] and 
            password == app.config['ADMIN_PASSWORD']):
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials', 'error')
    
    return render_template('admin/login.html')

@app.route('/admin/logout')
def admin_logout():
    """Admin logout."""
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    """Admin dashboard showing all products and their stats."""
    products = Product.query.order_by(Product.created_at.desc()).all()
    
    # Calculate stats
    total_products = len(products)
    total_responses = sum(product.get_response_count() for product in products)
    
    return render_template('admin/dashboard.html', 
                         products=products,
                         total_products=total_products,
                         total_responses=total_responses)

@app.route('/admin/create', methods=['GET', 'POST'])
@login_required
def create_product():
    """Create a new product."""
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name', '').strip()
            description = request.form.get('description', '').strip()
            
            if not name:
                flash('Product name is required', 'error')
                return render_template('admin/create_product.html')
            
            # Handle file upload
            poster_filename = None
            poster_blob_url = None
            
            if 'poster' in request.files:
                file = request.files['poster']
                if file and file.filename:
                    result = storage_manager.save_file(file)
                    if result['success']:
                        if result['storage_type'] == 'azure':
                            poster_blob_url = result['url']
                        else:
                            poster_filename = result['filename']
                    else:
                        flash(f'Error uploading poster: {result["error"]}', 'error')
                        return render_template('admin/create_product.html')
            
            # Create product
            product = Product(
                name=name,
                description=description,
                poster_filename=poster_filename,
                poster_blob_url=poster_blob_url
            )
            
            db.session.add(product)
            db.session.commit()
            
            flash(f'Product "{name}" created successfully!', 'success')
            return redirect(url_for('admin_dashboard'))
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f'Error creating product: {e}')
            flash('An error occurred while creating the product', 'error')
    
    return render_template('admin/create_product.html')

@app.route('/admin/product/<int:product_id>')
@login_required
def view_product(product_id):
    """View product details and responses."""
    product = Product.query.get_or_404(product_id)
    responses = UserResponse.query.filter_by(product_id=product_id)\
                                .order_by(UserResponse.submitted_at.desc()).all()
    
    return render_template('admin/product_detail.html', 
                         product=product, 
                         responses=responses)

@app.route('/admin/product/<int:product_id>/delete', methods=['POST'])
@login_required
def delete_product(product_id):
    """Delete a product and its associated files."""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Delete associated files
        if product.poster_filename or product.poster_blob_url:
            storage_manager.delete_file(
                filename=product.poster_filename,
                blob_url=product.poster_blob_url
            )
        
        # Delete product (responses will be deleted automatically due to cascade)
        db.session.delete(product)
        db.session.commit()
        
        flash(f'Product "{product.name}" deleted successfully', 'success')
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error deleting product: {e}')
        flash('An error occurred while deleting the product', 'error')
    
    return redirect(url_for('admin_dashboard'))

# API Routes
@app.route('/api/products')
@login_required
def api_products():
    """API endpoint to get all products."""
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/product/<int:product_id>/responses')
@login_required
def api_product_responses(product_id):
    """API endpoint to get responses for a specific product."""
    responses = UserResponse.query.filter_by(product_id=product_id)\
                                .order_by(UserResponse.submitted_at.desc()).all()
    return jsonify([response.to_dict() for response in responses])

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('public/error.html', 
                         message='Page not found'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('public/error.html', 
                         message='Internal server error'), 500

# Template helpers
@app.template_filter('datetime')
def datetime_filter(value, format='%Y-%m-%d %H:%M'):
    """Custom template filter for formatting datetime."""
    if value is None:
        return ''
    return value.strftime(format)

@app.context_processor
def utility_processor():
    """Inject utility functions into templates."""
    return {
        'get_base_url': lambda: request.url_root.rstrip('/'),
        'get_poster_url': lambda product: storage_manager.get_file_url(
            filename=product.poster_filename,
            blob_url=product.poster_blob_url,
            base_url=request.url_root.rstrip('/')
        )
    }

if __name__ == '__main__':
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        import shutil
        shutil.copy('.env.example', '.env')
        print("Created .env file from .env.example")
        print("Please update .env with your configuration values")
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)