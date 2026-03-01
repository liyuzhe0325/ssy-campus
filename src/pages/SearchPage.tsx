// ============================
// 全局搜索页面（统一搜索所有内容）
// ============================

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { globalSearch } from '@/services/searchService'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['search', keyword],
    queryFn: () => globalSearch(keyword),
    staleTime: 3 * 60 * 1000,
  })

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">全局搜索</h1>
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索文章、问答、动态、贴吧..."
        className="mb-6"
      />

      {isLoading && <div className="py-4 flex justify-center"><Loading /></div>}

      <div className="space-y-6">
        <div><p className="text-white">文章：{data?.articles.length || 0}</p></div>
        <div><p className="text-white">问答：{data?.questions.length || 0}</p></div>
        <div><p className="text-white">动态：{data?.dynamics.length || 0}</p></div>
        <div><p className="text-white">贴吧：{data?.posts.length || 0}</p></div>
      </div>
    </div>
  )
}

export default SearchPage
