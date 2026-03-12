import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { dbUser, isLoading } = useAuthStore()

  if (isLoading) return <Spinner className="min-h-screen" />
  if (!dbUser || dbUser.role !== 'ADMIN') return <Navigate to="/portal" replace />

  return <>{children}</>
}
