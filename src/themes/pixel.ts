import { Theme } from './types';

export const pixelTheme: Theme = {
  id: 'pixel',
  name: '像素庄园',
  colors: {
    primary: '#6B4F3C',
    secondary: '#A57C5C',
    background: '#1A1E2C',
    card: '#2D2F3B',
    text: '#F0E6D2',
    'text-secondary': '#A9B7C6',
    border: '#4A4E5C',
    success: '#6AAA64',
    warning: '#F9C74F',
    error: '#F9844A',
  },
  fonts: {
    body: '"Press Start 2P", cursive',
    heading: '"Press Start 2P", cursive',
  },
  borderRadius: {
    card: '0px',
    button: '0px',
    input: '0px',
  },
  boxShadow: '4px 4px 0px 0px #000000',
  backgroundImage: '/images/pixel-bg.png',
  iconSet: 'pixel',
  breathingIntensity: 0.2,
};
