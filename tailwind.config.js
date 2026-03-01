/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0ea5e9', // 青蓝（学习主题）
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        interest: {
          500: '#f97316', // 活力橙（兴趣主题）
        },
        private: {
          500: '#a855f7', // 神秘紫（树洞主题）
        },
        official: {
          500: '#eab308', // 权威金（新闻主题）
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        dark: {
          950: '#0b0f17',
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
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
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: 0 },
          'to': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
