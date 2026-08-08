import React from 'react';
import { Heart, Play, Trash2, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { SeoHead } from '../components/SeoHead';

interface FavoritesPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { t, language } = useLanguage();
  const { user, toggleFavorite } = useAuth();
  const { animeList } = useAnime();

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
        <Heart className="w-12 h-12 text-pink-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">{t('favorites.login_required')}</h2>
        <p className="text-xs text-slate-400">
          Akkauntingizga kirib, sevimli animelaringizni saqlang va istalgan qurilmada tezda tomosha qiling.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30"
        >
          {t('auth.login')}
        </button>
      </div>
    );
  }

  const favoriteAnime = animeList.filter(a => user.favorites.includes(a.id));

  return (
    <div className="space-y-8">
      <SeoHead title="Sevimlilar Ro'yxati (AniSenpaiUz)" description="Saqlangan sevimli animelaringiz to'plami." />

      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span>{t('favorites.list_title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jami: <span className="text-pink-400 font-bold">{favoriteAnime.length} ta anime</span>
          </p>
        </div>
      </div>

      {/* Favorites List Grid */}
      {favoriteAnime.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t('favorites.empty')}</h3>
          <p className="text-xs text-slate-400">
            Animelar kartasidagi yurakcha tugmasini bosish orqali bu yerga saqlashingiz mumkin.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Katalogga o'tish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteAnime.map((anime) => {
            const animeTitle = anime.title[language] || anime.title.en || anime.title.uz;
            // Find last watched episode in history if present
            const historyItem = user.watchHistory.find(h => h.animeId === anime.id);
            const lastEpNum = historyItem ? historyItem.episodeNumber : 1;

            return (
              <div
                key={anime.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex gap-4 relative group hover:border-pink-500/40 transition-all"
              >
                <img
                  src={anime.poster}
                  alt={animeTitle}
                  onClick={() => onNavigate('anime', { slug: anime.slug })}
                  className="w-24 h-32 object-cover rounded-xl cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-600/30 text-purple-300 font-bold uppercase">
                        {anime.type}
                      </span>
                      <button
                        onClick={() => toggleFavorite(anime.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-colors"
                        title="Sevimlilardan olib tashlash"
                      >
                        <Trash2 className="w-4 h-4 text-pink-400" />
                      </button>
                    </div>

                    <h3
                      onClick={() => onNavigate('anime', { slug: anime.slug })}
                      className="font-bold text-white text-sm truncate cursor-pointer hover:text-pink-300"
                    >
                      {animeTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{anime.rating} / 10</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{anime.year}</span>
                    </div>

                    <div className="text-[11px] text-cyan-400 font-medium flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>Oxirgi ko'rilgan: {lastEpNum}-qism</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('watch', { slug: anime.slug, epId: anime.episodes[0]?.id })}
                    className="w-full mt-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('favorites.watch_btn')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
