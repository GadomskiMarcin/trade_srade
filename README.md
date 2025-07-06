# 🪑 FurnitureHub - Polish Furniture Marketplace

A modern full-stack furniture marketplace application with **React 19 + TypeScript** frontend and **Go** backend, featuring authentication, furniture browsing, and Polish location-based listings. Fully dockerized with **PostgreSQL** database and Hot Module Replacement (HMR) for fast development.

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Go 1.22+** (for local development)
- **Node.js 20+** (for local development)

### Environment Setup

The application requires environment variables to be properly configured. The setup script will create the necessary files:

```bash
# Run the setup script to create environment files
./setup.sh
```

This will create:
- `.env` - Backend environment variables
- `client/.env` - Frontend environment variables

### Development with HMR (Recommended)
```bash
# Start development environment with Hot Module Replacement
./dev.sh

# Or manually:
docker-compose -f docker-compose.dev.yml up --build
```

### Production Setup
```bash
# Start production environment
./prod.sh

# Or manually:
docker-compose up --build
```

### Cleanup
```bash
# Clean up all containers and volumes
./clean.sh
```

## 📁 Project Structure

```
├── client/                 # React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components (Dashboard, Login, etc.)
│   │   ├── hooks/         # Custom hooks (useAuth, useApi)
│   │   ├── types/         # TypeScript definitions
│   │   ├── styles/        # Modular CSS files
│   │   ├── config.ts      # Environment configuration
│   │   └── App.tsx        # Main app with routing
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript config
│   ├── vite.config.ts     # Vite configuration with HMR
│   ├── .env               # Frontend environment variables
│   ├── env.example        # Frontend environment example
│   └── index.html         # Entry HTML
├── server/                 # Go backend
│   ├── handlers/          # HTTP handlers (auth, profile)
│   ├── middleware/        # CORS middleware
│   ├── models/            # Data models
│   ├── utils/             # Response utilities
│   ├── main.go            # Server entry point
│   ├── go.mod             # Go dependencies
│   ├── .env               # Backend environment variables
│   └── env.example        # Backend environment example
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup with HMR
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
├── dev.sh                  # Development startup script
├── prod.sh                 # Production startup script
├── clean.sh                # Cleanup script
├── setup.sh                # Setup script
├── .env                    # Root environment variables
└── package.json           # Root scripts
```

## 🛠️ Development Commands

### Quick Scripts
```bash
./setup.sh                  # Initial setup with environment files
./dev.sh                    # Start development with HMR
./prod.sh                   # Start production
./clean.sh                  # Clean up everything
```

### Manual Docker Commands
```bash
# Development (with HMR)
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up --build
docker-compose down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Individual Services
```bash
# Frontend only (with HMR)
cd client && npm run dev     # Vite dev server (port 3000)

# Backend only
cd server && go run main.go  # Go server (port 8080)

# Database only
docker run --name auth_postgres -e POSTGRES_DB=auth_app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
```

## 🌐 Access Points

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| **Frontend (Dev)** | http://localhost:3000 | 3000 | Vite dev server with HMR |
| **Frontend (Prod)** | http://localhost | 80 | Nginx production server |
| **Backend API** | http://localhost:8080 | 8080 | Go REST API |
| **PostgreSQL** | localhost:5433 | 5433 | Database |

## 🪑 Features

### Authentication
- ✅ **User Registration** - Email/password signup
- ✅ **User Login** - Secure authentication
- ✅ **Guest Access** - Temporary user accounts
- ✅ **JWT Tokens** - Secure session management
- ✅ **Auto-redirect** - Dashboard after login/signup

### Furniture Marketplace
- ✅ **Furniture Categories** - Sofa, Chair, Table, Bed, Wardrobe, Desk, Cabinet, Lighting
- ✅ **Polish Locations** - Real Polish cities and voivodeships
- ✅ **Tag-based Filtering** - Filter by furniture type
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **High-Quality Images** - Unsplash furniture photos
- ✅ **Save Functionality** - Bookmark items (UI ready)

### Development Experience
- ✅ **Hot Module Replacement** - Instant code updates
- ✅ **Modular CSS** - Organized stylesheets
- ✅ **TypeScript** - Full type safety
- ✅ **Modern React** - React 19 features
- ✅ **TanStack Query** - Server state management
- ✅ **TanStack Router** - Type-safe routing

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database Configuration
DB_HOST=localhost          # PostgreSQL host
DB_PORT=5432              # PostgreSQL port
DB_USER=postgres          # Database user
DB_PASSWORD=password      # Database password
DB_NAME=auth_app          # Database name

# Server Configuration
PORT=8080                 # Server port
JWT_SECRET=your-secret    # JWT signing key (REQUIRED)
ENV=development           # Environment (production/development)
```

