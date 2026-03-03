import { Theme } from './types';

export const defaultTheme: Theme = {
  id: 'default',
  name: '经典学府',
  colors: {
    primary: '#0A2472',      // 学府蓝
    secondary: '#EAB308',    // 传承金
    background: '#0B0F17',
    card: '#1A1F29',
    text: '#FFFFFF',
    'text-secondary': '#9CA3AF',
    border: '#2A2F3A',
    success: '#10B981',
    warning: '#F97316',
    error: '#EF4444',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Poppins, system-ui, sans-serif',
  },
  borderRadius: {
    card: '1rem',
    button: '0.75rem',
    input: '0.5rem',
  },
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.3)',
  iconSet: 'heroicons',
  breathingIntensity: 0.3,
};
