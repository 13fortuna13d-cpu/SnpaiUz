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

export const CATEGORIES_LIST = [
  { id: 'Action', nameUz: 'Jangari (Action)', icon: '⚔️', bg: 'from-red-600/20 to-orange-600/20', border: 'border-red-500/30' },
  { id: 'Adventure', nameUz: 'Sarguzasht (Adventure)', icon: '🗺️', bg: 'from-amber-600/20 to-yellow-600/20', border: 'border-amber-500/30' },
  { id: 'Comedy', nameUz: 'Komediya (Comedy)', icon: '😂', bg: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/30' },
  { id: 'Drama', nameUz: 'Drama (Drama)', icon: '🎭', bg: 'from-purple-600/20 to-indigo-600/20', border: 'border-purple-500/30' },
  { id: 'Fantasy', nameUz: 'Fentezi (Fantasy)', icon: '🔮', bg: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500/30' },
  { id: 'Romance', nameUz: 'Romantika (Romance)', icon: '❤️', bg: 'from-pink-600/20 to-rose-600/20', border: 'border-pink-500/30' },
  { id: 'Horror', nameUz: 'Dahshat (Horror)', icon: '👻', bg: 'from-slate-800 to-slate-900', border: 'border-slate-700' },
  { id: 'Mystery', nameUz: 'Sirli (Mystery)', icon: '🔍', bg: 'from-violet-600/20 to-purple-600/20', border: 'border-violet-500/30' },
  { id: 'Sci-Fi', nameUz: 'Ilmiy Fantastika (Sci-Fi)', icon: '🚀', bg: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30' },
  { id: 'Isekai', nameUz: 'Isekai (Boshqa Dunyo)', icon: 'portal', iconEmoji: '🌀', bg: 'from-fuchsia-600/20 to-pink-600/20', border: 'border-fuchsia-500/30' },
  { id: 'Slice of Life', nameUz: 'Hayotiy (Slice of Life)', icon: '☕', bg: 'from-teal-600/20 to-green-600/20', border: 'border-teal-500/30' },
  { id: 'Sports', nameUz: 'Sport (Sports)', icon: '⚽', bg: 'from-orange-600/20 to-amber-600/20', border: 'border-orange-500/30' },
  { id: 'Music', nameUz: 'Musiqiy (Music)', icon: '🎵', bg: 'from-sky-600/20 to-indigo-600/20', border: 'border-sky-500/30' },
  { id: 'School', nameUz: 'Maktab (School)', icon: '🏫', bg: 'from-lime-600/20 to-emerald-600/20', border: 'border-lime-500/30' },
];

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate, initialGenre }) => {
  const { t, tGenre } = useLanguage();
  const { animeList } = useAnime();

  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre || null);

  const filteredAnime = selectedGenre
    ? animeList.filter(a => a.genres.includes(selectedGenre))
    : animeList;

  return (
    <div className="space-y-8">
      <SeoHead
        title="Anime Janrlari va Kategoriyalari (SenpaiUz)"
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
        {CATEGORIES_LIST.map((cat) => {
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
