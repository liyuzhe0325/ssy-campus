import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useFollow } from '@/hooks/useFollow'
import { getProfileByUserId, getUserStats } from '@/services/profileService'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import Empty from '@/components/common/Empty'
import toast from 'react-hot-toast'

const ProfilePage: React.FC = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const targetUserId = userId || currentUser?.id || ''
  const isMyProfile = targetUserId === currentUser?.id

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: () => getProfileByUserId(targetUserId),
    enabled: !!targetUserId,
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', targetUserId],
    queryFn: () => getUserStats(targetUserId),
    enabled: !!targetUserId,
  })

  const { isFollowing, follow, unfollow, isFollowingLoading, isUnfollowingLoading } = useFollow(targetUserId)

  const [privacy, setPrivacy] = useState({
    showGrade: profile?.privacy_settings?.showGrade ?? true,
    showFollows: profile?.privacy_settings?.showFollows ?? true,
  })

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
    // 实际应调用API保存
    toast.success('隐私设置已更新')
  }

  if (isLoadingProfile || isLoadingStats) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout>
        <Empty text="用户不存在" />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="global-container max-w-3xl">
        {/* 个人信息头部 */}
        <div className="global-card mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center text-3xl text-primary-500">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.nickname} className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile.nickname[0]
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-1">{profile.nickname}</h1>
                {privacy.showGrade && <p className="text-text-secondary mb-1">{profile.grade || '未设置年级'}</p>}
                <p className="text-text-secondary text-sm">{profile.bio || '这个人很懒，什么都没写~'}</p>
              </div>
            </div>

            {!isMyProfile && (
              <Button
                variant={isFollowing ? 'outline' : 'primary'}
                onClick={() => (isFollowing ? unfollow() : follow())}
                loading={isFollowingLoading || isUnfollowingLoading}
              >
                {isFollowing ? '取消关注' : '+ 关注'}
              </Button>
            )}
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mt-6 text-center">
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats?.articleCount || 0}</div>
              <div className="text-text-secondary text-sm">文章</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats?.questionCount || 0}</div>
              <div className="text-text-secondary text-sm">提问</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats?.likeReceived || 0}</div>
              <div className="text-text-secondary text-sm">获赞</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats?.followerCount || 0}</div>
              <div className="text-text-secondary text-sm">粉丝</div>
            </div>
          </div>

          {/* 兴趣标签 */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm text-text-secondary mb-2">兴趣标签</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 时间轴 */}
        <div className="global-card mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>📅</span> 成长记录
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 text-sm">
              <span className="text-text-secondary w-24">2024-09-01</span>
              <span className="text-text-primary">加入省实验传承平台</span>
            </div>
            {stats?.firstArticle && (
              <div className="flex gap-3 text-sm">
                <span className="text-text-secondary w-24">{stats.firstArticle.date}</span>
                <span className="text-text-primary">发布了第一篇经验文章</span>
              </div>
            )}
            {stats?.firstQuestion && (
              <div className="flex gap-3 text-sm">
                <span className="text-text-secondary w-24">{stats.firstQuestion.date}</span>
                <span className="text-text-primary">提出了第一个问题</span>
              </div>
            )}
            {stats?.milestone && (
              <div className="flex gap-3 text-sm text-primary-500">
                <span className="text-text-secondary w-24">{stats.milestone.date}</span>
                <span>✨ 获得「{stats.milestone.name}」徽章</span>
              </div>
            )}
          </div>
        </div>

        {/* 隐私设置（仅自己可见） */}
        {isMyProfile && (
          <div className="global-card">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span>🔒</span> 隐私设置
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-text-secondary">公开我的年级</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={privacy.showGrade}
                  onChange={(e) => handlePrivacyChange('showGrade', e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-text-secondary">公开我的关注列表</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={privacy.showFollows}
                  onChange={(e) => handlePrivacyChange('showFollows', e.target.checked)}
                />
              </label>
              <p className="text-xs text-text-secondary mt-2">
                你的数据仅用于个性化推荐，不会泄露给第三方。你可以随时在设置中关闭。
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProfilePage
