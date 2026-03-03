import React from 'react';
import { useParams } from 'react-router-dom';

const TagDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl text-text">标签详情页 (开发中) ID: {id}</h1>
    </div>
  );
};

export default TagDetailPage;