### Frontend (client/.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:8080  # Backend API URL (REQUIRED)

# Environment
VITE_ENV=development      # Environment (development/production)
```

### Environment Variable Validation

The application will **fail to start** if required environment variables are missing:

**Backend Required Variables:**
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Server port
- `JWT_SECRET` - JWT signing key

**Frontend Required Variables:**
- `VITE_API_URL` - Backend API URL

If any required variable is missing, the application will display a clear error message and exit gracefully.

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/temporary
```json
{
  "name": "Guest User"
}
```

#### GET /api/profile
```bash
Authorization: Bearer <jwt-token>
```

## 🏗️ Architecture

### Frontend (React 19 + TypeScript)
- **Vite** - Modern build tool with ES modules and HMR
- **React 19** - Latest React features
- **TypeScript 5.8** - Latest type system
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Custom Hooks** - `useAuth`, `useApi`
- **Modular CSS** - Organized stylesheets
- **ES Modules** - Modern JavaScript modules
- **Environment Configuration** - Proper env var handling

### Backend (Go)
- **Go 1.22** - Latest stable version
- **Standard Libraries** - `net/http`, `database/sql`
- **PostgreSQL** - Database with `lib/pq`
- **JWT** - Authentication with `golang-jwt`
- **bcrypt** - Password hashing
- **Modular Structure** - Handlers, middleware, utils
- **Environment Validation** - Proper env var validation

### Infrastructure
- **Docker** - Containerization
- **PostgreSQL 15** - Database
- **Nginx** - Production serving
- **Docker Compose** - Orchestration
- **HMR** - Hot Module Replacement for development

## 🔍 Code Quality Features

### Frontend
- ✅ **Modern Build System** - Vite with ES modules and HMR
- ✅ **Latest React 19** - Latest features and performance
- ✅ **TypeScript 5.8** - Latest type system features
- ✅ **Custom Hooks** - Extracted authentication logic
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Component Separation** - No large monolithic components
- ✅ **Modular CSS** - Organized stylesheets (base, auth, dashboard, etc.)
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Furniture Marketplace** - Polish location-based listings
- ✅ **Environment Validation** - Proper env var handling with error messages

### Backend
- ✅ **Modular Architecture** - Separated concerns
- ✅ **Handler Organization** - Auth and profile handlers
- ✅ **Middleware Separation** - CORS logic isolated
- ✅ **Utility Functions** - Response helpers centralized
- ✅ **Model Definitions** - User model in separate file
- ✅ **Guest User Support** - Temporary user accounts
- ✅ **Environment Validation** - Proper env var validation with clear errors

## 🚀 Deployment

### Development with HMR
```bash
# Start development environment
./dev.sh

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development
docker-compose -f docker-compose.dev.yml down
```

### Production with Docker
```bash
# Build and run production containers
./prod.sh

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables for Production
```bash
# Create .env file with secure values
JWT_SECRET=your-super-secret-production-key
DB_PASSWORD=your-secure-database-password
VITE_API_URL=https://your-api-domain.com
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test                    # Run tests with Vitest
npm run test:ui            # UI test runner
```

### Backend Testing
```bash
cd server
go test ./...              # Run all tests
go test -v ./...           # Verbose output
go test -cover ./...       # Coverage report
```

## 🔧 Troubleshooting

### Common Issues

#### Environment Variables Missing
```bash
# Check if .env files exist
ls -la .env client/.env

# If missing, run setup
./setup.sh
```

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker restart auth_postgres
```

#### Docker Issues
```bash
# Clean up Docker
./clean.sh

# Or manually:
docker system prune -f
docker-compose down -v
```

#### HMR Not Working
```bash
# Restart development environment
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Guidelines

### Frontend
- Use **TypeScript 5.8** for all new code
- Use **ES modules** for imports/exports
- Create **custom hooks** for reusable logic
- Keep components **small and focused**
- Use **TanStack Query** for server state
- Follow **React 19** best practices
- Use **modular CSS** for styling
- Implement **mobile-first** design
- Always validate **environment variables**

### Backend
- Use **standard Go libraries** only
- Follow **Go conventions** and naming
- Keep handlers **small and focused**
- Use **proper error handling**
- Write **clear documentation**
- Always validate **environment variables**

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/new-feature
```

## 🔒 Security Considerations

### Environment Variables
- **Never commit** `.env` files to version control
- Use **strong JWT secrets** in production
- Use **secure database passwords**
- Validate all **required environment variables**

### Production Deployment
- Use **HTTPS** for all production traffic
- Set **secure JWT secrets**
- Use **strong database passwords**
- Configure **proper CORS settings**
- Enable **security headers**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
