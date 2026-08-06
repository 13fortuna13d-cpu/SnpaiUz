import React from 'react';
import { Send, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';

export const TelegramBanner: React.FC = () => {
  const { socialSettings } = useAnime();

  if (!socialSettings.showTelegramBanner || !socialSettings.telegramUrl) {
    return null;
  }

  return (
    <div className="telegram-banner max-w-7xl mx-auto px-4 my-6">
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300 border border-sky-500/30 dark:border-sky-500/40 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-indigo-500/10 dark:from-sky-950/80 dark:via-purple-950/60 dark:to-slate-900 shadow-xl shadow-sky-500/5 dark:shadow-sky-950/20">
        {/* Subtle decorative glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left Info Section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 shrink-0">
              <Send className="w-6 h-6 sm:w-7 sm:h-7 -ml-0.5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider border border-sky-500/30">
                  Rasmiy Telegram
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Rasmiy Kanal
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {socialSettings.telegramBannerTitle || "AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl font-medium">
                {socialSettings.telegramBannerDesc || "Eng so'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo'lib xabardor bo'ling!"}
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-3">
            <a
              href={socialSettings.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Kanalga A'zo Bo'lish</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
