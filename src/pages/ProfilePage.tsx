import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useFollow } from '@/hooks/useFollow'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const isOwnProfile = user?.id === id

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id!),
    enabled: !!id,
  })

  const { following, toggleFollow } = useFollow(id!)

  if (isLoading) return <Loading />
  if (!profile) return <div>用户不存在</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
              {profile.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-gray-500">{profile.grade || '未填写年级'}</p>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              variant={following ? 'outline' : 'primary'}
              onClick={toggleFollow}
            >
              {following ? '取消关注' : '关注'}
            </Button>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-700">{profile.bio || '这个人很懒，什么都没写。'}</p>
        </div>

        <div className="mt-6 flex space-x-6 text-sm">
          <div>
            <span className="font-bold">{profile.points}</span> 积分
          </div>
          <div>
            <span className="font-bold">Lv.{profile.level}</span> 等级
          </div>
        </div>

        {isOwnProfile && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline">编辑资料</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
