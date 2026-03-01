import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getArticleList } from '@/services/articleService'
import ContentCard from '@/components/common/ContentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

const HomePage = () => {
  const { user, profile, theme } = useAuth()
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
    if (theme === 'interest') return `${timeGreeting}，${profile?.nickname || '同学'}！今天想去哪里玩？`
    if (theme === 'private') return `${timeGreeting}，${profile?.nickname || '同学'}！树洞永远为你开放。`
    return `${timeGreeting}，${profile?.nickname || '同学'}！今天也要加油哦～`
  }

  return (
    <div className="global-container space-y-8">
      <div className="global-card bg-gradient-to-br from-dark-800 to-dark-900 p-8">
        <h1 className="text-3xl font-bold text-text-primary">
          {getGreeting()}
        </h1>
        <p className="text-text-secondary mt-2">省实验 | 在校生互助·毕业生传承·一站式成长</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="global-card">
          <div className={`w-12 h-12 bg-${theme}-500/20 rounded-xl flex items-center justify-center mb-4`}>
            <ChatBubbleLeftRightIcon className={`w-6 h-6 text-${theme}-500`} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">校园互助问答</h3>
          <p className="text-text-secondary text-sm">问学习、问班级、问备考、问校内事务，学长学姐实时解答</p>
          <Button variant={theme as any} className="mt-4 w-full" onClick={() => handleNav('/questions')}>
            去提问
          </Button>
        </div>

        <div className="global-card">
          <div className={`w-12 h-12 bg-${theme}-500/20 rounded-xl flex items-center justify-center mb-4`}>
            <AcademicCapIcon className={`w-6 h-6 text-${theme}-500`} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">经验资料文库</h3>
          <p className="text-text-secondary text-sm">备考笔记、学习方法、复习资料、校内经验、志愿参考</p>
          <Button variant={theme as any} className="mt-4 w-full" onClick={() => handleNav('/articles')}>
            看资料
          </Button>
        </div>

        <div className="global-card md:col-span-2">
          <div className={`w-12 h-12 bg-${theme}-500/20 rounded-xl flex items-center justify-center mb-4`}>
            <SparklesIcon className={`w-6 h-6 text-${theme}-500`} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">成长学业中心</h3>
          <p className="text-text-secondary text-sm">选科建议、学业规划、校内发展、方向定位、未来专业适配</p>
          <Button variant={theme as any} className="mt-4 w-full" onClick={() => handleNav('/career-plan')}>
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
                activeTab === tab.id 
                  ? `text-${theme}-500 border-b-2 border-${theme}-500` 
                  : 'text-text-secondary hover:text-text-primary'
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
        <div className="py-10 text-center text-text-secondary">
          <p>加载失败，请稍后重试</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
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
            <div className="global-card text-center py-10 text-text-secondary">
              <p>暂无内容，快来分享你的学习与校园经验吧～</p>
              <Button variant={theme as any} className="mt-4" onClick={() => handleNav('/article/new')}>
                发布经验
              </Button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setPublishModalOpen(true)}
        disabled={clickLock}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-${theme}-500 text-white flex items-center justify-center shadow-lg shadow-${theme}-500/20 hover:bg-${theme}-600 transition-all z-30 disabled:opacity-60`}
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <Modal isOpen={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="选择发布类型">
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-dark-800 border-dark-700"
            onClick={() => { setPublishModalOpen(false); handleNav('/article/new') }}>
            <PencilSquareIcon className={`w-5 h-5 text-${theme}-500`} />
            <span>发经验</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-dark-800 border-dark-700"
            onClick={() => { setPublishModalOpen(false); handleNav('/question/new') }}>
            <QuestionMarkCircleIcon className={`w-5 h-5 text-${theme}-500`} />
            <span>提问题</span>
          </Button>
        </div>
        <Button variant="ghost" fullWidth className="mt-4" onClick={() => setPublishModalOpen(false)}>取消</Button>
      </Modal>
    </div>
  )
}

export default HomePage
