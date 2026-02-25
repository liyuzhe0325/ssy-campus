import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const useAuth = () => {
  const { user, isLoading, error, login, register, logout, loadUser, setUser } = useAuthStore()

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
