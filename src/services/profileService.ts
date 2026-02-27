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
          // 1. 调用 Supabase 登录
          await signIn(email, password)
          // 2. 获取最新的用户资料（包括 profiles 表中的数据）
          const user = await getCurrentUser()
          // 3. 更新 Zustand 状态
          set({ user, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          // 4. 重新抛出错误，让调用者知道登录失败
          throw error
        }
      },

      register: async (email, password, username) => {
        set({ isLoading: true, error: null })
        try {
          await signUp(email, password, username)
          set({ isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await signOut()
          set({ user: null, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
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
