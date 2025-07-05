# 🤖 AI Agent Guide - FurnitureHub

This guide helps AI agents understand and work with the FurnitureHub project - a Polish furniture marketplace built with React 19, TypeScript, Go, and PostgreSQL.

## 📋 Project Overview

**FurnitureHub** is a full-stack furniture marketplace application featuring:
- **Frontend**: React 19 + TypeScript + Vite with HMR
- **Backend**: Go with PostgreSQL
- **Authentication**: JWT-based with guest user support
- **Furniture Listings**: Polish location-based furniture items
- **Development**: Docker Compose with Hot Module Replacement

## 🏗️ Architecture Patterns

### Frontend Architecture
```
client/src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main furniture marketplace
│   ├── Login.tsx       # Authentication form
│   ├── Signup.tsx      # Registration form
│   ├── Profile.tsx     # User profile
│   ├── Navbar.tsx      # Navigation component
│   └── LoadingSpinner.tsx # Loading indicator
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication state management
│   └── useApi.ts       # API calls with TanStack Query
├── types/              # TypeScript definitions
│   └── api.ts          # API types and interfaces
├── styles/             # Modular CSS files
│   ├── base.css        # Global styles
│   ├── auth.css        # Authentication styles
│   ├── dashboard.css   # Dashboard styles
│   ├── navbar.css      # Navigation styles
│   ├── profile.css     # Profile styles
│   └── loading.css     # Loading styles
└── App.tsx             # Main app with routing
```

### Backend Architecture
```
server/
├── handlers/           # HTTP request handlers
│   ├── auth.go        # Authentication endpoints
│   └── profile.go     # User profile endpoints
├── middleware/         # HTTP middleware
│   └── cors.go        # CORS handling
├── models/            # Data models
│   └── user.go        # User model
├── utils/             # Utility functions
│   └── response.go    # Response helpers
└── main.go            # Server entry point
```

## 🔧 Development Setup

### Quick Start Commands
```bash
# Development with HMR
./dev.sh

# Production
./prod.sh

# Cleanup
./clean.sh
```

### Docker Services
- **auth_frontend**: React dev server with HMR (port 3000)
- **auth_backend**: Go API server (port 8080)
- **auth_postgres**: PostgreSQL database (port 5433)

## 📝 Key Development Patterns

### 1. Authentication Flow
```typescript
// Frontend authentication with TanStack Query
const loginMutation = useLogin({
  onSuccess: (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    queryClient.setQueryData(['user'], data.user);
    login(data.user, data.token);
    navigate({ to: '/dashboard' });
  },
});
```

### 2. API Hooks Pattern
```typescript
// Custom hooks for API calls
export const useLogin = (options?: { onSuccess?: (data: AuthResponse) => void }) => {
  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: api.login,
    onSuccess: options?.onSuccess,
  });
};
```

### 3. Modular CSS Structure
```typescript
// Component-specific CSS imports
import '../styles/auth.css';
import '../styles/dashboard.css';
import '../styles/navbar.css';
```

### 4. TypeScript Interfaces
```typescript
interface Furniture {
  id: string;
  title: string;
  url: string;
  tags: string[];
  seller: string;
  location: string;
}
```

## 🪑 Furniture Marketplace Features

### Data Structure
- **Furniture Items**: 12 items with Polish locations
- **Categories**: Sofa, Chair, Table, Bed, Wardrobe, Desk, Cabinet, Lighting
- **Locations**: Polish cities with voivodeships (e.g., "Warszawa, Mazowieckie")
- **Images**: High-quality Unsplash furniture photos

### Filtering System
```typescript
const filteredFurniture = selectedTags.length > 0
  ? mockFurniture.filter(furniture => 
      furniture.tags.some(tag => selectedTags.includes(tag))
    )
  : mockFurniture;
```

### Polish Location Display
```typescript
<p className="picture-location">{furniture.location}</p>
// CSS: .picture-location with location pin emoji (📍)
```

## 🔄 Hot Module Replacement (HMR)

