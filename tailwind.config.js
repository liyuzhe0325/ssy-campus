/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0ea5e9',    // 青蓝色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 辅助色
        secondary: {
          500: '#10b981',
          600: '#059669',
        },
        // 兴趣橙
        interest: {
          500: '#f97316',
        },
        // 树洞紫
        private: {
          500: '#a855f7',
        },
        // 官方金
        official: {
          500: '#eab308',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        // 深色背景层级（关键！）
        dark: {
          950: '#0b0f17',   // 最深层
          900: '#111827',   // 默认背景
          800: '#1f2937',   // 卡片/面板背景 ← 这个就是构建报错缺少的
          700: '#374151',   // 分割线/边框
          600: '#4b5563',   // 禁用文本
        },
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
        'input': '0.5rem',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'hover': '0 20px 30px -10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
