
// ============================
// 相似问题推荐组件
// 在提问页面或问题详情页展示相似问题，避免重复提问
// 依赖：questionService.getSimilarQuestions（待实现）
// 样式：使用主题变量
// ============================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  title: string;
  answer_count: number;
  created_at: string;
}

interface SimilarQuestionsProps {
  title: string; // 当前问题标题，用于搜索相似
  currentQuestionId?: string; // 当前问题ID（排除自身）
  limit?: number;
}

const SimilarQuestions: React.FC<SimilarQuestionsProps> = ({
  title,
  currentQuestionId,
  limit = 5,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!title.trim()) return;

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        // TODO: 实现 getSimilarQuestions API，根据标题模糊匹配
        // 模拟数据
        setTimeout(() => {
          setQuestions([
            {
              id: 'q1',
              title: '如何学好高中数学？',
              answer_count: 3,
              created_at: new Date().toISOString(),
            },
            {
              id: 'q2',
              title: '数学错题本怎么做最有效？',
              answer_count: 5,
              created_at: new Date().toISOString(),
            },
            {
              id: 'q3',
              title: '高考数学最后一道题怎么突破？',
              answer_count: 2,
              created_at: new Date().toISOString(),
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取相似问题失败', error);
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSimilar, 500); // 防抖
    return () => clearTimeout(debounceTimer);
  }, [title]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-card rounded-card border border-border">
        <p className="text-text-secondary text-sm">正在查找相似问题...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-card rounded-card border border-border">
      <h4 className="text-text font-medium mb-3">相似问题</h4>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li key={q.id}>
            <Link
              to={`/question/${q.id}`}
              className="block p-2 hover:bg-card/80 rounded transition-colors"
            >
              <p className="text-text text-sm line-clamp-1">{q.title}</p>
              <p className="text-text-secondary text-xs mt-1">
                {q.answer_count} 个回答 · {new Date(q.created_at).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimilarQuestions;
