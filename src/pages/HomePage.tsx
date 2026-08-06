import React from 'react';
import { Play, Flame, Star, ChevronRight, Clock, Award, Compass, BarChart3, Users, Eye, Heart, Activity, UserPlus, TrendingUp } from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { AnimeCard } from '../components/AnimeCard';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GENRE_LIST } from '../data/mockAnimeData';
import { SeoHead } from '../components/SeoHead';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenTrailer: (url: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenTrailer }) => {
  const { t, tGenre, language, getAnimeTitle } = useLanguage();
  const { animeList, ads, setFilters, platformStats } = useAnime();
  const { user } = useAuth();

  const featured = animeList.filter(a => a.isFeatured || a.isTrending);
  const trending = animeList.filter(a => a.isTrending);
  const popular = animeList.filter(a => a.isPopular);
  const topRated = [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 10);

  const topFavoritedAnime = [...animeList].sort((a, b) => {
    const countA = (platformStats.favoritedMap && platformStats.favoritedMap[a.id]) || 0;
    const countB = (platformStats.favoritedMap && platformStats.favoritedMap[b.id]) || 0;
    return countB - countA;
  }).slice(0, 6);

  const headerAd = ads.find(a => a.position === 'header' && a.active);

  return (
    <div className="space-y-12">
      <SeoHead
        title="SnpaiUz - Professional Anime Streaming Platform"
        description="SnpaiUz - O'zbekistonda eng so'nggi va ommabop animelarni Full HD 1080p sifatda, o'zbekcha dublyajda tomosha qiling."
      />

      {/* Ad Banner Widget */}
      {headerAd && (
        <div className="max-w-7xl mx-auto px-4">
          <a
            href={headerAd.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="block p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-cyan-900/30 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all text-center text-xs font-semibold text-purple-200"
          >
            📢 {headerAd.title}
          </a>
        </div>
      )}

      {/* Hero Featured Carousel or Empty Catalog Banner */}
      {animeList.length > 0 ? (
        <HeroSlider
          featuredAnimeList={featured.length ? featured : animeList}
          onSelectAnime={(slug) => onNavigate('anime', { slug })}
          onOpenTrailer={onOpenTrailer}
        />
      ) : (
        <div className="relative w-full p-10 sm:p-16 rounded-3xl bg-slate-900/80 border border-purple-500/30 text-center space-y-4 max-w-4xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">{t('home.empty_catalog_title')}</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            {t('home.empty_catalog_desc')}
          </p>
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <button
              onClick={() => onNavigate('admin')}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/40 transition-all"
            >
              <span>{t('home.upload_admin_btn')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Continue Watching Section (If logged in & history exists) */}
      {user && user.watchHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              {t('home.continue_watching')}
            </h2>
            <button
              onClick={() => onNavigate('profile', { tab: 'history' })}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{t('home.view_all')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.watchHistory.slice(0, 3).map((item) => {
              const anime = animeList.find(a => a.id === item.animeId);
              if (!anime) return null;
              const ep = anime.episodes.find(e => e.id === item.episodeId) || anime.episodes[0];
              const progressPct = Math.min(100, Math.floor((item.progressSeconds / (item.totalSeconds || 1)) * 100));

              const animeTitle = anime.title[language] || anime.title.en || anime.title.uz;
              const epTitle = ep.title[language] || ep.title.en || ep.title.uz;

              return (
                <div
                  key={item.animeId}
                  onClick={() => onNavigate('watch', { slug: anime.slug, epId: ep.id })}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 flex items-center gap-3 cursor-pointer hover:border-purple-500/50 transition-all group"
                >
                  <img src={anime.poster} alt={animeTitle} className="w-16 h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-white text-sm truncate group-hover:text-purple-300">
                      {animeTitle}
                    </h4>
                    <p className="text-xs text-purple-300 font-medium">
                      {ep.number}-{t('player.episode_short')}: {epTitle}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Trending Anime Rail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            {t('home.trending')}
          </h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{t('home.view_all')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.slice(0, 6).map(anime => (
            <AnimeCard key={anime.id} anime={anime} onSelect={(slug) => onNavigate('anime', { slug })} />
          ))}
        </div>
      </section>

      {/* Most Popular Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            {t('home.popular')}
          </h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{t('home.view_all')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popular.slice(0, 6).map(anime => (
            <AnimeCard key={anime.id} anime={anime} onSelect={(slug) => onNavigate('anime', { slug })} />
          ))}
        </div>
      </section>

      {/* Top 10 Rated Anime Banner */}
      <section className="space-y-4 bg-slate-900/40 rounded-3xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          {t('home.top_rated')} TOP 5
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topRated.slice(0, 5).map((anime, index) => {
            const animeTitle = anime.title[language] || anime.title.en || anime.title.uz;
            return (
              <div
                key={anime.id}
                onClick={() => onNavigate('anime', { slug: anime.slug })}
                className="relative bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 flex md:flex-col items-center gap-3 cursor-pointer hover:border-purple-500/50 transition-all group"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-purple-600/30 z-10">
                  #{index + 1}
                </span>
                <img src={anime.poster} alt={animeTitle} className="w-20 h-28 md:w-full md:h-44 object-cover rounded-xl" />
                <div className="flex-1 text-left md:text-center space-y-1">
                  <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-purple-300">
                    {animeTitle}
                  </h4>
                  <p className="text-[11px] text-amber-400 font-bold">⭐ {anime.rating} / 10</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Genre Categories Chips */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          {t('home.genres')}
        </h2>

        <div className="flex flex-wrap gap-2">
          {GENRE_LIST.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setFilters(prev => ({ ...prev, genre }));
                onNavigate('catalog');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-purple-600/30 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              {tGenre(genre)}
            </button>
          ))}
        </div>
      </section>

      {/* Real-Time Platform Statistics Engine Section */}
      <section className="space-y-6 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span>{t('home.stats_title')}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('home.stats_sub')}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('home.real_sync')}</span>
          </div>
        </div>

        {/* Real Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.total_anime')}</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{animeList.length}</p>
            <span className="text-[11px] text-purple-300 font-medium block">{t('home.total_anime_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.total_users')}</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.totalUsers}</p>
            <span className="text-[11px] text-emerald-400 font-medium block">
              +{platformStats.usersToday} {t('home.users_today')}
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.users_7days')}</span>
              <UserPlus className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.usersLast7Days}</p>
            <span className="text-[11px] text-slate-400 font-medium block">{t('home.users_7days_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.total_views')}</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.totalViews.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-300 font-medium block">{t('home.total_views_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.today_views')}</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.todayViews.toLocaleString()}</p>
            <span className="text-[11px] text-amber-300 font-medium block">{t('home.today_views_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.weekly_views')}</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.weeklyViews.toLocaleString()}</p>
            <span className="text-[11px] text-indigo-300 font-medium block">{t('home.weekly_views_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.monthly_views')}</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.monthlyViews.toLocaleString()}</p>
            <span className="text-[11px] text-rose-300 font-medium block">{t('home.monthly_views_sub')}</span>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t('home.total_favorites')}</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" />
            </div>
            <p className="text-2xl font-black text-white">{platformStats.totalFavorites}</p>
            <span className="text-[11px] text-pink-300 font-medium block">{t('home.total_favorites_sub')}</span>
          </div>
        </div>

        {/* Eng Ko'p Sevimlilarga Qo'shilgan Animelar Row */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>{t('home.top_favorited')}</span>
            </h3>
            <span className="text-xs text-slate-400">{t('home.top_favorited_sub')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topFavoritedAnime.map(anime => {
              const animeTitle = getAnimeTitle(anime.title);
              const favs = (platformStats.favoritedMap && platformStats.favoritedMap[anime.id]) || 0;
              return (
                <div
                  key={anime.id}
                  onClick={() => onNavigate('anime', { slug: anime.slug })}
                  className="bg-slate-900/70 hover:bg-slate-800 rounded-xl p-2.5 border border-slate-800 hover:border-pink-500/40 cursor-pointer transition-all text-center space-y-1.5 group"
                >
                  <img src={anime.poster} alt={animeTitle} className="w-full h-28 object-cover rounded-lg" />
                  <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-pink-300">
                    {animeTitle}
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-pink-400">
                    <Heart className="w-3 h-3 fill-pink-400" />
                    <span>{favs} {t('home.favorited_count')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
