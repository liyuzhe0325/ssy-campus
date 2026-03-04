import { Theme } from './types';

export const defaultTheme: Theme = {
  id: 'default',
  name: '温馨学府',
  description: '柔和舒适的默认主题，适合长时间阅读',
  colors: {
    primary: '#3B82F6',      // 柔和的蓝色
    secondary: '#8B5CF6',    // 淡紫色
    background: '#F9FAFB',   // 暖白背景
    card: '#FFFFFF',         // 纯白卡片
    text: '#1F2937',         // 深灰文字
    'text-secondary': '#6B7280', // 中灰辅助
    border: '#E5E7EB',       // 极浅灰边框
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  borderRadius: {
    card: '0.75rem',        // 12px
    button: '0.5rem',       // 8px
    input: '0.375rem',      // 6px
  },
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  breathingIntensity: 0.2,
  iconSet: 'heroicons',
};
