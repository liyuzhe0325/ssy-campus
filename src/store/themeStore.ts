import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '@/themes/types';
import { defaultTheme } from '@/themes/default';
import { applyThemeVariables } from '@/utils/themeUtils';

interface ThemeState {
  currentTheme: Theme;
  themeId: string;
  hueShift: number;
  saturationScale: number;
  lightnessScale: number;
  activeDecorations: string[];
  setTheme: (themeId: string) => Promise<void>;
  setHueShift: (shift: number) => void;
  setSaturation: (scale: number) => void;
  setLightness: (scale: number) => void;
  toggleDecoration: (decorationId: string) => void;
  loadUserPreferences: (prefs: any) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      themeId: 'default',
      hueShift: 0,
      saturationScale: 1,
      lightnessScale: 1,
      activeDecorations: [],
      
      setTheme: async (themeId) => {
        try {
          // 动态加载主题模块
          const module = await import(`@/themes/${themeId}`);
          const theme = module.default || module[themeId];
          set({ currentTheme: theme, themeId });
          const { hueShift, saturationScale, lightnessScale } = get();
          applyThemeVariables(theme, hueShift, saturationScale, lightnessScale);
        } catch (error) {
          console.error('Failed to load theme:', error);
        }
      },
      
      setHueShift: (shift) => {
        set({ hueShift: shift });
        const { currentTheme, saturationScale, lightnessScale } = get();
        applyThemeVariables(currentTheme, shift, saturationScale, lightnessScale);
      },
      
      setSaturation: (scale) => {
        set({ saturationScale: scale });
        const { currentTheme, hueShift, lightnessScale } = get();
        applyThemeVariables(currentTheme, hueShift, scale, lightnessScale);
      },
      
      setLightness: (scale) => {
        set({ lightnessScale: scale });
        const { currentTheme, hueShift, saturationScale } = get();
        applyThemeVariables(currentTheme, hueShift, saturationScale, scale);
      },
      
      toggleDecoration: (decorationId) => {
        const { activeDecorations } = get();
        const newDecorations = activeDecorations.includes(decorationId)
          ? activeDecorations.filter(id => id !== decorationId)
          : [...activeDecorations, decorationId];
        set({ activeDecorations: newDecorations });
        // 这里可以触发特效组件的更新，暂时不实现
      },
      
      loadUserPreferences: (prefs) => {
        set({
          hueShift: prefs.hueShift || 0,
          saturationScale: prefs.saturationScale || 1,
          lightnessScale: prefs.lightnessScale || 1,
          activeDecorations: prefs.activeDecorations || [],
        });
        if (prefs.baseTheme) {
          get().setTheme(prefs.baseTheme);
        }
      },
    }),
    {
      name: 'theme-storage', // 持久化到localStorage
    }
  )
);
