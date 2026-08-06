import React from 'react';
import { Heart, Crown, Sparkles } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';

export const SupportersSection: React.FC = () => {
  const { supporters } = useAnime();

  // Filter visible supporters and sort by displayOrder
  const visibleSupporters = supporters
    .filter(s => s.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (visibleSupporters.length === 0) return null;

  return (
    <section className="space-y-6 pt-4 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5 fill-pink-500/30" />
            </span>
            <span>❤️ Bizni qo'llab-quvvatlaganlar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Loyiha rivojiga va o'zbekcha dublyaj/subtitrlar sifatiga hissa qo'shgan aziz muxlislarimiz
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{visibleSupporters.length} ta Homiylar</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {visibleSupporters.map((supp) => (
          <div
            key={supp.id}
            className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col items-center text-center space-y-2.5 group hover:-translate-y-1 shadow-lg shadow-purple-950/10"
          >
            {/* Circle Crop Avatar */}
            <div className="relative shrink-0">
              <img
                src={supp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={supp.nickname}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400 transition-all shadow-md aspect-square"
              />
              {supp.isVip && (
                <span
                  title="VIP Foydalanuvchi"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center ring-2 ring-slate-900 shadow-md"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                </span>
              )}
            </div>

            <div className="w-full">
              <h3 className="font-extrabold text-white text-xs truncate group-hover:text-purple-300 transition-colors">
                {supp.nickname}
              </h3>

              {supp.isVip && (
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                  VIP Donor
                </span>
              )}

              {supp.dateSupported && (
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  {supp.dateSupported}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
