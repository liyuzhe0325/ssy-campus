import { useAuth } from '@/hooks/useAuth'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">欢迎回来，{user?.username || '同学'}！</h1>
      <p className="text-gray-600 mb-8">这里是你的校园经验分享社区。</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">问答</h2>
          <p className="text-gray-500">有问题？来问学长学姐</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">文章</h2>
          <p className="text-gray-500">深度经验分享</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">动态</h2>
          <p className="text-gray-500">校园新鲜事</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
