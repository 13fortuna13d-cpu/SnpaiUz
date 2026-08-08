import React, { useState, useEffect } from 'react';
import { 
  Play, Star, Heart, Share2, Volume2, Eye, Users, MessageSquare, Clock, BarChart3, ShieldCheck
} from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { AnimeCard } from '../components/AnimeCard';
import { SeoHead } from '../components/SeoHead';

interface AnimeDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenTrailer: (url: string) => void;
  onOpenShare: (title: string, url: string) => void;
  onOpenRating: (animeId: string, title: string) => void;
}

export const AnimeDetailPage: React.FC<AnimeDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenTrailer,
  onOpenShare,
  onOpenRating
}) => {
  const { t, tGenre, tStatus, tCountry, language } = useLanguage();
  const { animeList, comments, platformStats } = useAnime();
  const { isFavorite, toggleFavorite } = useAuth();

  const [activeTab, setActiveTab] = useState<'episodes' | 'screenshots' | 'details'>('episodes');
  const [animeStats, setAnimeStats] = useState<{
    viewsLogsCount: number;
    uniqueViewers: number;
    favoritedCount: number;
    lastWatchedAt: string;
  }>({
    viewsLogsCount: 15,
    uniqueViewers: 8,
    favoritedCount: 3,
    lastWatchedAt: new Date().toISOString()
  });

  const anime = animeList.find(a => a.slug === slug || a.id === slug) || animeList[0];
  const favorite = isFavorite(anime.id);

  const title = anime.title[language] || anime.title.en || anime.title.uz;
  const synopsis = anime.synopsis[language] || anime.synopsis.en || anime.synopsis.uz;
  const animeComments = comments[anime.id] || [];

  const relatedAnime = animeList.filter(a => a.id !== anime.id && a.genres.some(g => anime.genres.includes(g))).slice(0, 6);

  useEffect(() => {
    if (!anime.id) return;
    fetch(`/api/stats/anime/${anime.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.animeId) {
          setAnimeStats({
            viewsLogsCount: data.viewsLogsCount || 0,
            uniqueViewers: data.uniqueViewers || 1,
            favoritedCount: data.favoritedCount || (platformStats.favoritedMap?.[anime.id] || 0),
            lastWatchedAt: data.lastWatchedAt || new Date().toISOString()
          });
        }
      })
      .catch(err => console.error('Failed to load anime stats:', err));
  }, [anime.id, platformStats]);

  return (
    <div className="space-y-10">
      <SeoHead
        title={`${title} (AniSenpaiUz)`}
        description={synopsis.slice(0, 160)}
        image={anime.poster}
        animeData={anime}
      />

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={anime.banner} alt={title} className="w-full h-full object-cover object-top opacity-30 blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content Details Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Left Poster */}
          <div className="space-y-4 text-center md:text-left">
            <div className="relative aspect-[3/4] w-48 sm:w-60 md:w-full mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl group">
              <img src={anime.poster} alt={title} className="w-full h-full object-cover" />
              {anime.trailerUrl && (
                <button
                  onClick={() => onOpenTrailer(anime.trailerUrl!)}
                  className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="p-3 rounded-full bg-purple-600 text-white shadow-xl">
                    <Volume2 className="w-6 h-6" />
                  </div>
                </button>
              )}
            </div>

            <button
              onClick={() => onOpenRating(anime.id, title)}
              className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{t('anime.rate_this')} ({anime.rating} / 10)</span>
            </button>
          </div>

          {/* Right Info */}
          <div className="md:col-span-3 space-y-5">
            
            {/* Title & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/50 text-purple-300 font-bold text-xs uppercase">
                  {anime.type} • {tStatus(anime.status)}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {anime.rating} ({anime.votesCount} {t('anime.votes')})
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-bold text-xs flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {anime.views.toLocaleString()} {t('anime.views')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-xs font-mono">
                JP: {anime.title.jp} | EN: {anime.title.en}
              </p>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">{t('anime.studio')}</span>
                <span className="font-semibold text-white">{anime.studio}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('anime.year')}</span>
                <span className="font-semibold text-white">{anime.year}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('anime.country')}</span>
                <span className="font-semibold text-white">{tCountry(anime.country)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('anime.audio_sub')}</span>
                <span className="font-semibold text-purple-300">
                  {anime.hasDubUZ ? 'UZ Dub' : ''} {anime.hasSub ? 'Sub' : ''}
                </span>
              </div>
            </div>

            {/* Anime Real-Time Statistics Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Anime Real Statistikasi
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Bazada hisoblangan
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Ko'rishlar Soni
                  </span>
                  <p className="font-bold text-white text-sm">{anime.views.toLocaleString()}</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" /> Noyob Tomoshabinlar
                  </span>
                  <p className="font-bold text-emerald-300 text-sm">{animeStats.uniqueViewers} kishi</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400/30" /> Sevimlilar Soni
                  </span>
                  <p className="font-bold text-pink-300 text-sm">{animeStats.favoritedCount} marta</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Reyting / Ovozlar
                  </span>
                  <p className="font-bold text-amber-300 text-sm">{anime.rating} ({anime.votesCount})</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-indigo-400" /> Izohlar Soni
                  </span>
                  <p className="font-bold text-indigo-300 text-sm">{animeComments.length} ta izoh</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" /> Oxirgi Ko'rilgan Vaqt
                  </span>
                  <p className="font-semibold text-slate-300 text-[11px] truncate">
                    {new Date(animeStats.lastWatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {anime.genres.map(g => (
                <span key={g} className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-semibold">
                  {tGenre(g)}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-slate-300 text-sm leading-relaxed">
              {synopsis}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('watch', { slug: anime.slug, epId: anime.episodes[0]?.id })}
                className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-purple-600/40 transition-all hover:scale-105"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{t('anime.watch_ep1')}</span>
              </button>

              <button
                onClick={() => toggleFavorite(anime.id)}
                className={`px-5 py-3.5 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                  favorite
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
                <span>{favorite ? t('hero.in_watchlist') : t('hero.add_watchlist')}</span>
              </button>

              <button
                onClick={() => onOpenShare(title, window.location.href)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title={t('common.share')}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Tabs: Episodes vs Screenshots */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'episodes'
                ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('anime.episodes')} ({anime.episodes.length})
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'screenshots'
                ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('anime.screenshots')} ({anime.screenshots.length})
          </button>
        </div>

        {/* Episodes List Grid */}
        {activeTab === 'episodes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {anime.episodes.map(ep => {
              const epTitle = ep.title[language] || ep.title.en || ep.title.uz;
              return (
                <div
                  key={ep.id}
                  onClick={() => onNavigate('watch', { slug: anime.slug, epId: ep.id })}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-500/60 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                      #{ep.number}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs truncate group-hover:text-purple-300">
                        {epTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500">{ep.duration} • {ep.airDate}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Screenshots Gallery */}
        {activeTab === 'screenshots' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {anime.screenshots.map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discussion & Comments */}
      <CommentSection animeId={anime.id} />

      {/* Related Anime Rail */}
      {relatedAnime.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">{t('anime.related')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {relatedAnime.map(a => (
              <AnimeCard key={a.id} anime={a} onSelect={(s) => onNavigate('anime', { slug: s })} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
