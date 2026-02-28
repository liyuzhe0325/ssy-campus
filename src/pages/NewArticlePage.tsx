import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateArticle } from '@/hooks/useArticles'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const categories = ['学习', '心态', '社团', '选科', '志愿', '大学', '其他'] as const

const NewArticlePage: React.FC = () => {
  const navigate = useNavigate()
  const createArticle = useCreateArticle()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState<typeof categories[number]>('学习')
  const [tags, setTags] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    await createArticle.mutateAsync({
      title,
      content,
      summary,
      category,
      tags: tagArray,
    })
    navigate('/articles')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">发布文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="标题"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof categories[number])}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Input
          label="摘要（可选）"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="文章简短介绍"
        />
        <Input
          label="标签（用英文逗号分隔）"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="例如：高考, 学习方法"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div className="flex space-x-3">
          <Button type="submit" isLoading={createArticle.isPending}>
            发布
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/articles')}>
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewArticlePage
