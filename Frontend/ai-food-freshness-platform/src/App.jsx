import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0c1e33',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(16px)',
              fontSize: '0.875rem',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
