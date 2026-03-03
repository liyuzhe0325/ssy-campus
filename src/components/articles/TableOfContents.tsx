// ============================
// 文章悬浮目录组件
// 从文章内容中提取 h2/h3 标题，生成右侧悬浮目录
// 点击目录项平滑滚动到对应标题位置
// 依赖：React
// ============================

import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 或 3，对应 h2/h3
}

interface TableOfContentsProps {
  content: string; // 文章内容的 HTML 字符串
}

/**
 * 从 HTML 内容中提取标题元素并生成目录
 * @param content - 文章内容的 HTML 字符串
 * @returns 目录项数组
 */
const extractToc = (content: string): TocItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  const items: TocItem[] = [];

  headings.forEach((heading) => {
    const id = heading.id || heading.textContent?.replace(/\s+/g, '-').toLowerCase() || '';
    // 如果没有 id，自动生成一个并设置到元素上（但需要在文章渲染时也同步，这里只提取）
    // 实际使用时，需要在文章渲染组件中为标题添加 id
    items.push({
      id,
      text: heading.textContent || '',
      level: heading.tagName === 'H2' ? 2 : 3,
    });
  });

  return items;
};

/**
 * 文章悬浮目录组件
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const items = extractToc(content);
    setToc(items);

    // 监听滚动，高亮当前可见的标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' } // 当标题进入视口顶部 20% 时触发
    );

    // 观察所有标题元素（需要在文章渲染后才有，所以延迟执行）
    setTimeout(() => {
      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-8 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-card rounded-card border border-border shadow-card">
      <h3 className="text-text font-heading text-sm font-semibold mb-3">目录</h3>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-text-secondary hover:text-text'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
