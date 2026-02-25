import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { getConversations } from '@/services/messageService'
import Loading from '@/components/common/Loading'
import ChatWindow from '@/components/messages/ChatWindow'

const MessagesPage = () => {
  const { user } = useAuth()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations(user!.id),
    enabled: !!user,
  })

  if (isLoading) return <Loading />

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">消息</h2>
        </div>
        {conversations?.map((conv) => (
          <div
            key={conv.otherUser.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              selectedUserId === conv.otherUser.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => setSelectedUserId(conv.otherUser.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {conv.otherUser.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{conv.otherUser.username}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(conv.lastMessage.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1">
        {selectedUserId ? (
          <ChatWindow otherUserId={selectedUserId} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            选择一个对话开始聊天
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPage
