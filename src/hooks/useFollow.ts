import { useState, useEffect } from 'react'
import { followUser, unfollowUser, isFollowing } from '@/services/followService'
import { useAuth } from './useAuth'

export const useFollow = (targetUserId: string) => {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !targetUserId) return
    const checkFollow = async () => {
      const result = await isFollowing(user.id, targetUserId)
      setFollowing(result)
    }
    checkFollow()
  }, [user, targetUserId])

  const toggleFollow = async () => {
    if (!user) return
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(user.id, targetUserId)
        setFollowing(false)
      } else {
        await followUser(user.id, targetUserId)
        setFollowing(true)
      }
    } catch (error) {
      console.error('Follow toggle error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { following, loading, toggleFollow }
}
