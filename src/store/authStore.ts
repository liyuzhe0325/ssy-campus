import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SessionUser } from '@/types'
import { getCurrentUser, signIn, signOut, signUp } from '@/services/authService'

interface AuthState {
  user: SessionUser | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  setUser: (user: SessionUser | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          await signIn(email, password)
          const user = await getCurrentUser()
          set({ user, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      register: async (email, password, username) => {
        set({ isLoading: true, error: null })
        try {
          await signUp(email, password, username)
          set({ isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await signOut()
          set({ user: null, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      loadUser: async () => {
        set({ isLoading: true })
        try {
          const user = await getCurrentUser()
          set({ user, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
