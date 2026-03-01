// ============================
// 标签聚合页：按标签查看所有内容
// ============================

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTags, getPostsByTag } from '@/services/tagService'
import Loading from '@/components/common/Loading'

const TagPage = () => {
  const { id } = useParams()
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const { data: posts, isLoading } = useQuery({
    queryKey: ['tag', id],
    queryFn: () => getPostsByTag(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">标签内容</h1>
      <div className="text-gray-300">
        该标签下共有 {posts?.length || 0} 条内容（开发阶段简化展示）
      </div>
    </div>
  )
}

export default TagPage
