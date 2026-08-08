import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'amoled' | 'purple' | 'blue' | 'emerald' | 'red' | 'sakura';

export interface ThemeOption {
  id: ThemeMode;
  labelUz: string;
  labelEn: string;
  labelRu: string;
  label: string;
  bgHex: string;
  accentHex: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  themeNames: ThemeOption[];
}

export const themeOptions: ThemeOption[] = [
  { id: 'dark', labelUz: '🌙 Qorong\'u Slate', labelEn: '🌙 Dark Slate', labelRu: '🌙 Тёмный Слейт', label: '🌙 Qorong\'u Slate', bgHex: '#020617', accentHex: '#9333ea' },
  { id: 'light', labelUz: '☀️ Yorug\' (Light)', labelEn: '☀️ Light Mode', labelRu: '☀️ Светлая Тема', label: '☀️ Yorug\' (Light)', bgHex: '#f8fafc', accentHex: '#9333ea' },
  { id: 'amoled', labelUz: '🖤 AMOLED Qora', labelEn: '🖤 AMOLED Black', labelRu: '🖤 AMOLED Чёрный', label: '🖤 AMOLED Qora', bgHex: '#000000', accentHex: '#a855f7' },
  { id: 'purple', labelUz: '💜 Neon Binafsha', labelEn: '💜 Neon Purple', labelRu: '💜 Неон Фиолетовый', label: '💜 Neon Binafsha', bgHex: '#0b0514', accentHex: '#c084fc' },
  { id: 'blue', labelUz: '💙 Moviy Ummon', labelEn: '💙 Ocean Blue', labelRu: '💙 Океан Синий', label: '💙 Moviy Ummon', bgHex: '#020817', accentHex: '#3b82f6' },
  { id: 'emerald', labelUz: '💚 Zumrad Yashil', labelEn: '💚 Emerald Green', labelRu: '💚 Изумрудно-Зелёный', label: '💚 Zumrad Yashil', bgHex: '#02140e', accentHex: '#10b981' },
  { id: 'red', labelUz: '❤️ Alvon Qizil', labelEn: '❤️ Crimson Red', labelRu: '❤️ Багрово-Красный', label: '❤️ Alvon Qizil', bgHex: '#140306', accentHex: '#ef4444' },
  { id: 'sakura', labelUz: '🌸 Pushti Olcha', labelEn: '🌸 Sakura Rose', labelRu: '🌸 Сакура Розовый', label: '🌸 Pushti Olcha', bgHex: '#180812', accentHex: '#f43f5e' }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('senpaiuz_theme') as ThemeMode;
    return saved && themeOptions.some(t => t.id === saved) ? saved : 'dark';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('senpaiuz_theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('data-theme', mode);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeNames: themeOptions }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme ThemeProvider ichida ishlatilishi kerak');
  }
  return context;
};
