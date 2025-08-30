#!/bin/bash

echo "🛍️  ShopEasy E-commerce Application"
echo "=================================="
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found"
else
    echo "❌ Python3 not found. Please install Python3 to run the backend."
    exit 1
fi

# Function to start frontend
start_frontend() {
    echo "🌐 Starting frontend server..."
    if command -v npx &> /dev/null; then
        npx live-server --port=3000 --open=/index.html
    else
        echo "📡 Starting Python HTTP server for frontend..."
        python3 -m http.server 3000
    fi
}

# Function to start backend
start_backend() {
    echo "🐍 Starting Flask backend..."
    
    # Install requirements if they don't exist
    if [ ! -d "venv" ]; then
        echo "📦 Setting up virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    python flask-backend-example.py
}

# Main menu
echo "Choose an option:"
echo "1) Start Frontend Only (Mock Data)"
echo "2) Start Backend Only (Flask API)"
echo "3) Start Both (Full Stack)"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting frontend with mock data..."
        echo "📱 Open http://localhost:3000 in your browser"
        echo "👤 Demo login: demo@example.com / demo123"
        echo ""
        start_frontend
        ;;
    2)
        echo ""
        echo "🚀 Starting Flask backend..."
        echo "🔗 Backend will be available at http://localhost:5000"
        echo "📖 API documentation available in README.md"
        echo ""
        start_backend
        ;;
    3)
        echo ""
        echo "🚀 Starting full stack application..."
        echo "📱 Frontend: http://localhost:3000"
        echo "🔗 Backend: http://localhost:5000"
        echo "⚠️  Remember to update API settings in frontend!"
        echo ""
        
        # Start backend in background
        start_backend &
        BACKEND_PID=$!
        
        # Wait a moment for backend to start
        sleep 3
        
        # Start frontend
        start_frontend
        
        # Cleanup on exit
        trap "kill $BACKEND_PID" EXIT
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-4."
        exit 1
        ;;
esac