import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <Spinner className="min-h-screen" />
  if (!isSignedIn) return <Navigate to="/login" replace />

  return <>{children}</>
}
