import React from 'react';
import { RotateCcw, SlidersHorizontal, Search } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { AnimeCard } from '../components/AnimeCard';
import { GENRE_LIST } from '../data/mockAnimeData';
import { SeoHead } from '../components/SeoHead';

interface CatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate }) => {
  const { t, tGenre, tStatus, tCountry } = useLanguage();
  const { animeList, searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useAnime();

  // Apply filters
  const filteredList = animeList.filter(anime => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = 
        anime.title.uz.toLowerCase().includes(q) ||
        anime.title.en.toLowerCase().includes(q) ||
        anime.title.jp.toLowerCase().includes(q);
      const matchesGenre = anime.genres.some(g => g.toLowerCase().includes(q) || tGenre(g).toLowerCase().includes(q));
      if (!matchesTitle && !matchesGenre) return false;
    }

    // Genre
    if (filters.genre && !anime.genres.includes(filters.genre)) {
      return false;
    }

    // Year
    if (filters.year && anime.year.toString() !== filters.year) {
      return false;
    }

    // Status
    if (filters.status && anime.status !== filters.status) {
      return false;
    }

    // Country
    if (filters.country && anime.country !== filters.country) {
      return false;
    }

    // Audio / Sub
    if (filters.audioSub === 'dub' && !anime.hasDubUZ) return false;
    if (filters.audioSub === 'sub' && !anime.hasSub) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'latest') return b.year - a.year;
    return b.popularityScore - a.popularityScore;
  });

  return (
    <div className="space-y-8">
      <SeoHead
        title={`${t('catalog.title')} (AniSenpaiUz)`}
        description="Barcha sara animelarni janr, yil, reyting va dublyaj bo'yicha saralab toping va tomosha qiling."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">{t('catalog.title')}</h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('catalog.total_found')}: <span className="text-purple-400 font-bold">{filteredList.length}</span>
          </p>
        </div>

        {/* Live Filter Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-bold text-white text-xs flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            {t('catalog.filter')}
          </span>
          <button
            onClick={resetFilters}
            className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('catalog.reset')}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          
          {/* Genre */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.genre_label')}</label>
            <select
              value={filters.genre}
              onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t('catalog.all_genres')}</option>
              {GENRE_LIST.map(g => (
                <option key={g} value={g}>{tGenre(g)}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.year_label')}</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t('catalog.all_years')}</option>
              {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2007', '1999'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.status_label')}</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t('catalog.all_status')}</option>
              <option value="Ongoing">{tStatus('ongoing')}</option>
              <option value="Completed">{tStatus('completed')}</option>
              <option value="Upcoming">{tStatus('upcoming')}</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.country_label')}</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t('catalog.all_countries')}</option>
              <option value="Japan">{tCountry('japan')}</option>
              <option value="China">{tCountry('china')}</option>
              <option value="Korea">{tCountry('korea')}</option>
            </select>
          </div>

          {/* Audio / Sub */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.audio_label')}</label>
            <select
              value={filters.audioSub}
              onChange={(e) => setFilters(prev => ({ ...prev, audioSub: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t('catalog.all_audio')}</option>
              <option value="dub">{t('catalog.dub_uz')}</option>
              <option value="sub">{t('catalog.sub')}</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('catalog.sort_by')}</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold text-purple-300"
            >
              <option value="popular">{t('catalog.sort_popular')}</option>
              <option value="rating">{t('catalog.sort_rating')}</option>
              <option value="latest">{t('catalog.sort_latest')}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid Results */}
      {filteredList.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-4xl">🔍</p>
          <h3 className="text-lg font-bold text-white">{t('catalog.no_results')}</h3>
          <p className="text-xs text-slate-400">{t('catalog.no_results_sub')}</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            {t('catalog.reset')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} onSelect={(s) => onNavigate('anime', { slug: s })} />
          ))}
        </div>
      )}

    </div>
  );
};
