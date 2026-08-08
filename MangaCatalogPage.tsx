import React, { useState } from 'react';
import { Search, Filter, Star, Eye, BookOpen, Bookmark, Sparkles, Heart } from 'lucide-react';
import { useManga } from '../context/MangaContext';
import { useLanguage } from '../context/LanguageContext';
import { Manga } from '../types';

interface MangaCatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MangaCatalogPage: React.FC<MangaCatalogPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { mangas, toggleMangaBookmark } = useManga();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'latest'>('views');

  const allGenres = Array.from(new Set(mangas.flatMap(m => m.genres)));

  const filteredMangas = mangas.filter(manga => {
    const matchesSearch = manga.title.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          manga.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || manga.genres.includes(selectedGenre);
    const matchesStatus = selectedStatus === 'all' || manga.status === selectedStatus;
    return matchesSearch && matchesGenre && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'views') return b.views - a.views;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>{t('manga.official_catalog_title')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sevimli Mangalaringizni O'zbek Tilida Mutolaa Qiling
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Yuqori sifatli tarjima, qulay Reader va eng yangi mashhur mangalar
          </p>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Manga nomi yoki muallifini qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">{t('manga.status_all')}</option>
            <option value="Ongoing">{t('manga.status_ongoing')}</option>
            <option value="Completed">{t('manga.status_completed')}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="views">{t('manga.sort_most_read')}</option>
            <option value="rating">{t('manga.sort_top_rated')}</option>
            <option value="latest">{t('manga.sort_newest')}</option>
          </select>

        </div>

        {/* Genres Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Barchasi
          </button>
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Manga Grid */}
      {filteredMangas.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-slate-400 font-bold text-sm">{t('manga.no_results')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMangas.map((manga) => (
            <div
              key={manga.id}
              className="group relative bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Poster Image Container */}
              <div
                onClick={() => onNavigate('manga-detail', { slug: manga.slug })}
                className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-slate-950"
              >
                <img
                  src={manga.poster}
                  alt={manga.title.uz}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-extrabold text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{manga.rating}</span>
                </div>

                {/* Chapters Count Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold shadow-md">
                  {manga.chapters.length} Bob
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-purple-400" />
                    {manga.views.toLocaleString()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                    {manga.status}
                  </span>
                </div>
              </div>

              {/* Title & Details */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onNavigate('manga-detail', { slug: manga.slug })}
                    className="font-bold text-xs text-white group-hover:text-purple-300 line-clamp-1 cursor-pointer transition-colors"
                  >
                    {manga.title.uz}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{manga.author}</p>
                </div>

                <button
                  onClick={() => onNavigate('manga-detail', { slug: manga.slug })}
                  className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-[11px] font-bold transition-all border border-purple-500/30 flex items-center justify-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('manga.read_btn')}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
