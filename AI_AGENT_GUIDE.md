# 🤖 AI Agent Guide

This document provides specific information for AI agents working with this authentication application.

## 🏗️ Project Overview

This is a **full-stack authentication application** with:
- **Frontend**: React 19 + TypeScript + Vite + TanStack Query + TanStack Router
- **Backend**: Go with standard libraries + PostgreSQL + JWT
- **Infrastructure**: Docker + Docker Compose + Nginx

## 📁 Key File Locations

### Frontend (React 19 + Vite)
```
client/
├── src/
│   ├── App.tsx              # Main app with routing (120 lines)
│   ├── components/           # React components
│   │   ├── Login.tsx        # Login form component
│   │   ├── Signup.tsx       # Signup form component
│   │   ├── Profile.tsx      # User profile component
│   │   ├── Navbar.tsx       # Navigation component
│   │   └── LoadingSpinner.tsx # Loading component
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts       # Authentication logic
│   │   └── useApi.ts        # API operations
│   └── types/               # TypeScript definitions
│       └── api.ts           # API types and interfaces
├── package.json             # Dependencies with ES modules
├── tsconfig.json            # TypeScript 5.8 config
├── vite.config.ts           # Vite configuration
└── index.html               # Entry HTML
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
- **React 19.1.0** - Latest React version
- **TypeScript 5.8.3** - Latest type system
- **Vite 5.4.10** - Modern build tool with ES modules
- **TanStack Query v5.81.5** - Server state management
- **TanStack Router v1.125.0** - Type-safe routing
- **Axios 1.10.0** - HTTP client
- **ES Modules** - Modern JavaScript modules

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

### Frontend Patterns (ES Modules)
```typescript
// ES module imports
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useLogin } from './hooks/useApi';

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

### Modern Build System
- **Vite** - Fast development and build
- **ES Modules** - Modern JavaScript modules
- **TypeScript 5.8** - Latest type system features
- **Hot Module Replacement** - Instant updates

## 🛠️ Development Guidelines

### Frontend
- Use **TypeScript 5.8** for all new code
- Use **ES modules** for imports/exports
- Create **custom hooks** for reusable logic
- Keep components **small and focused** (< 100 lines)
- Use **TanStack Query** for server state
- Follow **React 19** best practices

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

1. **ES Modules** - All imports use modern ES module syntax
2. **Vite Build System** - Fast development with HMR
3. **React 19** - Latest React features and performance
4. **TypeScript 5.8** - Latest type system features
5. **Modular structure** - Code is well-organized and separated
6. **Type safety** - Full TypeScript coverage
7. **Standard libraries** - Go backend uses only standard libraries
8. **Docker-ready** - Complete containerization setup
9. **Production-ready** - Includes Nginx and optimized builds

## 🚨 Common Issues

### Frontend Issues
- **TypeScript errors**: Check types in `client/src/types/api.ts`
- **Build errors**: Run `npm install` in client directory
- **Runtime errors**: Check browser console and network tab
- **Vite issues**: Check `vite.config.ts` configuration

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
3. **Use TypeScript 5.8** for all frontend changes
4. **Use ES modules** for imports/exports
5. **Use standard Go libraries** for backend changes
6. **Test your changes** before suggesting them
7. **Keep files small** and focused on single responsibilities
8. **Document your changes** with clear commit messages
9. **Use Vite** for fast development and builds

This project uses the latest modern technologies with ES modules, React 19, TypeScript 5.8, and Vite for optimal performance and developer experience. 