import React, { useState, useRef, useEffect } from 'react'
import { useMessages } from '@/hooks/useMessages'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

interface ChatWindowProps {
  otherUserId: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ otherUserId }) => {
  const { user } = useAuth()
  const { messages, loading, sending, send } = useMessages(otherUserId)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: otherUser } = useQuery({
    queryKey: ['profile', otherUserId],
    queryFn: () => getProfile(otherUserId),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await send(newMessage)
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
          {otherUser?.username?.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium">{otherUser?.username}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.from_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isMe
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-primary-100' : 'text-gray-500'}`}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入消息..."
          disabled={sending}
        />
        <Button type="submit" disabled={!newMessage.trim() || sending} isLoading={sending}>
          发送
        </Button>
      </form>
    </div>
  )
}

export default ChatWindow
