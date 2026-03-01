import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'
import ArticlePage from './pages/ArticlePage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import NewArticlePage from './pages/NewArticlePage'
import QuestionsPage from './pages/QuestionsPage'
import QuestionDetailPage from './pages/QuestionDetailPage'
import NewQuestionPage from './pages/NewQuestionPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import NewPostPage from './pages/NewPostPage'
import DynamicsPage from './pages/DynamicsPage'
import DynamicDetailPage from './pages/DynamicDetailPage'
import NewDynamicPage from './pages/NewDynamicPage'
import TreeholePage from './pages/TreeholePage'
import TreeholeDetailPage from './pages/TreeholeDetailPage'
import NewTreeholePage from './pages/NewTreeholePage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import TagPage from './pages/TagPage'
import SearchPage from './pages/SearchPage'
import CareerPlanPage from './pages/CareerPlanPage'
import NotFoundPage from './pages/NotFoundPage'

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

        <Route path="/articles" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
        <Route path="/article/new" element={<ProtectedRoute><NewArticlePage /></ProtectedRoute>} />

        <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
        <Route path="/question/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
        <Route path="/question/new" element={<ProtectedRoute><NewQuestionPage /></ProtectedRoute>} />

        <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
        <Route path="/post/new" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />

        <Route path="/dynamics" element={<ProtectedRoute><DynamicsPage /></ProtectedRoute>} />
        <Route path="/dynamic/:id" element={<ProtectedRoute><DynamicDetailPage /></ProtectedRoute>} />
        <Route path="/dynamic/new" element={<ProtectedRoute><NewDynamicPage /></ProtectedRoute>} />

        <Route path="/treehole" element={<ProtectedRoute><TreeholePage /></ProtectedRoute>} />
        <Route path="/treehole/:id" element={<ProtectedRoute><TreeholeDetailPage /></ProtectedRoute>} />
        <Route path="/treehole/new" element={<ProtectedRoute><NewTreeholePage /></ProtectedRoute>} />

        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/news/:id" element={<ProtectedRoute><NewsDetailPage /></ProtectedRoute>} />

        <Route path="/tag/:id" element={<ProtectedRoute><TagPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />

        <Route path="/profile/:userId?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
