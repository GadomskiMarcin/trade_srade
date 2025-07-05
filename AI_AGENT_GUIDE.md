# 🤖 AI Agent Guide

This document provides specific information for AI agents working with this authentication application.

## 🏗️ Project Overview

This is a **full-stack authentication application** with:
- **Frontend**: React 18 + TypeScript + TanStack Query + TanStack Router
- **Backend**: Go with standard libraries + PostgreSQL + JWT
- **Infrastructure**: Docker + Docker Compose + Nginx

## 📁 Key File Locations

### Frontend (React)
```
client/src/
├── App.tsx              # Main app with routing (120 lines)
├── components/           # React components
│   ├── Login.tsx        # Login form component
│   ├── Signup.tsx       # Signup form component
│   ├── Profile.tsx      # User profile component
│   ├── Navbar.tsx       # Navigation component
│   └── LoadingSpinner.tsx # Loading component
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Authentication logic
│   └── useApi.ts        # API operations
└── types/               # TypeScript definitions
    └── api.ts           # API types and interfaces
```

### Backend (Go)
```
server/
├── main.go              # Server entry point (120 lines)
├── handlers/            # HTTP handlers
│   ├── auth.go          # Authentication handlers
│   └── profile.go       # Profile handlers
├── middleware/          # Middleware
│   └── cors.go          # CORS handling
├── models/              # Data models
│   └── user.go          # User model
└── utils/               # Utilities
    └── response.go      # Response helpers
```

## 🔧 Technology Stack

### Frontend
- **React 18.3.1** - Latest stable version
- **TypeScript 5.5.0** - Strict type checking
- **TanStack Query v5** - Server state management
- **TanStack Router v1** - Type-safe routing
- **Axios** - HTTP client
- **No legacy peer deps** - All dependencies compatible

### Backend
- **Go 1.22** - Latest stable version
- **Standard libraries only** - No external web frameworks
- **PostgreSQL** - Database with `lib/pq`
- **JWT** - Authentication with `golang-jwt`
- **bcrypt** - Password hashing

### Infrastructure
- **Docker** - Containerization
- **PostgreSQL 15** - Database
- **Nginx** - Production serving

## 🚀 Quick Start Commands

### For AI Agents
```bash
# 1. Clone and setup
git clone <repository>
cd <project-directory>
./setup.sh

# 2. Start with Docker (recommended)
docker-compose up --build

# 3. Or start locally
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000 (dev) or http://localhost (prod)
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 📝 Code Patterns

### Frontend Patterns
```typescript
// Custom hooks for reusable logic
const { user, loading, login, logout } = useAuth();
const loginMutation = useLogin();

// Type-safe API calls
const { data: user, isLoading, error } = useProfile(!!token);

// Component structure
const Component: React.FC<ComponentProps> = ({ prop }) => {
  // State and effects
  // Event handlers
  // Render JSX
};
```

### Backend Patterns
```go
// Handler structure
func handlerName(w http.ResponseWriter, r *http.Request) {
    // Validate method
    // Parse request
    // Business logic
    // Database operations
    // Response
}

// Middleware pattern
func middleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Middleware logic
        next(w, r)
    }
}
```

## 🔍 Key Features

### Authentication Flow
1. **Signup**: User creates account → Password hashed → JWT generated
2. **Login**: User authenticates → Password verified → JWT generated
3. **Profile**: JWT validated → User data returned
4. **Logout**: Token removed → State cleared

### Security Features
- **Password hashing** with bcrypt
- **JWT tokens** for authentication
- **CORS protection** for cross-origin requests
- **Input validation** on both frontend and backend
- **Type safety** throughout the application

### State Management
- **TanStack Query** for server state
- **Custom hooks** for authentication state
- **Local storage** for token persistence
- **Context-free** architecture (no React Context)

## 🛠️ Development Guidelines

### Frontend
- Use **TypeScript** for all new code
- Create **custom hooks** for reusable logic
- Keep components **small and focused** (< 100 lines)
- Use **TanStack Query** for server state
- Follow **React 18** best practices

### Backend
- Use **standard Go libraries** only
- Follow **Go conventions** and naming
- Keep handlers **small and focused**
- Use **proper error handling**
- Write **clear documentation**

### File Organization
- **Frontend**: Organize by feature (components, hooks, types)
- **Backend**: Organize by responsibility (handlers, middleware, utils)
- **Keep files small** (< 200 lines)
- **Single responsibility** principle

## 🔧 Common Tasks

### Adding New Features
1. **Frontend**: Create component → Add types → Create hook → Add route
2. **Backend**: Create handler → Add model → Add route → Test

### Debugging
```bash
# Frontend logs
npm run dev

# Backend logs
cd server && go run main.go

# Docker logs
docker-compose logs -f

# Database logs
docker logs auth_postgres
```

### Testing
```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && go test ./...
```

## 📚 Important Notes for AI Agents

1. **No legacy peer deps** - All dependencies are compatible
2. **Modular structure** - Code is well-organized and separated
3. **Type safety** - Full TypeScript coverage
4. **Standard libraries** - Go backend uses only standard libraries
5. **Docker-ready** - Complete containerization setup
6. **Production-ready** - Includes Nginx and optimized builds

## 🚨 Common Issues

### Frontend Issues
- **TypeScript errors**: Check types in `client/src/types/api.ts`
- **Build errors**: Run `npm install` in client directory
- **Runtime errors**: Check browser console and network tab

### Backend Issues
- **Database connection**: Ensure PostgreSQL is running
- **Port conflicts**: Check if port 8080 is available
- **Import errors**: Run `go mod tidy` in server directory

### Docker Issues
- **Build failures**: Run `docker system prune` and rebuild
- **Port conflicts**: Stop existing containers
- **Volume issues**: Run `docker volume prune`

## 🎯 Best Practices for AI Agents

1. **Always check existing code** before making changes
2. **Follow the established patterns** in the codebase
3. **Use TypeScript** for all frontend changes
4. **Use standard Go libraries** for backend changes
5. **Test your changes** before suggesting them
6. **Keep files small** and focused on single responsibilities
7. **Document your changes** with clear commit messages

This project is well-structured and follows modern best practices. The modular architecture makes it easy to understand and extend. 