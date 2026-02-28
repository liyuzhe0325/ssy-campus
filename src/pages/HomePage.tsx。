import { useAuth } from '@/hooks/useAuth'

const HomePage = () => {
  const { user } = useAuth()
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">欢迎回来，{user?.username || '同学'}！</h1>
      <p className="text-gray-600">这里是你的校园经验分享社区。</p>
    </div>
  )
}

export default HomePage
