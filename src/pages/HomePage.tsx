import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState('recommend')
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  // 原有文章接口完全保留
  const { data: articleList, isLoading } = useQuery({
    queryKey: ['homeArticleList'],
    queryFn: () => getArticleList({ page: 1, pageSize: 10 }),
    enabled: !!user,
  })

  const tabList = [
    { id: 'recommend', name: '推荐' },
    { id: 'school', name: '校内' },
    { id: 'study', name: '学习' },
    { id: 'exam', name: '备考' },
    { id: 'major', name: '专业' },
  ]

  return (
    <div className="space-y-8">
      {/* 欢迎语｜在校生为主 */}
      <div className="space-y-2">
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white">
          你好，{user?.username || '同学'}！
        </h1>
        <p className="text-gray-400 text-sm">省实验 | 在校生互助·毕业生传承·一站式成长</p>
      </div>

      {/* ================= 三大核心板块｜在校生优先 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1｜校园互助问答（在校生最高频） */}
        <div className="bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">校园互助问答</h3>
          <p className="text-gray-400 text-sm">问学习、问班级、问备考、问校内事务，学长学姐实时解答</p>
          <Button variant="primary" className="mt-4 w-full bg-blue-600 hover:bg-blue-500">
            去提问
          </Button>
        </div>

        {/* 2｜经验资料文库（核心内容） */}
        <div className="bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">经验资料文库</h3>
          <p className="text-gray-400 text-sm">备考笔记、学习方法、复习资料、校内经验、志愿参考</p>
          <Button variant="primary" className="mt-4 w-full bg-purple-600 hover:bg-purple-500">
            看资料
          </Button>
        </div>

        {/* 3｜成长学业中心（通栏｜适配在校生） */}
        <div className="md:col-span-2 bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">成长学业中心</h3>
          <p className="text-gray-400 text-sm">选科建议、学业规划、校内发展、方向定位、未来专业适配（在校生专属）</p>
          <Button variant="primary" className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500">
            开始规划
          </Button>
        </div>
      </div>

      {/* 内容标签｜贴合在校生 */}
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

      {/* 原有文章流｜不抢核心视觉 */}
      {isLoading ? (
        <div className="py-10 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          {articleList?.map((article) => (
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
                createdAt: new Date(article.created_at).toLocaleDateString()
              }}
            />
          ))}

          {articleList?.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-500">暂无内容，快来分享你的学习与校园经验吧～</p>
              <Button variant="primary" className="mt-4" onClick={() => window.location.href = '/article/new'}>
                发布经验
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 悬浮发布按钮 */}
      <button
        onClick={() => setPublishModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all z-30"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* 发布弹窗 */}
      <Modal isOpen={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="选择发布类型">
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-[#1A1F29] border-gray-800"
            onClick={() => { setPublishModalOpen(false); window.location.href = '/article/new' }}>
            <span className="text-xl">📝</span><span>发经验</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1 bg-[#1A1F29] border-gray-800">
            <span className="text-xl">❓</span><span>提问题</span>
          </Button>
        </div>
        <Button variant="ghost" fullWidth className="mt-4" onClick={() => setPublishModalOpen(false)}>取消</Button>
      </Modal>
    </div>
  )
}

export default HomePage
