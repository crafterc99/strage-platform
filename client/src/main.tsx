import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {CLERK_KEY ? (
      <ClerkProvider publishableKey={CLERK_KEY}>
        <AppWithProviders />
      </ClerkProvider>
    ) : (
      <AppWithProviders />
    )}
  </StrictMode>,
)
