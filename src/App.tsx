import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// 全局布局组件
import Layout from '@/components/layout/Layout'

// 基础页面
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ProfilePage from '@/pages/ProfilePage'
import MessagesPage from '@/pages/MessagesPage'

// 文章模块页面
import ArticlesPage from '@/pages/ArticlesPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import NewArticlePage from '@/pages/NewArticlePage'

// 问答模块页面
import QuestionsPage from '@/pages/QuestionsPage'
import QuestionDetailPage from '@/pages/QuestionDetailPage'
import NewQuestionPage from '@/pages/NewQuestionPage'

// 动态模块页面
import DynamicsPage from '@/pages/DynamicsPage'
import NewDynamicPage from '@/pages/NewDynamicPage'
// 动态详情页（已生成骨架，预留路由）
import DynamicDetailPage from '@/pages/DynamicDetailPage'

// 贴吧模块页面
import PostsPage from '@/pages/PostsPage'
import PostDetailPage from '@/pages/PostDetailPage'
import NewPostPage from '@/pages/NewPostPage'

// 树洞模块页面
import TreeholePage from '@/pages/TreeholePage'
import TreeholeDetailPage from '@/pages/TreeholeDetailPage'
import NewTreeholePage from '@/pages/NewTreeholePage'

// 新闻模块页面
import NewsPage from '@/pages/NewsPage'
import NewsDetailPage from '@/pages/NewsDetailPage'

// 标签+搜索模块页面
import TagPage from '@/pages/TagPage'
import SearchPage from '@/pages/SearchPage'

// ==============================
// 鉴权路由组件：未登录自动跳登录页
// 所有需要登录的页面必须用此组件包裹
// ==============================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  // 加载中显示空白（避免闪烁）
  if (isLoading) return null

  // 未登录跳登录页
  if (!user) return <Navigate to="/login" replace />

  // 已登录渲染内容
  return <>{children}</>
}

// ==============================
// 根App组件：全局路由总控
// ==============================
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 公开路由：无需登录 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 受保护路由：需登录，统一带全局布局（侧边栏+顶部导航） */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* 首页 */}
          <Route index element={<HomePage />} />

          {/* ==============================
              文章模块路由
              ============================== */}
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/new" element={<NewArticlePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />

          {/* ==============================
              问答模块路由
              ============================== */}
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/question/new" element={<NewQuestionPage />} />
          <Route path="/question/:id" element={<QuestionDetailPage />} />

          {/* ==============================
              动态模块路由
              ============================== */}
          <Route path="/dynamics" element={<DynamicsPage />} />
          <Route path="/dynamic/new" element={<NewDynamicPage />} />
          <Route path="/dynamic/:id" element={<DynamicDetailPage />} />

          {/* ==============================
              贴吧模块路由
              ============================== */}
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post/new" element={<NewPostPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />

          {/* ==============================
              树洞模块路由
              ============================== */}
          <Route path="/treehole" element={<TreeholePage />} />
          <Route path="/treehole/new" element={<NewTreeholePage />} />
          <Route path="/treehole/:id" element={<TreeholeDetailPage />} />

          {/* ==============================
              新闻模块路由
              ============================== */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* ==============================
              标签+搜索模块路由
              ============================== */}
          <Route path="/tag/:id" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* ==============================
              个人中心+消息路由
              ============================== */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />

          {/* ==============================
              后续新增模块路由追加区（社团/失物招领/工具）
              示例：
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/lost-found" element={<LostFoundPage />} />
              ============================== */}
        </Route>

        {/* 404路由：不存在的路径跳首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
