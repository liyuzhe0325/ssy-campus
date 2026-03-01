import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getArticleList } from '@/services/articleService'
import ContentCard from '@/components/common/ContentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { PlusIcon } from '@heroicons/react/24/outline'

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('recommend')
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [clickLock, setClickLock] = useState(false)

  const { data: articleList = [], isLoading, error } = useQuery({
    queryKey: ['homeArticleList'],
    queryFn: () => getArticleList({ page: 1, pageSize: 10 }),
    enabled: !!user,
    retry: 1
  })

  const tabList = [
    { id: 'recommend', name: '推荐' },
    { id: 'school', name: '校内' },
    { id: 'study', name: '学习' },
    { id: 'exam', name: '备考' },
    { id: 'major', name: '专业' },
  ]

  const handleNav = useCallback((path: string) => {
    if (clickLock) return
    setClickLock(true)
    navigate(path)
    setTimeout(() => setClickLock(false), 600)
  }, [navigate, clickLock])

  const safeDate = (dateStr?: string) => {
    try {
      return dateStr ? new Date(dateStr).toLocaleDateString() : '未知时间'
    } catch {
      return '未知时间'
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white">
          你好，{user?.username || '同学'}！
        </h1>
        <p className="text-gray-400 text-sm">省实验 | 在校生互助·毕业生传承·一站式成长</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">校园互助问答</h3>
          <p className="text-gray-400 text-sm">问学习、问班级、问备考、问校内事务，学长学姐实时解答</p>
          <Button variant="primary" className="mt-4 w-full bg-blue-600 hover:bg-blue-500" onClick={() => handleNav('/questions')}>
            去提问
          </Button>
        </div>

        <div className="bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">经验资料文库</h3>
          <p className="text-gray-400 text-sm">备考笔记、学习方法、复习资料、校内经验、志愿参考</p>
          <Button variant="primary" className="mt-4 w-full bg-purple-600 hover:bg-purple-500" onClick={() => handleNav('/articles')}>
            看资料
          </Button>
        </div>

        <div className="md:col-span-2 bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">成长学业中心</h3>
          <p className="text-gray-400 text-sm">选科建议、学业规划、校内发展、方向定位、未来专业适配（在校生专属）</p>
          <Button variant="primary" className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500" onClick={() => handleNav('/career-plan')}>
            开始规划
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 min-w-max pb-2">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 flex justify-center"><Loading /></div>
      ) : error ? (
        <div className="py-10 text-center text-gray-400">
          <p>加载失败，请稍后重试</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>刷新页面</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {articleList.map((article) => (
            <ContentCard
              key={article.id}
              data={{
                id: article.id,
                title: article.title,
                summary: article.summary || article.content.substring(0, 100),
                author: {
                  id: article.author_id,
                  username: article.profiles?.username || '同学',
                  avatar: article.profiles?.avatar || '',
                  tag: article.profiles?.grade || '省实验在校生'
                },
                tags: article.tags || [],
                viewCount: article.view_count || 0,
                likeCount: article.like_count || 0,
                commentCount: article.comment_count || 0,
                createdAt: safeDate(article.created_at)
              }}
            />
          ))}

          {articleList.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-500">暂无内容，快来分享你的学习与校园经验吧～</p>
              <Button variant="primary" className="mt-4" onClick={() => handleNav('/article/new')}>发布经验</Button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setPublishModalOpen(true)}
        disabled={clickLock}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all z-30 disabled:opacity-60"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <Modal isOpen={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="选择发布类型">
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-[#1A1F29] border-gray-800"
            onClick={() => { setPublishModalOpen(false); handleNav('/article/new') }}>
            <span className="text-xl">📝</span><span>发经验</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-[#1A1F29] border-gray-800"
            onClick={() => { setPublishModalOpen(false); handleNav('/questions') }}>
            <span className="text-xl">❓</span><span>提问题</span>
          </Button>
        </div>
        <Button variant="ghost" fullWidth className="mt-4" onClick={() => setPublishModalOpen(false)}>取消</Button>
      </Modal>
    </div>
  )
}

export default HomePage
