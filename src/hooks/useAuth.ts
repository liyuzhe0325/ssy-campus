import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const useAuth = () => {
  const { user, isLoading, error, login, register, logout, loadUser, setUser } = useAuthStore()

  // 初始化时加载用户
  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    isAuthenticated: !!user,
  }
}
