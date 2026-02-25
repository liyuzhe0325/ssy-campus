import { supabase } from '@/config/supabase'
import { Message, Conversation } from '@/types'
import { RealtimeChannel } from '@supabase/supabase-js'

export const sendMessage = async (fromId: string, toId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      from_id: fromId,
      to_id: toId,
      content,
      read: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_id.eq.${userId1},to_id.eq.${userId2}),and(from_id.eq.${userId2},to_id.eq.${userId1})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const markMessagesAsRead = async (fromId: string, toId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .match({ from_id: fromId, to_id: toId, read: false })
  if (error) throw error
}

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, from:from_id(*), to:to_id(*)')
    .or(`from_id.eq.${userId},to_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error

  const conversationsMap = new Map<string, Conversation>()
  for (const msg of data) {
    const otherUser = msg.from_id === userId ? msg.to : msg.from
    if (!conversationsMap.has(otherUser.id)) {
      const unreadCount = data.filter(
        (m) => m.from_id === otherUser.id && m.to_id === userId && !m.read
      ).length

      conversationsMap.set(otherUser.id, {
        otherUser,
        lastMessage: msg,
        unreadCount,
      })
    }
  }

  return Array.from(conversationsMap.values())
}

export const subscribeToMessages = (
  userId: string,
  callback: (message: Message) => void
): RealtimeChannel => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(from_id=eq.${userId}),and(to_id=eq.${userId}))`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}
