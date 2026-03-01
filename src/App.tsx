import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/common/Loading'

// 页面导入（按你现有项目来）
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ArticleListPage from '@/pages/ArticleListPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import ArticlePublishPage from '@/pages/ArticlePublishPage'
import QuestionListPage from '@/pages/QuestionListPage'
import CareerPlanPage from '@/pages/CareerPlanPage'
import NotFoundPage from '@/pages/NotFoundPage'

// 🔐 登录守卫（核心）
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  // 认证加载中 → 显示loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // 没登录 → 去登录页
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 已登录 → 显示页面
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#111827] text-white">
        <Routes>
          {/* 登录/注册 公开可访问 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🏠 首页（必须登录）*/}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* 文章相关 */}
          <Route path="/articles" element={
            <ProtectedRoute>
              <ArticleListPage />
            </ProtectedRoute>
          } />
          <Route path="/article/:id" element={
            <ProtectedRoute>
              <ArticleDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/article/new" element={
            <ProtectedRoute>
              <ArticlePublishPage />
            </ProtectedRoute>
          } />

          {/* 问答 */}
          <Route path="/questions" element={
            <ProtectedRoute>
              <QuestionListPage />
            </ProtectedRoute>
          } />

          {/* 学业规划 */}
          <Route path="/career-plan" element={
            <ProtectedRoute>
              <CareerPlanPage />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
