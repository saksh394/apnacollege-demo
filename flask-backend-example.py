#!/usr/bin/env python3
"""
Example Flask Backend for ShopEasy E-commerce Frontend
This is a basic example showing how to integrate the frontend with Flask.
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
import json
import uuid

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production
CORS(app, supports_credentials=True)

# Mock database (replace with real database in production)
PRODUCTS = [
    {
        "id": 1,
        "name": "Premium Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 299.99,
        "originalPrice": 399.99,
        "category": "Electronics",
        "image": "🎧",
        "rating": 4.8,
        "reviews": 156,
        "inStock": True,
        "stockCount": 25,
        "features": ["Noise Cancellation", "30-hour Battery", "Wireless Charging"]
    },
    # Add more products here...
]

USERS = {}
ORDERS = {}
CARTS = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    category = request.args.get('category')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    sort_by = request.args.get('sort')
    
    products = PRODUCTS.copy()
    
    # Apply filters
    if category:
        products = [p for p in products if p['category'].lower() == category.lower()]
    
    if min_price is not None:
        products = [p for p in products if p['price'] >= min_price]
    
    if max_price is not None:
        products = [p for p in products if p['price'] <= max_price]
    
    # Apply sorting
    if sort_by == 'price_asc':
        products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_desc':
        products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'name_asc':
        products.sort(key=lambda x: x['name'])
    elif sort_by == 'rating_desc':
        products.sort(key=lambda x: x['rating'], reverse=True)
    
    return jsonify({
        "products": products,
        "total": len(products),
        "page": 1,
        "totalPages": 1
    })

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product)

@app.route('/api/products/search', methods=['GET'])
def search_products():
    """Search products by query"""
    query = request.args.get('query', '').lower()
    
    if not query:
        return jsonify({"products": [], "total": 0, "query": ""})
    
    filtered_products = [
        p for p in PRODUCTS 
        if query in p['name'].lower() or 
           query in p['description'].lower() or 
           query in p['category'].lower()
    ]
    
    return jsonify({
        "products": filtered_products,
        "total": len(filtered_products),
        "query": request.args.get('query', '')
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400
    
    email = data['email']
    
    # Check if user already exists
    if email in USERS:
        return jsonify({"error": "User already exists"}), 400
    
    # Create new user
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": email,
        "name": data.get('name', ''),
        "created_at": datetime.now().isoformat()
    }
    
    USERS[email] = {
        **user,
        "password": data['password']  # In production, hash this!
    }
    
    # Create session
    session['user_id'] = user_id
    session['email'] = email
    
    return jsonify({
        "success": True,
        "user": user,
        "token": f"mock-token-{user_id}"
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400
    
    email = data['email']
    password = data['password']
    
    # Check credentials
    user_data = USERS.get(email)
    if not user_data or user_data['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create session
    session['user_id'] = user_data['id']
    session['email'] = email
    
    user = {
        "id": user_data['id'],
        "email": user_data['email'],
        "name": user_data['name']
    }
    
    return jsonify({
        "success": True,
        "user": user,
        "token": f"mock-token-{user_data['id']}"
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout"""
    session.clear()
    return jsonify({"success": True})

@app.route('/api/cart', methods=['GET'])
def get_cart():
    """Get user's cart"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    cart_items = CARTS.get(user_id, [])
    
    # Calculate totals
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    shipping = 0 if subtotal > 100 else 10
    tax = subtotal * 0.08
    total = subtotal + shipping + tax
    
    return jsonify({
        "items": cart_items,
        "subtotal": subtotal,
        "shipping": shipping,
        "tax": tax,
        "total": total
    })

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)
    
    # Find product
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    # Get or create cart
    cart = CARTS.get(user_id, [])
    
    # Check if item already in cart
    existing_item = next((item for item in cart if item['productId'] == product_id), None)
    
    if existing_item:
        existing_item['quantity'] += quantity
    else:
        cart.append({
            "id": str(uuid.uuid4()),
            "productId": product_id,
            "name": product['name'],
            "price": product['price'],
            "image": product['image'],
            "quantity": quantity
        })
    
    CARTS[user_id] = cart
    
    return jsonify({"success": True, "cart": cart})

@app.route('/api/cart/items/<item_id>', methods=['PUT'])
def update_cart_item(item_id):
    """Update cart item quantity"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    quantity = data.get('quantity')
    
    cart = CARTS.get(user_id, [])
    item = next((item for item in cart if item['id'] == item_id), None)
    
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    if quantity <= 0:
        cart.remove(item)
    else:
        item['quantity'] = quantity
    
    CARTS[user_id] = cart
    
    return jsonify({"success": True, "cart": cart})

@app.route('/api/cart/items/<item_id>', methods=['DELETE'])
def remove_cart_item(item_id):
    """Remove item from cart"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    cart = CARTS.get(user_id, [])
    cart = [item for item in cart if item['id'] != item_id]
    CARTS[user_id] = cart
    
    return jsonify({"success": True, "cart": cart})

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create new order"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    
    order_id = str(uuid.uuid4())
    order = {
        "id": order_id,
        "userId": user_id,
        "items": data.get('items', []),
        "shipping": data.get('shipping', {}),
        "payment": data.get('payment', {}),
        "totals": data.get('totals', {}),
        "status": "confirmed",
        "createdAt": datetime.now().isoformat()
    }
    
    ORDERS[order_id] = order
    
    # Clear user's cart
    CARTS[user_id] = []
    
    return jsonify({"success": True, "order": order})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get user's orders"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    user_orders = [order for order in ORDERS.values() if order['userId'] == user_id]
    user_orders.sort(key=lambda x: x['createdAt'], reverse=True)
    
    return jsonify({"orders": user_orders})

if __name__ == '__main__':
    # Add a demo user for testing
    USERS['demo@example.com'] = {
        "id": "demo-user-id",
        "email": "demo@example.com",
        "name": "Demo User",
        "password": "demo123",
        "created_at": datetime.now().isoformat()
    }
    
    print("🚀 ShopEasy Flask Backend Starting...")
    print("📱 Frontend should connect to: http://localhost:5000")
    print("🔧 To integrate with frontend:")
    print("   1. Update baseURL in js/utils/api.js to 'http://localhost:5000/api'")
    print("   2. Set mockMode to false in ApiService")
    print("   3. Restart the frontend")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5000)