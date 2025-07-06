#!/bin/bash

echo "🚀 Setting up Authentication App with modern stack..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Go is installed (for local development)
if ! command -v go &> /dev/null; then
    echo "⚠️  Go is not installed. You'll need it for local development."
    echo "   Install from: https://golang.org/dl/"
fi

# Check if Node.js is installed (for local development)
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. You'll need it for local development."
    echo "   Install from: https://nodejs.org/"
fi

echo "✅ Prerequisites check completed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
go mod tidy
cd ..

echo "✅ Dependencies installed successfully"

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=auth_app

# Server Configuration
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
ENV=development
EOF
    echo "✅ Backend .env file created"
fi

# Create frontend .env file if it doesn't exist
if [ ! -f client/.env ]; then
    echo "📝 Creating frontend .env file..."
    cat > client/.env << EOF
# Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:8080

# Environment
VITE_ENV=development
EOF
    echo "✅ Frontend .env file created"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 Quick Start Options:"
echo "1. Docker (Recommended): docker-compose up --build"
echo "2. Local Development: npm run dev"
echo ""
echo "📚 For more information, see README.md"
echo "" 

