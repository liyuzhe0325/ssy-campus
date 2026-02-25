import { supabase } from '@/config/supabase'
import { Profile } from '@/types'

export const followUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
  if (error) throw error
}

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .match({ follower_id: followerId, following_id: followingId })
  if (error) throw error
}

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .match({ follower_id: followerId, following_id: followingId })
  if (error) throw error
  return count ? count > 0 : false
}

export const getFollowing = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('following:profiles!following_id(*)')
    .eq('follower_id', userId)

  if (error) throw error
  return data.map(item => item.following as unknown as Profile)
}

export const getFollowers = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('follower:profiles!follower_id(*)')
    .eq('following_id', userId)

  if (error) throw error
  return data.map(item => item.follower as unknown as Profile)
}
