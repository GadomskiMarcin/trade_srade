# 🔐 Authentication App

A modern full-stack authentication application with **React 19 + TypeScript** frontend and **Go** backend, featuring login and signup functionality. Fully dockerized with **PostgreSQL** database.

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Go 1.22+** (for local development)
- **Node.js 20+** (for local development)

### Option 1: Docker (Recommended - 1 Command)
```bash
# Start everything with PostgreSQL
docker-compose up --build
```

### Option 2: Local Development
```bash
# Install dependencies
npm run install-all

# Start PostgreSQL (Docker)
docker run --name auth_postgres -e POSTGRES_DB=auth_app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine

# Start the application
npm run dev
```

## 📁 Project Structure

```
├── client/                 # React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks (useAuth, useApi)
│   │   ├── types/         # TypeScript definitions
│   │   └── App.tsx        # Main app with routing
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript config
│   ├── vite.config.ts     # Vite configuration
│   └── index.html         # Entry HTML
├── server/                 # Go backend
│   ├── handlers/          # HTTP handlers (auth, profile)
│   ├── middleware/        # CORS middleware
│   ├── models/            # Data models
│   ├── utils/             # Response utilities
│   ├── main.go            # Server entry point
│   └── go.mod             # Go dependencies
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
└── package.json           # Root scripts
```

## 🛠️ Development Commands

### Root Level Commands
```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Build frontend
npm run build

# Build Go backend
npm run build-server

# Run Go backend
npm run run-server
```

### Docker Commands
```bash
# Production
npm run docker:prod          # Start production containers
npm run docker:down          # Stop containers
npm run docker:clean         # Clean up volumes

# Development
npm run docker:dev           # Start with hot reloading
npm run docker:down-dev      # Stop dev containers
npm run docker:logs-dev      # View dev logs
```

### Individual Services
```bash
# Frontend only
cd client && npm run dev     # Vite dev server (port 3000)

# Backend only
cd server && go run main.go  # Go server (port 8080)

# Database only
docker run --name auth_postgres -e POSTGRES_DB=auth_app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
```

## 🌐 Access Points

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| **Frontend (Dev)** | http://localhost:3000 | 3000 | Vite development server |
| **Frontend (Prod)** | http://localhost | 80 | Nginx production server |
| **Backend API** | http://localhost:8080 | 8080 | Go REST API |
| **PostgreSQL** | localhost:5432 | 5432 | Database |

## 🔧 Environment Variables

### Backend (.env or Docker environment)
```bash
# Database
DB_HOST=localhost          # PostgreSQL host
DB_PORT=5432              # PostgreSQL port
DB_USER=postgres          # Database user
DB_PASSWORD=password      # Database password
DB_NAME=auth_app          # Database name

# Server
PORT=8080                 # Server port
JWT_SECRET=your-secret    # JWT signing key
ENV=production            # Environment (production/development)
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8080  # Backend API URL
```

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

#### GET /api/profile
```bash
Authorization: Bearer <jwt-token>
```

## 🏗️ Architecture

### Frontend (React 19 + TypeScript)
- **Vite** - Modern build tool with ES modules
- **React 19** - Latest React features
- **TypeScript 5.8** - Latest type system
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Custom Hooks** - `useAuth`, `useApi`
- **ES Modules** - Modern JavaScript modules

### Backend (Go)
- **Go 1.22** - Latest stable version
- **Standard Libraries** - `net/http`, `database/sql`
- **PostgreSQL** - Database with `lib/pq`
- **JWT** - Authentication with `golang-jwt`
- **bcrypt** - Password hashing
- **Modular Structure** - Handlers, middleware, utils

### Infrastructure
- **Docker** - Containerization
- **PostgreSQL 15** - Database
- **Nginx** - Production serving
- **Docker Compose** - Orchestration

## 🔍 Code Quality Features

### Frontend
- ✅ **Modern Build System** - Vite with ES modules
- ✅ **Latest React 19** - Latest features and performance
- ✅ **TypeScript 5.8** - Latest type system features
- ✅ **Custom Hooks** - Extracted authentication logic
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Component Separation** - No large monolithic components
- ✅ **Reusable Components** - LoadingSpinner, etc.
- ✅ **Clean Structure** - Organized by feature

### Backend
- ✅ **Modular Architecture** - Separated concerns
- ✅ **Handler Organization** - Auth and profile handlers
- ✅ **Middleware Separation** - CORS logic isolated
- ✅ **Utility Functions** - Response helpers centralized
- ✅ **Model Definitions** - User model in separate file

## 🚀 Deployment

### Production with Docker
```bash
# Build and run production containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables for Production
```bash
# Create .env file
JWT_SECRET=your-super-secret-production-key
DB_PASSWORD=your-secure-database-password
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
docker system prune -f
docker volume prune -f

# Rebuild containers
docker-compose down
docker-compose up --build
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

### Backend
- Use **standard Go libraries** only
- Follow **Go conventions** and naming
- Keep handlers **small and focused**
- Use **proper error handling**
- Write **clear documentation**

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Review the logs** with `docker-compose logs`
3. **Ensure all prerequisites** are installed
4. **Try the clean setup** commands

For AI agents: This project uses modern TypeScript/React patterns with TanStack Query and Router, Vite build system, and a Go backend using only standard libraries. All dependencies are compatible with ES modules.
