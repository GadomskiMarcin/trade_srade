#!/bin/bash

# 🔐 Authentication App Setup Script
# This script sets up the entire project for development

set -e  # Exit on any error

echo "🚀 Setting up Authentication App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. You'll need it for local development."
    else
        print_success "Node.js is installed (version: $(node --version))"
    fi
}

# Check if Go is installed
check_go() {
    if ! command -v go &> /dev/null; then
        print_warning "Go is not installed. You'll need it for local development."
    else
        print_success "Go is installed (version: $(go version))"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
        print_success "Root dependencies installed"
    fi
    
    # Install client dependencies
    if [ -d "client" ] && [ -f "client/package.json" ]; then
        cd client
        npm install
        cd ..
        print_success "Client dependencies installed"
    fi
    
    # Install server dependencies
    if [ -d "server" ] && [ -f "server/go.mod" ]; then
        cd server
        go mod tidy
        cd ..
        print_success "Server dependencies installed"
    fi
}

# Start PostgreSQL
start_postgres() {
    print_status "Starting PostgreSQL..."
    
    # Check if PostgreSQL container is already running
    if docker ps | grep -q auth_postgres; then
        print_success "PostgreSQL is already running"
        return
    fi
    
    # Start PostgreSQL
    docker run --name auth_postgres \
        -e POSTGRES_DB=auth_app \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -d postgres:15-alpine
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    print_success "PostgreSQL started successfully"
}

# Create .env file if it doesn't exist
create_env() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
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
ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8080
EOF
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
}

# Main setup function
main() {
    echo "🔐 Authentication App Setup"
    echo "=========================="
    echo ""
    
    # Check prerequisites
    check_docker
    check_node
    check_go
    echo ""
    
    # Install dependencies
    install_dependencies
    echo ""
    
    # Start PostgreSQL
    start_postgres
    echo ""
    
    # Create .env file
    create_env
    echo ""
    
    print_success "Setup completed successfully!"
    echo ""
    echo "🎉 Your project is ready to use!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Start the application: npm run dev"
    echo "2. Or use Docker: docker-compose up --build"
    echo "3. Access the app at: http://localhost:3000"
    echo ""
    echo "📚 For more information, see the README.md file"
}

# Run main function
main "$@" 