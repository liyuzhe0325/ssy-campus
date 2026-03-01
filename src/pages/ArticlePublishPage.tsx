import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useCreateArticle } from '@/hooks/useArticle'
import { useAllTags } from '@/hooks/useTag'
import { useToast } from '@/components/common/Toast'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'

const ArticlePublishPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    cover_url: '',
    tag_ids: [] as string[],
  })

  const navigate = useNavigate()
  const { mutate: createArticle, isPending } = useCreateArticle()
  const { data: tags, isLoading: isLoadingTags } = useAllTags()
  const { showToast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      if (prev.tag_ids.includes(tagId)) {
        return { ...prev, tag_ids: prev.tag_ids.filter(id => id !== tagId) }
      } else {
        return { ...prev, tag_ids: [...prev.tag_ids, tagId] }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showToast('请输入文章标题', 'warning')
      return
    }
    if (!formData.content.trim()) {
      showToast('请输入文章内容', 'warning')
      return
    }

    createArticle(formData, {
      onSuccess: () => {
        showToast('文章发布成功，等待审核通过后即可展示', 'success')
        navigate('/articles')
      },
      onError: (error: any) => {
        showToast(error.message || '发布失败，请重试', 'error')
      },
    })
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">发布经验文章</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-6">
        <Input
          label="文章标题"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="请输入文章标题"
          required
        />

        <Input
          label="文章摘要"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          placeholder="请输入文章摘要（选填，将展示在列表页）"
        />

        <Input
          label="封面图链接"
          name="cover_url"
          value={formData.cover_url}
          onChange={handleInputChange}
          placeholder="请输入封面图链接（选填）"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-200">文章标签</label>
          {isLoadingTags ? (
            <div className="flex items-center py-2">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${formData.tag_ids.includes(tag.id) ? 'bg-primary border-primary text-white' : 'border-dark-lighter hover:border-primary text-gray-300'}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-200">文章内容</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={15}
            placeholder="请输入文章正文内容，支持Markdown格式"
            className="px-4 py-3 rounded-lg bg-dark-light border border-dark-lighter text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button type="submit" loading={isPending} size="lg">
            发布文章
          </Button>
        </div>
      </form>
    </Layout>
  )
}

export default ArticlePublishPage
