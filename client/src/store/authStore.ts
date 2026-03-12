import { create } from 'zustand'
import type { User } from '@/types'
import { api } from '@/lib/api'

interface AuthState {
  dbUser: User | null
  isLoading: boolean
  setDbUser: (user: User | null) => void
  fetchDbUser: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  dbUser: null,
  isLoading: false,
  setDbUser: (user) => set({ dbUser: user }),
  fetchDbUser: async () => {
    set({ isLoading: true })
    try {
      const user = await api.get<User>('/api/auth/me')
      set({ dbUser: user, isLoading: false })
    } catch {
      set({ dbUser: null, isLoading: false })
    }
  },
  clearUser: () => set({ dbUser: null }),
}))
