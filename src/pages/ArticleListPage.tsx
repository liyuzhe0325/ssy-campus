import React from 'react'
import Layout from '@/components/layout/Layout'
import Empty from '@/components/common/Empty'

const ArticleListPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">文章列表</h1>
      <Empty text="模块开发中，敬请期待~" />
    </Layout>
  )
}

export default ArticleListPage
