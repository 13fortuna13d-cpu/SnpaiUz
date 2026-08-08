import React, { useState } from 'react';
import { Compass, Sparkles, SlidersHorizontal, Layers } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { AnimeCard } from '../components/AnimeCard';
import { SeoHead } from '../components/SeoHead';

interface CategoriesPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialGenre?: string;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate, initialGenre }) => {
  const { t, tGenre } = useLanguage();
  const { animeList, categories } = useAnime();

  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre || null);

  const filteredAnime = selectedGenre
    ? animeList.filter(a => a.genres.includes(selectedGenre))
    : animeList;

  return (
    <div className="space-y-8">
      <SeoHead
        title="Anime Janrlari va Kategoriyalari (AniSenpaiUz)"
        description="Jangari, Fentezi, Komediya, Isekai va boshqa barcha janrdagi o'zbekcha animelarni toifa bo'yicha saralab tomosha qiling."
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Compass className="w-8 h-8 text-purple-400" />
            <span>{t('categories.title')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('categories.sub')}
          </p>
        </div>

        {selectedGenre && (
          <button
            onClick={() => setSelectedGenre(null)}
            className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-600/30"
          >
            {t('categories.show_all')}
          </button>
        )}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedGenre === cat.id;
          const count = animeList.filter(a => a.genres.includes(cat.id)).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedGenre(isSelected ? null : cat.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 bg-gradient-to-br ${cat.bg} ${cat.border} ${
                isSelected
                  ? 'ring-2 ring-purple-500 scale-105 shadow-xl shadow-purple-600/20'
                  : 'hover:scale-[1.03] opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.iconEmoji || cat.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-slate-800">
                  {count} {t('categories.count_suffix')}
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs truncate">
                  {tGenre(cat.id)}
                </h3>
                <span className="text-[10px] text-slate-400 block truncate">{cat.id}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Results Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>
              {selectedGenre ? `${tGenre(selectedGenre)} ${t('categories.anime_in_genre')}` : t('categories.all_sorted_anime')}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold">
              {filteredAnime.length} {t('categories.count_suffix')}
            </span>
          </h2>
        </div>

        {filteredAnime.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-4xl">📭</span>
            <h3 className="text-lg font-bold text-white">{t('categories.no_anime')}</h3>
            <p className="text-xs text-slate-400">{t('categories.no_anime_sub')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAnime.map(anime => (
              <AnimeCard key={anime.id} anime={anime} onSelect={(s) => onNavigate('anime', { slug: s })} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
