import { useState, useEffect } from 'react'
import { Message } from '@/types'
import { getMessages, sendMessage, markMessagesAsRead, subscribeToMessages } from '@/services/messageService'
import { useAuth } from './useAuth'

export const useMessages = (otherUserId: string) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user || !otherUserId) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const data = await getMessages(user.id, otherUserId)
        setMessages(data)
        await markMessagesAsRead(otherUserId, user.id)
      } catch (error) {
        console.error('Load messages error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    const subscription = subscribeToMessages(user.id, (newMessage) => {
      if (
        (newMessage.from_id === otherUserId && newMessage.to_id === user.id) ||
        (newMessage.from_id === user.id && newMessage.to_id === otherUserId)
      ) {
        setMessages((prev) => [...prev, newMessage])
        if (newMessage.from_id === otherUserId) {
          markMessagesAsRead(otherUserId, user.id).catch(console.error)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user, otherUserId])

  const send = async (content: string) => {
    if (!user || !content.trim()) return
    setSending(true)
    try {
      const newMsg = await sendMessage(user.id, otherUserId, content)
      setMessages((prev) => [...prev, newMsg])
    } catch (error) {
      console.error('Send message error:', error)
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, sending, send }
}
