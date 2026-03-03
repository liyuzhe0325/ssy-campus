// ============================
// 文章目录组件
// 从文章内容中提取 h2/h3 标题，生成右侧悬浮目录
// 点击目录项平滑滚动到对应标题位置
// 依赖：无
// 样式：使用主题变量，适配个性化主题
// ============================

import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 或 3
}

interface TableOfContentsProps {
  content: string; // 文章内容的 HTML 字符串
}

/**
 * 生成标题的 ID（用于锚点）
 */
const generateHeadingId = (text: string, index: number): string => {
  return `heading-${index}-${text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
};

/**
 * 从 HTML 内容中提取标题
 */
const extractHeadings = (content: string): TOCItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  
  return headings.map((heading, index) => ({
    id: heading.id || generateHeadingId(heading.textContent || '', index),
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1], 10),
  }));
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const extracted = extractHeadings(content);
    setHeadings(extracted);
  }, [content]);

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' } // 当标题进入视口 20% 时触发
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block fixed right-4 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-card rounded-card border border-border shadow-card">
      <h3 className="text-text font-heading text-lg mb-3">目录</h3>
      <nav>
        <ul className="space-y-2 text-sm">
          {headings.map(({ id, text, level }) => (
            <li
              key={id}
              className={`${level === 3 ? 'ml-4' : ''} transition-colors`}
            >
              <button
                onClick={() => handleClick(id)}
                className={`text-left hover:text-primary transition-colors ${
                  activeId === id
                    ? 'text-primary font-medium'
                    : 'text-text-secondary'
                }`}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
