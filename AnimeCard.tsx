import React from 'react';
import { Play, Star, Heart } from 'lucide-react';
import { Anime } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (slug: string) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  const { language, t, tGenre, tStatus } = useLanguage();
  const { isFavorite, toggleFavorite } = useAuth();
  const favorite = isFavorite(anime.id);

  const title = anime.title[language] || anime.title.en || anime.title.uz;

  return (
    <div 
      onClick={() => onSelect(anime.slug)}
      className="group relative bg-slate-900/60 rounded-2xl border border-slate-800/80 hover:border-purple-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-500/10 flex flex-col"
    >
      {/* Poster Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img 
          src={anime.poster} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 font-extrabold text-[11px] flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-amber-400" />
            {anime.rating}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(anime.id);
            }}
            className={`p-1.5 rounded-xl backdrop-blur-md border transition-all ${
              favorite
                ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Sub/Dub Pills */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1 z-10">
          {anime.hasDubUZ && (
            <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold tracking-wider uppercase">
              UZ Dub
            </span>
          )}
          {anime.hasSub && (
            <span className="px-2 py-0.5 rounded-md bg-cyan-600/90 text-white text-[10px] font-bold tracking-wider uppercase">
              Sub
            </span>
          )}
          <span className="ml-auto px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-300 text-[10px] font-medium border border-slate-800">
            {anime.episodesCount} {t('player.episode_count')}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
            {anime.genres.slice(0, 2).map(g => tGenre(g)).join(' • ')}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
          <span>{anime.year}</span>
          <span className="text-cyan-400 font-semibold">{tStatus(anime.status)}</span>
        </div>
      </div>
    </div>
  );
};
