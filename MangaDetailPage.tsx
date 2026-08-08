import React, { useState } from 'react';
import { 
  BookOpen, Star, Eye, Bookmark, Heart, Coins, ArrowLeft, Lock, Check, Share2, Sparkles, User, Calendar
} from 'lucide-react';
import { useManga } from '../context/MangaContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Manga } from '../types';

interface MangaDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenCoinModal: () => void;
}

export const MangaDetailPage: React.FC<MangaDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenCoinModal
}) => {
  const { t } = useLanguage();
  const { mangas, toggleMangaBookmark, isChapterUnlocked } = useManga();
  const { user } = useAuth();

  const manga: Manga | undefined = mangas.find(m => m.slug === slug || m.id === slug);
  const [chapterOrder, setChapterOrder] = useState<'asc' | 'desc'>('asc');

  if (!manga) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-slate-400 font-bold">{t('manga.not_found')}</p>
        <button
          onClick={() => onNavigate('manga')}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs"
        >
          {t('manga.back_to_catalog')}
        </button>
      </div>
    );
  }

  const isBookmarked = user?.mangaBookmarks?.includes(manga.id);

  const sortedChapters = [...manga.chapters].sort((a, b) => {
    return chapterOrder === 'asc' ? a.chapterNumber - b.chapterNumber : b.chapterNumber - a.chapterNumber;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('manga')}
        className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('manga.back_to_catalog')}</span>
      </button>

      {/* Main Banner & Header Section */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Banner background */}
        <div className="relative h-48 sm:h-72 overflow-hidden">
          <img
            src={manga.banner || manga.poster}
            alt={manga.title.uz}
            className="w-full h-full object-cover blur-sm opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative p-6 sm:p-8 -mt-24 sm:-mt-32 flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Poster Card */}
          <div className="relative shrink-0 w-36 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30 bg-slate-950">
            <img
              src={manga.poster}
              alt={manga.title.uz}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase">
                  {manga.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {manga.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {manga.rating}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{manga.title.uz}</h1>
              <p className="text-xs text-slate-400 mt-1">{manga.originalTitle} ({manga.releaseYear})</p>
            </div>

            {/* Author & Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-400" /> Muallif: <strong className="text-white">{manga.author}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" /> Ko'rishlar: <strong className="text-white">{manga.views.toLocaleString()}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-pink-400" /> Xatcho'plar: <strong className="text-white">{manga.bookmarksCount.toLocaleString()}</strong>
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {manga.genres.map(genre => (
                <span key={genre} className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-300 text-[11px] font-semibold border border-slate-800">
                  {genre}
                </span>
              ))}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {manga.chapters.length > 0 && (
                <button
                  onClick={() => onNavigate('manga-reader', { slug: manga.slug, chapterId: manga.chapters[0].id })}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1-Bobdan Boshlash</span>
                </button>
              )}

              <button
                onClick={() => toggleMangaBookmark(manga.id)}
                className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  isBookmarked
                    ? 'bg-pink-600 text-white border-pink-500'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked ? 'Xatcho\'pda Saqlangan' : 'Xatcho\'pga Qo\'shish'}</span>
              </button>

              <button
                onClick={onOpenCoinModal}
                className="px-4 py-3 rounded-2xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Coins className="w-4 h-4" />
                <span>Coin Bilan Bob Olish ({user?.coins || 0} Coin)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Synopsis Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> Manga Haqida Tavsif
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{manga.synopsis.uz}</p>
      </div>

      {/* Chapters Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="font-extrabold text-white text-base">Barcha Boblar ({manga.chapters.length})</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChapterOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              Tartib: {chapterOrder === 'asc' ? '1 ➔ Oxirgi' : 'Oxirgi ➔ 1'}
            </button>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-2.5">
          {sortedChapters.map((ch) => {
            const unlocked = isChapterUnlocked(ch.id, ch.isFree);

            return (
              <div
                key={ch.id}
                onClick={() => onNavigate('manga-reader', { slug: manga.slug, chapterId: ch.id })}
                className="group p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center font-black text-purple-400 text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {ch.chapterNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{ch.title}</h4>
                    <p className="text-[10px] text-slate-500">{ch.views.toLocaleString()} ko'rishlar</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ch.isFree ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
                      Bepul
                    </span>
                  ) : unlocked ? (
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-extrabold flex items-center gap-1">
                      Ochilgan 🔓
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {ch.coinPrice || 5} Coin
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
