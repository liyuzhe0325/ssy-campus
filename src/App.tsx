import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/common/Loading'

// 只导入项目【真实存在、你代码里实际用到】的页面
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
//import ArticlePublishPage from '@/pages/ArticlePublishPage'
import QuestionListPage from '@/pages/QuestionListPage'
import CareerPlanPage from '@/pages/CareerPlanPage'
import NotFoundPage from '@/pages/NotFoundPage'

// 登录守卫（所有页面强制登录，最安全规范）
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  // 加载状态显示loading，不闪屏
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // 未登录直接跳登录页（含注册功能，你原本可用）
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 已登录正常展示页面
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#111827] text-white">
        <Routes>
          {/* 登录页（内置注册功能，你之前能注册就是这里） */}
          <Route path="/login" element={<LoginPage />} />

          // ====================== 你所有功能页面全保留 ======================
          {/* 首页 */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* 文章详情 */}
          <Route path="/article/:id" element={
            <ProtectedRoute>
              <ArticleDetailPage />
            </ProtectedRoute>
          } />

          {/* 发布文章 */}
          <Route path="/article/new" element={
            <ProtectedRoute>
              <ArticlePublishPage />
            </ProtectedRoute>
          } />

          {/* 校园问答（首页去提问按钮） */}
          <Route path="/questions" element={
            <ProtectedRoute>
              <QuestionListPage />
            </ProtectedRoute>
          } />

          {/* 学业规划（首页开始规划按钮） */}
          <Route path="/career-plan" element={
            <ProtectedRoute>
              <CareerPlanPage />
            </ProtectedRoute>
          } />

          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
