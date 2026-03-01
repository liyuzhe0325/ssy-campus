import { Routes, Route, Navigate, lazy, Suspense } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/common/Loading'

// 首屏直接引入的页面
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'

// ========== 懒加载页面（根据你现有的文件调整） ==========
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'))          // 文章列表
// const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage')) // 文章详情（暂时没有）
// const ArticlePublishPage = lazy(() => import('@/pages/ArticlePublishPage')) // 发布文章（暂时没有）

const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'))        // 问答列表
const QuestionDetailPage = lazy(() => import('@/pages/QuestionDetailPage')) // 问答详情
const QuestionPublishPage = lazy(() => import('@/pages/QuestionPublishPage')) // 发起提问（如果存在？）

const DynamicsPage = lazy(() => import('@/pages/DynamicsPage'))          // 校园动态

const PostsPage = lazy(() => import('@/pages/PostsPage'))                // 贴吧列表
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'))      // 帖子详情
const PostPublishPage = lazy(() => import('@/pages/PostPublishPage'))    // 发布帖子

const TreeholePage = lazy(() => import('@/pages/TreeholePage'))          // 树洞列表
const TreeholeDetailPage = lazy(() => import('@/pages/TreeholeDetailPage')) // 树洞详情
const TreeholePublishPage = lazy(() => import('@/pages/TreeholePublishPage')) // 匿名发帖

const NewsPage = lazy(() => import('@/pages/NewsPage'))                  // 新闻列表
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'))      // 新闻详情

const TagPage = lazy(() => import('@/pages/TagPage'))                    // 标签详情
const SearchPage = lazy(() => import('@/pages/SearchPage'))              // 全局搜索

const CareerPlanPage = lazy(() => import('@/pages/CareerPlanPage'))      // 学业规划
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))            // 个人主页
const MessagesPage = lazy(() => import('@/pages/MessagesPage'))          // 私信

// ========== 登录守卫 ==========
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const LazyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loading size="lg" />
      </div>
    }>
      {children}
    </Suspense>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* 首页 */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* 文章模块：只有列表页存在，详情和发布暂时注释 */}
        <Route path="/articles" element={<ProtectedRoute><LazyWrapper><ArticlesPage /></LazyWrapper></ProtectedRoute>} />
        {/* <Route path="/article/:id" element={<ProtectedRoute><LazyWrapper><ArticleDetailPage /></LazyWrapper></ProtectedRoute>} /> */}
        {/* <Route path="/article/new" element={<ProtectedRoute><LazyWrapper><ArticlePublishPage /></LazyWrapper></ProtectedRoute>} /> */}

        {/* 问答模块：假设都存在 */}
        <Route path="/questions" element={<ProtectedRoute><LazyWrapper><QuestionsPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/question/:id" element={<ProtectedRoute><LazyWrapper><QuestionDetailPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/question/new" element={<ProtectedRoute><LazyWrapper><QuestionPublishPage /></LazyWrapper></ProtectedRoute>} />

        {/* 动态模块 */}
        <Route path="/dynamics" element={<ProtectedRoute><LazyWrapper><DynamicsPage /></LazyWrapper></ProtectedRoute>} />

        {/* 贴吧模块 */}
        <Route path="/posts" element={<ProtectedRoute><LazyWrapper><PostsPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><LazyWrapper><PostDetailPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/post/new" element={<ProtectedRoute><LazyWrapper><PostPublishPage /></LazyWrapper></ProtectedRoute>} />

        {/* 树洞模块 */}
        <Route path="/treehole" element={<ProtectedRoute><LazyWrapper><TreeholePage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/treehole/:id" element={<ProtectedRoute><LazyWrapper><TreeholeDetailPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/treehole/new" element={<ProtectedRoute><LazyWrapper><TreeholePublishPage /></LazyWrapper></ProtectedRoute>} />

        {/* 新闻模块 */}
        <Route path="/news" element={<ProtectedRoute><LazyWrapper><NewsPage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/news/:id" element={<ProtectedRoute><LazyWrapper><NewsDetailPage /></LazyWrapper></ProtectedRoute>} />

        {/* 标签模块 */}
        <Route path="/tag/:id" element={<ProtectedRoute><LazyWrapper><TagPage /></LazyWrapper></ProtectedRoute>} />

        {/* 搜索模块 */}
        <Route path="/search" element={<ProtectedRoute><LazyWrapper><SearchPage /></LazyWrapper></ProtectedRoute>} />

        {/* 学业规划 */}
        <Route path="/career-plan" element={<ProtectedRoute><LazyWrapper><CareerPlanPage /></LazyWrapper></ProtectedRoute>} />

        {/* 用户系统 */}
        <Route path="/profile/:userId?" element={<ProtectedRoute><LazyWrapper><ProfilePage /></LazyWrapper></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><LazyWrapper><MessagesPage /></LazyWrapper></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
