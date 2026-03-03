import React from 'react';
import { useParams } from 'react-router-dom';

const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading text-text mb-6">资源详情</h1>
      <div className="bg-card border border-border rounded-card p-6">
        <p className="text-text-secondary">资源详情页开发中... ID: {id}</p>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
