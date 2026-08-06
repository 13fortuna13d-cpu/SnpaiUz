import React from 'react';
import { Home, Search, Grid, Heart, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate, onOpenAuth }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: t('nav.home') || 'Bosh sahifa',
      icon: Home,
      page: 'home'
    },
    {
      id: 'catalog',
      label: t('nav.catalog') || 'Katalog',
      icon: Search,
      page: 'catalog'
    },
    {
      id: 'categories',
      label: t('nav.categories') || 'Kategoriyalar',
      icon: Grid,
      page: 'categories'
    },
    {
      id: 'favorites',
      label: t('profile.tab_watchlist') || 'Sevimlilar',
      icon: Heart,
      page: 'favorites'
    },
    {
      id: 'profile',
      label: user ? (t('auth.profile') || 'Profil') : (t('auth.login') || 'Kirish'),
      icon: User,
      action: () => {
        if (user) {
          onNavigate('profile');
        } else {
          onOpenAuth();
        }
      }
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-purple-900/40 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id || (activePage === item.page);

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else if (item.page) {
                onNavigate(item.page);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-purple-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
