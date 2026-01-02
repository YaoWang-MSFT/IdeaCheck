"""
Simple API test - run server manually first
"""
import requests
import json

def test_endpoints():
    base_url = "http://localhost:8000"
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Response: {response.json()}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
        return
    
    # Test 2: Register user
    print("\n2. Testing user registration...")
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    try:
        response = requests.post(f"{base_url}/api/v1/auth/register", json=user_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ User created: {response.json()}")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Login
    print("\n3. Testing login...")
    login_data = {
        "email": "test@example.com", 
        "password": "testpass123"
    }
    try:
        response = requests.post(f"{base_url}/api/v1/auth/login", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            print(f"   ✅ Login successful! Token: {token[:20]}...")
            
            # Test 4: Create product
            print("\n4. Testing product creation...")
            headers = {"Authorization": f"Bearer {token}"}
            product_data = {
                "name": "Test Product",
                "description": "A product for testing the API",
                "category": "tech"
            }
            response = requests.post(f"{base_url}/api/v1/products", json=product_data, headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                product = response.json()
                print(f"   ✅ Product created! ID: {product['id']}")
                print(f"   ✅ Checklink: {product['checklink']}")
                
                # Test 5: Get product by checklink
                print("\n5. Testing public product access...")
                response = requests.get(f"{base_url}/api/v1/public/products/{product['checklink']}")
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    print(f"   ✅ Public access works: {response.json()}")
                
                # Test 6: Submit feedback
                print("\n6. Testing feedback submission...")
                feedback_data = {
                    "email": "feedback@test.com",
                    "rating": 5,
                    "comment": "Great product idea!"
                }
                response = requests.post(f"{base_url}/api/v1/public/products/{product['id']}/feedback", json=feedback_data)
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    print(f"   ✅ Feedback submitted: {response.json()}")
            else:
                print(f"   ❌ Product creation failed: {response.json()}")
        else:
            print(f"   ❌ Login failed: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 FastAPI Endpoint Tests")
    print("Make sure server is running on http://localhost:8000")
    print("="*50)
    test_endpoints()
    print("\n✅ Tests completed!")