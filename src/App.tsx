import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import NewArticlePage from './pages/NewArticlePage' // 发布页
import CareerPlanPage from './pages/CareerPlanPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        
        <Route path="/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
        <Route path="/article/new" element={<ProtectedRoute><NewArticlePage /></ProtectedRoute>} /> {/* 发布 */}
        
        <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />
        <Route path="/profile/:id?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
