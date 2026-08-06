import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Mic, Crown, Globe, LogOut, 
  Settings, Heart, History, Shield, X, Play, Sparkles, Flame, Bell, Wallet, Grid, User as UserIcon, BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAnime } from '../context/AnimeContext';
import { Language } from '../types';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
  onOpenVip: () => void;
  onOpenVoiceSearch: () => void;
  onToggleNotifications: () => void;
  activePage: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenVip,
  onOpenVoiceSearch,
  onToggleNotifications,
  activePage
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, animeList } = useAnime();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchModalInputRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = user?.notifications?.filter(n => !n.read).length || 0;

  // Search autocomplete items
  const filteredSuggestions = searchQuery.trim()
    ? animeList.filter(a => 
        a.title.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.jp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        searchModalInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAnime = (slug: string) => {
    setIsSearchOpen(false);
    setIsSearchModalOpen(false);
    onNavigate('anime', { slug });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchOpen(false);
    setIsSearchModalOpen(false);
    onNavigate('catalog');
  };

  const toggleLang = () => {
    setIsLangOpen(!isLangOpen);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsSearchOpen(false);
    setIsLangOpen(false);
  };

  const trendingTags = ['Solo Leveling', 'Demon Slayer', 'One Piece', 'Jujutsu Kaisen', 'Attack on Titan'];

  return (
    <header 
      className="fixed top-0 left-0 right-0 w-full z-[99999] bg-slate-950/95 backdrop-blur-md border-b border-purple-900/30 text-white shadow-lg shadow-purple-950/20 transition-all duration-200 will-change-transform"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 99999 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6 w-full">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 fill-purple-400/30 ml-0.5" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 font-sans">
              AniSenpai<span className="text-purple-400 font-black">Uz</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-cyan-400 tracking-widest block -mt-1 opacity-90">
              Anime Platform
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activePage === 'home'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t('nav.home')}
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activePage === 'catalog'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t('nav.catalog')}
          </button>

          <button
            onClick={() => onNavigate('manga')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activePage === 'manga' || activePage === 'manga-detail' || activePage === 'manga-reader'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Manga</span>
          </button>

          <button
            onClick={() => onNavigate('categories')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activePage === 'categories'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('nav.categories')}</span>
          </button>

          <button
            onClick={() => onNavigate('catalog', { filter: 'top' })}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activePage === 'top'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {t('nav.top')}
          </button>

          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('nav.admin')}</span>
            </button>
          )}
        </nav>

        {/* Live Search & Voice Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={t('search.placeholder')}
              className="w-full bg-slate-900/80 border border-slate-800/90 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <button
              onClick={onOpenVoiceSearch}
              title={t('search.voice')}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
              {filteredSuggestions.length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    {t('search.results')}
                  </div>
                  <div className="space-y-1">
                    {filteredSuggestions.map(anime => (
                      <div
                        key={anime.id}
                        onClick={() => handleSelectAnime(anime.slug)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-600/20 cursor-pointer transition-colors group"
                      >
                        <img src={anime.poster} alt={anime.title.uz} className="w-10 h-12 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                            {anime.title[language] || anime.title.uz}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-0.5">
                            <span>⭐ {anime.rating}</span>
                            <span>•</span>
                            <span>{anime.year}</span>
                            <span>•</span>
                            <span className="text-cyan-400">{anime.episodesCount} qism</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                <p className="text-center py-4 text-slate-400">{t('search.no_results')}</p>
              ) : (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    {t('search.trending')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          onNavigate('catalog');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-600/30 text-slate-300 hover:text-white text-xs transition-colors"
                      >
                        🔥 {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Search Lupa, Notifications, VIP, Language */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Lupa (Search) Button for Mobile & Quick Access */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
            title={t('search.placeholder')}
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline text-xs font-medium text-slate-400">{t('search.placeholder').slice(0, 10)}...</span>
          </button>

          {/* Notifications Bell */}
          {user && (
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title={language === 'uz' ? 'Bildirishnomalar' : language === 'ru' ? 'Уведомления' : 'Notifications'}
            >
              <Bell className="w-4 h-4 text-purple-400" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          )}

          {/* VIP Upgrade Button */}
          <button
            onClick={onOpenVip}
            className="relative group p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-all shrink-0"
            title={t('nav.vip')}
          >
            <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{user?.isVip ? t('vip.active') : t('nav.vip')}</span>
          </button>

          {/* Language Selector (Far Right) */}
          <div ref={langRef} className="relative z-50 shrink-0">
            <button
              onClick={toggleLang}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1 text-xs uppercase font-semibold transition-colors shrink-0"
            >
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-xs">{language}</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50">
                {(['uz', 'en', 'ru'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      language === lang ? 'bg-purple-600/30 text-purple-300 font-bold' : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{lang === 'uz' ? 'O\'zbekcha' : lang === 'en' ? 'English' : 'Русский'}</span>
                    <span className="uppercase text-[10px] text-slate-500 font-mono">{lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          <div ref={userMenuRef} className="relative z-50 shrink-0">
            {user ? (
              <div>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500 text-xs font-bold transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover ring-1 ring-purple-400 shrink-0"
                  />
                  <span className="hidden md:inline truncate max-w-[90px]">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-extrabold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      {user.isVip && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-black rounded-md border border-amber-500/30">
                          VIP STATUS
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" />
                      <span>{t('auth.profile')}</span>
                    </button>

                    <button
                      onClick={() => { onNavigate('favorites'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span>{t('nav.favorites')}</span>
                    </button>

                    <button
                      onClick={() => { onNavigate('profile', { tab: 'settings' }); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <span>Sozlamalar</span>
                    </button>

                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <button
                        onClick={() => { onNavigate('admin'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 flex items-center gap-2 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span>{t('nav.admin')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-slate-800/80 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all shrink-0"
              >
                {t('auth.login')}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Full-screen / Overlay Search Modal triggered by Lupa */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 sm:p-6 animate-in fade-in">
          <div className="max-w-3xl w-full mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                <span>{language === 'uz' ? 'Anime Qidiruv' : language === 'ru' ? 'Поиск Аниме' : 'Anime Search'}</span>
              </span>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                ref={searchModalInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full bg-slate-900 border-2 border-purple-500/50 rounded-2xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 shadow-2xl transition-all"
              />
              <button
                type="button"
                onClick={onOpenVoiceSearch}
                className="absolute right-3.5 p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-purple-500/10"
                title={t('search.voice')}
              >
                <Mic className="w-5 h-5" />
              </button>
            </form>

            {/* Results or Trending */}
            <div className="max-h-[70vh] overflow-y-auto space-y-3 pr-1">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('search.results')}:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredSuggestions.map(anime => (
                      <div
                        key={anime.id}
                        onClick={() => handleSelectAnime(anime.slug)}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-900/20 cursor-pointer transition-all group"
                      >
                        <img src={anime.poster} alt={anime.title.uz} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 truncate">
                            {anime.title[language] || anime.title.uz}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{anime.genres.join(', ')}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span className="text-amber-400 font-bold">⭐ {anime.rating}</span>
                            <span>•</span>
                            <span>{anime.year}</span>
                            <span>•</span>
                            <span className="text-cyan-400 font-semibold">{anime.episodesCount} {t('player.episode_short')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-slate-400 text-sm">{t('search.no_results')}</p>
                  <button
                    onClick={() => {
                      onNavigate('catalog');
                      setIsSearchModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    {t('home.view_all')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('search.trending')}</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all"
                      >
                        🔥 {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
