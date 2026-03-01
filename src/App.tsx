// ============================
// 应用根组件：路由总入口（全模块集成版）
// 功能：配置全局路由，登录守卫，布局嵌套
// 已集成：文章、问答、动态、贴吧、树洞、新闻、标签、搜索、学业规划、用户系统
// ============================

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'

// 公共页面
import LoginPage from './pages/LoginPage'

// 用户系统页面
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'

// 文章模块
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import NewArticlePage from './pages/NewArticlePage'

// 问答模块
import QuestionsPage from './pages/QuestionsPage'
import QuestionDetailPage from './pages/QuestionDetailPage'
import NewQuestionPage from './pages/NewQuestionPage'

// 动态模块
import DynamicsPage from './pages/DynamicsPage'
import DynamicDetailPage from './pages/DynamicDetailPage'
import NewDynamicPage from './pages/NewDynamicPage'

// 贴吧模块
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import NewPostPage from './pages/NewPostPage'

// 树洞模块
import TreeholePage from './pages/TreeholePage'
import TreeholeDetailPage from './pages/TreeholeDetailPage'
import NewTreeholePage from './pages/NewTreeholePage'

// 新闻模块
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'

// 标签与搜索
import TagPage from './pages/TagPage'
import SearchPage from './pages/SearchPage'

// 学业规划
import CareerPlanPage from './pages/CareerPlanPage'

// 路由守卫
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* 公共路由：登录页（无布局） */}
      <Route path="/login" element={<LoginPage />} />

      {/* 私有路由：全部带Layout */}
      <Route element={<Layout />}>
        {/* 首页 */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* 文章模块 */}
        <Route path="/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
        <Route path="/article/new" element={<ProtectedRoute><NewArticlePage /></ProtectedRoute>} />

        {/* 问答模块 */}
        <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
        <Route path="/question/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
        <Route path="/question/new" element={<ProtectedRoute><NewQuestionPage /></ProtectedRoute>} />

        {/* 动态模块 */}
        <Route path="/dynamics" element={<ProtectedRoute><DynamicsPage /></ProtectedRoute>} />
        <Route path="/dynamic/:id" element={<ProtectedRoute><DynamicDetailPage /></ProtectedRoute>} />
        <Route path="/dynamic/new" element={<ProtectedRoute><NewDynamicPage /></ProtectedRoute>} />

        {/* 贴吧模块 */}
        <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
        <Route path="/post/new" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />

        {/* 树洞模块 */}
        <Route path="/treehole" element={<ProtectedRoute><TreeholePage /></ProtectedRoute>} />
        <Route path="/treehole/:id" element={<ProtectedRoute><TreeholeDetailPage /></ProtectedRoute>} />
        <Route path="/treehole/new" element={<ProtectedRoute><NewTreeholePage /></ProtectedRoute>} />

        {/* 新闻模块 */}
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/news/:id" element={<ProtectedRoute><NewsDetailPage /></ProtectedRoute>} />

        {/* 标签模块 */}
        <Route path="/tag/:id" element={<ProtectedRoute><TagPage /></ProtectedRoute>} />

        {/* 搜索模块 */}
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

        {/* 学业规划模块 */}
        <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />

        {/* 用户系统 */}
        <Route path="/profile/:userId?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
