// ============================
// 简易富文本编辑器
// 临时使用 textarea 替代，未来可替换为真实富文本编辑器
// 依赖：无
// ============================

import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  minHeight = '150px',
  disabled = false,
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full p-3 bg-card border border-border rounded-input text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ minHeight }}
    />
  );
};

export default RichTextEditor;
