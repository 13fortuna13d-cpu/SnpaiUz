import React, { useState, useEffect } from 'react';
import { Play, Star, Plus, Check, ChevronLeft, ChevronRight, Sparkles, Volume2 } from 'lucide-react';
import { Anime } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeroSliderProps {
  featuredAnimeList: Anime[];
  onSelectAnime: (slug: string) => void;
  onOpenTrailer: (url: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  featuredAnimeList,
  onSelectAnime,
  onOpenTrailer
}) => {
  const { language, t, tGenre } = useLanguage();
  const { isFavorite, toggleFavorite } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredAnimeList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnimeList.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredAnimeList]);

  if (!featuredAnimeList.length) return null;

  const current = featuredAnimeList[currentIndex];
  const title = current.title[language] || current.title.en || current.title.uz;
  const synopsis = current.synopsis[language] || current.synopsis.en || current.synopsis.uz;
  const inWatchlist = isFavorite(current.id);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl mb-12 group">
      
      {/* Background Banner Image */}
      <div className="absolute inset-0">
        <img 
          src={current.banner} 
          alt={title}
          className="w-full h-full object-cover object-top transition-all duration-700 scale-105 group-hover:scale-100"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t('hero.top_pick')}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {current.rating} ({current.imdbRating} IMDB)
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-cyan-300 text-xs font-semibold">
              {current.year} • {current.studio}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
            {current.genres.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80">
                {tGenre(g)}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed font-normal">
            {synopsis}
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectAnime(current.slug)}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-purple-600/40 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-white" />
              {t('hero.watch_now')}
            </button>

            {current.trailerUrl && (
              <button
                onClick={() => onOpenTrailer(current.trailerUrl!)}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                {t('anime.trailer')}
              </button>
            )}

            <button
              onClick={() => toggleFavorite(current.id)}
              className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all ${
                inWatchlist
                  ? 'bg-pink-600 border-pink-500 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={inWatchlist ? t('hero.in_watchlist') : t('hero.add_watchlist')}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={() => setCurrentIndex((currentIndex - 1 + featuredAnimeList.length) % featuredAnimeList.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % featuredAnimeList.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20">
        {featuredAnimeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === idx ? 'w-8 bg-purple-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
