import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/common/Loading'

// 只导入你项目里【一定存在】的页面
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ArticleListPage from '@/pages/ArticleListPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import ArticlePublishPage from '@/pages/ArticlePublishPage'
import QuestionListPage from '@/pages/QuestionListPage'
import CareerPlanPage from '@/pages/CareerPlanPage'
import NotFoundPage from '@/pages/NotFoundPage'

// 登录守卫（核心不变）
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#111827] text-white">
        <Routes>
          {/* 仅保留登录页（无注册页，避免报错） */}
          <Route path="/login" element={<LoginPage />} />

          {/* 首页（必须登录）*/}
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
