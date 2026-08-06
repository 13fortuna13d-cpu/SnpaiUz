import React, { useState, useEffect } from 'react';
import { Play, ListVideo, Share2, Heart, Lock, Crown } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { CommentSection } from '../components/CommentSection';
import { SeoHead } from '../components/SeoHead';

interface WatchPageProps {
  slug: string;
  epId?: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenShare: (title: string, url: string) => void;
  onOpenVip?: () => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  slug,
  epId,
  onNavigate,
  onOpenShare,
  onOpenVip
}) => {
  const { t, language } = useLanguage();
  const { animeList, incrementViews } = useAnime();
  const { user, isFavorite, toggleFavorite } = useAuth();

  const anime = animeList.find(a => a.slug === slug || a.id === slug) || animeList[0];
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  useEffect(() => {
    if (epId) {
      const idx = anime.episodes.findIndex(e => e.id === epId);
      if (idx !== -1) setCurrentEpisodeIndex(idx);
    }
  }, [epId, anime]);

  useEffect(() => {
    incrementViews(anime.id);
  }, [anime.id]);

  const episode = anime.episodes[currentEpisodeIndex] || anime.episodes[0];
  const title = anime.title[language] || anime.title.en || anime.title.uz;
  const epTitle = episode.title[language] || episode.title.en || episode.title.uz;
  const favorite = isFavorite(anime.id);

  const hasNext = currentEpisodeIndex < anime.episodes.length - 1;
  const hasPrev = currentEpisodeIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      const nextEp = anime.episodes[currentEpisodeIndex + 1];
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      onNavigate('watch', { slug: anime.slug, epId: nextEp.id });
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevEp = anime.episodes[currentEpisodeIndex - 1];
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      onNavigate('watch', { slug: anime.slug, epId: prevEp.id });
    }
  };

  return (
    <div className="space-y-8">
      <SeoHead
        title={`${title} - ${t('player.episode')} ${episode.number} (SnpaiUz)`}
        description={`SnpaiUz platformasida ${title} animesining ${episode.number}-qismini Full HD 1080p va O'zbekcha dublyajda tomosha qiling.`}
        image={anime.poster}
      />

      {/* Main Video Section + Episode List Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Player & Info */}
        <div className="lg:col-span-3 space-y-4">
          
          <VideoPlayer
            episode={episode}
            animeTitle={title}
            animeId={anime.id}
            onNextEpisode={handleNext}
            onPrevEpisode={handlePrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onOpenVip={onOpenVip}
          />

          {/* Episode Title & Controls Bar */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                <span>{title} — <span className="text-purple-400">{episode.number}-{t('player.episode_short')}</span></span>
                {episode.number <= 2 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    {t('common.free')}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{t('vip.vip_episode')}</span>
                  </span>
                )}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">{epTitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {episode.number > 2 && !user?.isVip && (
                <button
                  onClick={onOpenVip}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>{t('vip.get_vip')}</span>
                </button>
              )}

              <button
                onClick={() => toggleFavorite(anime.id)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  favorite ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
                <span>{favorite ? t('hero.in_watchlist') : t('hero.add_watchlist')}</span>
              </button>

              <button
                onClick={() => onOpenShare(`${title} - ${episode.number}-${t('player.episode_short')}`, window.location.href)}
                className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comment Section */}
          <CommentSection animeId={anime.id} episodeId={episode.id} />
        </div>

        {/* Right Column: Episodes Playlist */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-purple-400" />
              {t('anime.episodes')} ({anime.episodes.length})
            </h3>
            <span className="text-xs text-purple-300 font-semibold">{episode.number} / {anime.episodes.length}</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {anime.episodes.map((ep, idx) => {
              const active = idx === currentEpisodeIndex;
              const isFree = ep.number <= 2;
              const isLocked = !isFree && !user?.isVip;
              const thisEpTitle = ep.title[language] || ep.title.en || ep.title.uz;

              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisodeIndex(idx);
                    onNavigate('watch', { slug: anime.slug, epId: ep.id });
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-purple-600/20 border-purple-500 shadow-md'
                      : isLocked
                      ? 'bg-slate-950/40 border-slate-800/80 hover:border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      active
                        ? 'bg-purple-600 text-white'
                        : isLocked
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ep.number}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold truncate ${active ? 'text-purple-300' : 'text-slate-200'}`}>
                          {thisEpTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{ep.duration}</span>
                        {isFree ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                            {t('common.free')}
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-semibold flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> VIP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {active ? (
                    <Play className="w-4 h-4 text-purple-400 fill-current shrink-0" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
