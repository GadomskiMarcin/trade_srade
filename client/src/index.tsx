import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import App from './App';
import { config } from './config';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Create a router
const router = createRouter({
  routeTree: App,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
});

// Error boundary component for configuration errors
function ConfigurationError({ error }: { error: Error }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f7fafc',
      color: '#2d3748'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{ color: '#e53e3e', marginBottom: '20px' }}>Configuration Error</h1>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          The application failed to start due to missing or invalid environment variables.
        </p>
        <div style={{
          backgroundColor: '#fed7d7',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'left',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error.message}
        </div>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          Please check your environment configuration and restart the application.
        </p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Wrap the app in error boundary for configuration errors
try {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
} catch (error) {
  if (error instanceof Error) {
    root.render(<ConfigurationError error={error} />);
  } else {
    root.render(<ConfigurationError error={new Error('Unknown configuration error')} />);
  }
} 