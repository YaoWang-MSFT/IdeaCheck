"""
Test script for IdeaCheck API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_register_user():
    """Test user registration"""
    print("👤 Testing user registration...")
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    return response

def test_login_user():
    """Test user login"""
    print("🔐 Testing user login...")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"✅ Login successful! Token: {token[:20]}...")
        return token
    else:
        print("❌ Login failed!")
        return None
    print()

def test_create_product(token):
    """Test product creation"""
    print("📦 Testing product creation...")
    headers = {"Authorization": f"Bearer {token}"}
    product_data = {
        "name": "Test Product",
        "description": "This is a test product for validation",
        "category": "technology"
    }
    response = requests.post(f"{BASE_URL}/api/v1/products", json=product_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        product = response.json()
        print(f"✅ Product created! ID: {product['id']}")
        print(f"✅ Checklink: {product['checklink']}")
        return product
    else:
        print("❌ Product creation failed!")
        return None
    print()

def test_list_products(token):
    """Test product listing"""
    print("📋 Testing product listing...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/v1/products", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_get_product_by_checklink(checklink):
    """Test public product access by checklink"""
    print("🌐 Testing public product access...")
    response = requests.get(f"{BASE_URL}/api/v1/public/products/{checklink}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_submit_feedback(product_id):
    """Test feedback submission"""
    print("💬 Testing feedback submission...")
    feedback_data = {
        "email": "feedback@example.com",
        "rating": 5,
        "comment": "Great product idea! I would definitely use this.",
        "referrer_url": "https://example.com"
    }
    response = requests.post(f"{BASE_URL}/api/v1/public/products/{product_id}/feedback", json=feedback_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def main():
    """Run all tests"""
    print("🚀 Starting IdeaCheck API Tests\n")
    
    # Test health
    test_health()
    
    # Test registration
    register_response = test_register_user()
    
    # Test login
    token = test_login_user()
    
    if token:
        # Test product creation
        product = test_create_product(token)
        
        # Test product listing
        test_list_products(token)
        
        if product:
            # Test public access
            test_get_product_by_checklink(product['checklink'])
            
            # Test feedback submission
            test_submit_feedback(product['id'])
    
    print("✅ All tests completed!")

if __name__ == "__main__":
    main()