### Development Benefits
- **Instant Updates**: Code changes reflect immediately
- **State Preservation**: Component state maintained during updates
- **Fast Iteration**: No full rebuilds required

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
});
```

## 🎨 Styling Patterns

### Modular CSS Structure
```css
/* Component-specific styles */
.auth-container { /* Authentication styles */ }
.dashboard { /* Dashboard layout */ }
.navbar { /* Navigation styles */ }
```

### Mobile-First Design
```css
/* Responsive breakpoints */
@media (max-width: 768px) { /* Tablet styles */ }
@media (max-width: 480px) { /* Mobile styles */ }
```

### CSS Custom Properties
```css
.tag-btn {
  background: var(--tag-color);
}
```

## 🔐 Authentication Patterns

### JWT Token Management
```typescript
// Token storage and axios configuration
localStorage.setItem('token', data.token);
axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
```

### Guest User Support
```typescript
// Temporary user creation
const temporaryUserMutation = useTemporaryUser({
  onSuccess: (data: AuthResponse) => {
    // Handle guest user authentication
  },
});
```

### Auto-Redirect Logic
```typescript
// Automatic redirection after authentication
React.useEffect(() => {
  if (token) {
    navigate({ to: '/dashboard' });
  }
}, [token, navigate]);
```

## 🐳 Docker Patterns

### Development vs Production
```yaml
# docker-compose.dev.yml - Development with HMR
frontend:
  volumes:
    - ./client:/app
    - /app/node_modules
  command: sh -c "npm install && npm run dev -- --host 0.0.0.0 --port 3000"

# docker-compose.yml - Production with Nginx
frontend:
  build:
    dockerfile: Dockerfile.frontend
```

### Volume Mounting
- **Development**: Source code mounted for HMR
- **Production**: Built application served by Nginx

## 📊 State Management

### TanStack Query Integration
```typescript
// Server state management
const { data: user, isLoading, error } = useProfile(!!token);
```

### Local State with React Hooks
```typescript
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [isSearchOpen, setIsSearchOpen] = useState(false);
```

### Custom Auth Hook
```typescript
const { user, loading, logout } = useAuth();
```

## 🔍 Common Development Tasks

### Adding New Components
1. Create component in `client/src/components/`
2. Add TypeScript interfaces in `client/src/types/api.ts`
3. Create CSS module in `client/src/styles/`
4. Import and use in `App.tsx`

### Adding New API Endpoints
1. Add handler in `server/handlers/`
2. Update routes in `server/main.go`
3. Create API hook in `client/src/hooks/useApi.ts`
4. Add TypeScript types in `client/src/types/api.ts`

### Adding New Furniture Items
1. Update `mockFurniture` array in `Dashboard.tsx`
2. Add Polish location and seller information
3. Use Unsplash furniture image URL
4. Add appropriate tags for filtering

### Styling New Components
1. Create CSS file in `client/src/styles/`
2. Import in component: `import '../styles/component.css'`
3. Follow mobile-first responsive design
4. Use CSS custom properties for theming

## 🚨 Error Handling Patterns

### Frontend Error Handling
```typescript
try {
  await onLogin.mutateAsync(formData);
} catch (error: any) {
  setError(error.response?.data?.error || 'Login failed');
}
```

### Backend Error Handling
```go
func handleError(w http.ResponseWriter, message string, status int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(map[string]string{"error": message})
}
```

## 🧪 Testing Considerations

### Frontend Testing
- Use Vitest for unit testing
- Test custom hooks with React Testing Library
- Mock API calls for component testing

### Backend Testing
- Use Go's built-in testing package
- Test handlers with `httptest` package
- Mock database for isolated testing

## 📱 Responsive Design Patterns

### Mobile-First Approach
```css
/* Base mobile styles */
.pictures-grid {
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .pictures-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
```

### Touch-Friendly Interactions
```css
/* Minimum touch target size */
.tag-btn {
  min-height: 44px;
  padding: 8px 16px;
}
```

## 🔄 Development Workflow

### Making Changes
1. **Frontend Changes**: Edit files in `client/src/` - HMR will update automatically
2. **Backend Changes**: Restart backend container or use `go run main.go` locally
3. **Database Changes**: Update models and restart backend

### Debugging
1. **Frontend**: Use browser dev tools and React DevTools
2. **Backend**: Check Docker logs: `docker-compose logs backend`
3. **Database**: Connect to PostgreSQL: `docker exec -it auth_postgres psql -U postgres -d auth_app`

### Performance Optimization
1. **Frontend**: Use React.memo for expensive components
2. **Images**: Optimize with proper sizing and lazy loading
3. **API**: Implement caching with TanStack Query
4. **Database**: Add indexes for frequently queried fields

## 🎯 Best Practices for AI Agents

### Code Style
- Use **TypeScript** for all frontend code
- Follow **React 19** patterns and hooks
- Use **modular CSS** for styling
- Implement **mobile-first** responsive design

### Architecture
- Keep components **small and focused**
- Use **custom hooks** for reusable logic
- Implement **proper error handling**
- Follow **Go conventions** for backend

### Development
- Use **HMR** for fast iteration
- Test changes in **development environment**
- Follow **Docker patterns** for deployment
- Maintain **type safety** throughout

### Polish Localization
- Use **Polish city names** and **voivodeships**
- Display **location pin emoji** (📍)
- Follow **Polish naming conventions**
- Consider **Polish time zones** and **date formats**

This guide should help AI agents understand and work effectively with the FurnitureHub project structure and development patterns. 