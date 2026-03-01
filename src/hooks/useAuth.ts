import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/config/supabase'
import { getProfileByUserId } from '@/services/profileService'

export const useAuth = () => {
  const { user, profile, isLoading, setUser, setProfile, setIsLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && mounted) {
          setUser(user)
          const profile = await getProfileByUserId(user.id)
          setProfile(profile)
        }
      } catch (error) {
        console.error('Auth init error:', error)
        clearAuth()
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        const profile = await getProfileByUserId(session.user.id)
        setProfile(profile)
        setIsLoading(false)
      } else if (event === 'SIGNED_OUT') {
        clearAuth()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setIsLoading, clearAuth])

  // 计算用户主题（基于兴趣标签，用于动态UI）
  const getTheme = () => {
    if (!profile?.interests) return 'learning'
    const interests = profile.interests as string[]
    if (interests.some(i => ['篮球', '社团', '游戏'].includes(i))) return 'interest'
    if (interests.some(i => ['树洞', '匿名'].includes(i))) return 'private'
    return 'learning'
  }

  const isAdmin = profile?.is_admin || false

  return {
    user,
    profile,
    isLoading,
    isAdmin,
    theme: getTheme(),
  }
}
