// ============================
// 应用根组件
// 配置全局路由、错误边界、Toast通知、开发者模式
// 整合所有页面模块
// ============================

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import DevPanel from './components/dev/DevPanel';
import { registerDevModeShortcut } from './utils/devMode';
import Layout from './components/layout/Layout';

// 认证页面
import LoginPage from './pages/LoginPage';

// 主要页面
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';

// 文章模块
import ArticlePage from './pages/ArticlePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewArticlePage from './pages/NewArticlePage';

// 问答模块
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import NewQuestionPage from './pages/NewQuestionPage';

// 贴吧模块
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import NewPostPage from './pages/NewPostPage';

// 动态模块
import DynamicsPage from './pages/DynamicsPage';

// 树洞模块
import TreeholePage from './pages/TreeholePage';
import TreeholeDetailPage from './pages/TreeholeDetailPage';
import NewTreeholePage from './pages/NewTreeholePage';

// 新闻模块
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';

// 标签页
import TagDetailPage from './pages/TagDetailPage';

// 学业规划（占位）
import CareerPlanPage from './pages/CareerPlanPage';

// 新增模块页面
import ExplorePage from './pages/ExplorePage';
import UniversityPage from './pages/UniversityPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import MajorPage from './pages/MajorPage';
import MajorDetailPage from './pages/MajorDetailPage';
import TimelinePage from './pages/TimelinePage';
import EstatePage from './pages/EstatePage';
import ResourcePage from './pages/ResourcePage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import FeedbackPage from './pages/FeedbackPage';
import FundraisingPage from './pages/FundraisingPage';
import FundraisingDetailPage from './pages/FundraisingDetailPage';
import AboutPage from './pages/AboutPage';

// 后台页面（暂不添加所有，按需）
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// 开发者页面
// import DevToolsPage from './pages/dev/DevToolsPage';

// 路由保护组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  // 注册开发者模式快捷键
  useEffect(() => {
    registerDevModeShortcut();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* 关于我们可公开？这里先公开 */}

        {/* 受保护路由，包裹在 Layout 中 */}
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          
          {/* 文章模块 */}
          <Route path="/articles" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
          <Route path="/article/:id" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
          <Route path="/article/new" element={<ProtectedRoute><NewArticlePage /></ProtectedRoute>} />

          {/* 问答模块 */}
          <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
          <Route path="/question/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
          <Route path="/question/new" element={<ProtectedRoute><NewQuestionPage /></ProtectedRoute>} />

          {/* 贴吧模块 */}
          <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
          <Route path="/post/new" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />

          {/* 动态模块 */}
          <Route path="/dynamics" element={<ProtectedRoute><DynamicsPage /></ProtectedRoute>} />

          {/* 树洞模块 */}
          <Route path="/treehole" element={<ProtectedRoute><TreeholePage /></ProtectedRoute>} />
          <Route path="/treehole/:id" element={<ProtectedRoute><TreeholeDetailPage /></ProtectedRoute>} />
          <Route path="/treehole/new" element={<ProtectedRoute><NewTreeholePage /></ProtectedRoute>} />

          {/* 新闻模块 */}
          <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
          <Route path="/news/:id" element={<ProtectedRoute><NewsDetailPage /></ProtectedRoute>} />

          {/* 标签页 */}
          <Route path="/tag/:id" element={<ProtectedRoute><TagDetailPage /></ProtectedRoute>} />

          {/* 搜索 */}
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

          {/* 学业规划（占位） */}
          <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />

          {/* 个人中心 */}
          <Route path="/profile/:userId?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* 消息中心 */}
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

          {/* 新增模块 */}
          <Route path="/universities" element={<ProtectedRoute><UniversityPage /></ProtectedRoute>} />
          <Route path="/university/:id" element={<ProtectedRoute><UniversityDetailPage /></ProtectedRoute>} />
          <Route path="/majors" element={<ProtectedRoute><MajorPage /></ProtectedRoute>} />
          <Route path="/major/:id" element={<ProtectedRoute><MajorDetailPage /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
          <Route path="/estate" element={<ProtectedRoute><EstatePage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
          <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetailPage /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/fundraising" element={<ProtectedRoute><FundraisingPage /></ProtectedRoute>} />
          <Route path="/fundraising/:id" element={<ProtectedRoute><FundraisingDetailPage /></ProtectedRoute>} />
        </Route>

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 全局组件 */}
      <Toast />
      <DevPanel />
    </ErrorBoundary>
  );
}

export default App;
