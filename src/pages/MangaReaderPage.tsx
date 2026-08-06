import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Settings, Moon, Sun, 
  ZoomIn, ZoomOut, Play, Pause, Bookmark, Lock, Coins, List, Sparkles, Check
} from 'lucide-react';
import { useManga } from '../context/MangaContext';
import { useAuth } from '../context/AuthContext';
import { Manga, MangaChapter } from '../types';

interface MangaReaderPageProps {
  mangaSlug: string;
  chapterId?: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenCoinModal: () => void;
}

export const MangaReaderPage: React.FC<MangaReaderPageProps> = ({
  mangaSlug,
  chapterId,
  onNavigate,
  onOpenCoinModal
}) => {
  const { mangas, unlockChapterWithCoins, isChapterUnlocked, updateMangaReadingProgress } = useManga();
  const { user } = useAuth();

  const manga: Manga | undefined = mangas.find(m => m.slug === mangaSlug || m.id === mangaSlug);
  const currentChapterIndex = manga?.chapters.findIndex(c => c.id === chapterId) ?? 0;
  const chapter: MangaChapter | undefined = manga?.chapters[currentChapterIndex >= 0 ? currentChapterIndex : 0];

  // Reader Settings State
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // pixels per tick
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState<boolean>(false);
  const [unlockMessage, setUnlockMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<any>(null);

  const isUnlocked = chapter ? isChapterUnlocked(chapter.id, chapter.isFree) : true;

  // Auto Scroll Engine
  useEffect(() => {
    if (isAutoScrolling && readingMode === 'vertical' && containerRef.current) {
      autoScrollTimerRef.current = setInterval(() => {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
          setIsAutoScrolling(false);
        } else {
          window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
        }
      }, 50);
    } else {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    }

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScrolling, readingMode, scrollSpeed]);

  // Track progress when page changes
  useEffect(() => {
    if (manga && chapter) {
      updateMangaReadingProgress(manga.id, chapter.id, chapter.chapterNumber, currentPageIndex);
    }
  }, [manga?.id, chapter?.id, currentPageIndex]);

  // Keyboard navigation for Horizontal Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!chapter || !isUnlocked) return;
      if (readingMode === 'horizontal') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          if (currentPageIndex < chapter.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
          }
        } else if (e.key === 'ArrowLeft') {
          if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingMode, currentPageIndex, chapter, isUnlocked]);

  if (!manga || !chapter) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-slate-400 font-bold">Manga yoki Bob topilmadi!</p>
        <button
          onClick={() => onNavigate('manga')}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs"
        >
          Manga Kataloagiga Qaytish
        </button>
      </div>
    );
  }

  const prevChapter = currentChapterIndex > 0 ? manga.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < manga.chapters.length - 1 ? manga.chapters[currentChapterIndex + 1] : null;

  const handleUnlock = () => {
    setUnlockMessage(null);
    const res = unlockChapterWithCoins(manga.id, chapter.id, chapter.coinPrice || 5);
    if (res.success) {
      setUnlockMessage({ text: res.message, isError: false });
    } else {
      setUnlockMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-stone-100 text-stone-900'
    }`}>
      
      {/* Top Floating Control Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        themeMode === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-stone-100/90 border-stone-300'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('manga-detail', { slug: manga.slug })}
              className={`p-2 rounded-xl transition-all ${
                themeMode === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-slate-300' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-extrabold truncate max-w-[180px] sm:max-w-xs">{manga.title.uz}</h1>
              <p className="text-[11px] text-purple-400 font-bold">{chapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Chapters Dropdown Trigger */}
            <button
              onClick={() => setIsChaptersOpen(!isChaptersOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-stone-200 border-stone-300 text-stone-800'
              }`}
            >
              <List className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Boblar</span>
            </button>

            {/* Reading Settings Toggle */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-xl border transition-all ${
                isSettingsOpen
                  ? 'bg-purple-600 text-white border-purple-500'
                  : (themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-stone-200 border-stone-300 text-stone-800')
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Reader Settings Drawer */}
        {isSettingsOpen && (
          <div className={`border-t px-4 py-3 text-xs space-y-3 animate-fadeIn ${
            themeMode === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-stone-200/95 border-stone-300'
          }`}>
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Reading Mode */}
              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase opacity-70">O'qish Rejimi</span>
                <div className="flex rounded-xl overflow-hidden border border-purple-500/30">
                  <button
                    onClick={() => setReadingMode('vertical')}
                    className={`flex-1 py-1.5 font-bold transition-all ${readingMode === 'vertical' ? 'bg-purple-600 text-white' : 'bg-transparent'}`}
                  >
                    Vertikal
                  </button>
                  <button
                    onClick={() => setReadingMode('horizontal')}
                    className={`flex-1 py-1.5 font-bold transition-all ${readingMode === 'horizontal' ? 'bg-purple-600 text-white' : 'bg-transparent'}`}
                  >
                    Varaqlash
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase opacity-70">Foni Rang</span>
                <div className="flex rounded-xl overflow-hidden border border-purple-500/30">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`flex-1 py-1.5 font-bold flex items-center justify-center gap-1 transition-all ${themeMode === 'dark' ? 'bg-slate-950 text-white' : 'bg-transparent'}`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Qorong'u
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`flex-1 py-1.5 font-bold flex items-center justify-center gap-1 transition-all ${themeMode === 'light' ? 'bg-white text-black' : 'bg-transparent'}`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Yorug'
                  </button>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase opacity-70">Masshtab ({zoomLevel}%)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                    className="p-1.5 rounded-lg bg-slate-800 text-white font-bold"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold w-12 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                    className="p-1.5 rounded-lg bg-slate-800 text-white font-bold"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Auto Scroll */}
              {readingMode === 'vertical' && (
                <div className="space-y-1">
                  <span className="font-bold text-[10px] uppercase opacity-70">Avto-Skroll</span>
                  <button
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className={`w-full py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                      isAutoScrolling ? 'bg-emerald-600 text-white' : 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoScrolling ? 'To\'xtatish' : 'Boshlash'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Chapters Dropdown Modal */}
        {isChaptersOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">Barcha Boblar Ro'yxati</h3>
                <button onClick={() => setIsChaptersOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {manga.chapters.map((ch) => {
                  const unlocked = isChapterUnlocked(ch.id, ch.isFree);
                  const isCurrent = ch.id === chapter.id;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setIsChaptersOpen(false);
                        onNavigate('manga-reader', { slug: manga.slug, chapterId: ch.id });
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{ch.title}</span>
                      </div>

                      {ch.isFree ? (
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          Bepul
                        </span>
                      ) : unlocked ? (
                        <span className="text-[10px] font-extrabold text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full">
                          Ochilgan 🔓
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Coins className="w-3 h-3" /> {ch.coinPrice || 5} Coin
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Reader Content Body */}
      <main ref={containerRef} className="max-w-4xl mx-auto py-6 px-2 min-h-[80vh] flex flex-col items-center">
        
        {!isUnlocked ? (
          /* Locked Chapter Screen */
          <div className="my-12 p-8 max-w-lg w-full bg-slate-900/90 border border-amber-500/40 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">Ushbu Bob Qulflangan!</h2>
              <p className="text-xs text-slate-400 mt-2">
                Ushbu premium bobni o'qish uchun {chapter.coinPrice || 5} Coin sarflashingiz kerak.
              </p>
            </div>

            {unlockMessage && (
              <div className={`p-3 rounded-2xl text-xs font-bold ${
                unlockMessage.isError ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {unlockMessage.text}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleUnlock}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-5 h-5" />
                <span>{chapter.coinPrice || 5} Coin Bilan Ochish</span>
              </button>

              <button
                onClick={onOpenCoinModal}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Coin Balansni To'ldirish ({user?.coins || 0} Coin)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Reader Images Container */
          <div className="w-full space-y-4" style={{ zoom: `${zoomLevel}%` }}>
            
            {readingMode === 'vertical' ? (
              /* Vertical Mode */
              <div className="space-y-2 flex flex-col items-center">
                {chapter.pages.map((pageUrl, idx) => (
                  <div key={idx} className="relative w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={pageUrl}
                      alt={`${chapter.title} - ${idx + 1}-sahifa`}
                      className="w-full h-auto object-contain block"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] text-slate-400 font-mono">
                      {idx + 1} / {chapter.pages.length}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* Horizontal Varaqlash Mode */
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center">
                  <img
                    src={chapter.pages[currentPageIndex]}
                    alt={`${chapter.title} - ${currentPageIndex + 1}-sahifa`}
                    className="w-full h-auto object-contain"
                  />

                  {/* Nav overlays */}
                  <button
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex(prev => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    disabled={currentPageIndex === chapter.pages.length - 1}
                    onClick={() => setCurrentPageIndex(prev => prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-400">Sahifa {currentPageIndex + 1} / {chapter.pages.length}</span>
                </div>
              </div>
            )}

            {/* Bottom Next / Prev Chapter Controls */}
            <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
              {prevChapter ? (
                <button
                  onClick={() => onNavigate('manga-reader', { slug: manga.slug, chapterId: prevChapter.id })}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi Bob ({prevChapter.chapterNumber})</span>
                </button>
              ) : <div />}

              {nextChapter ? (
                <button
                  onClick={() => onNavigate('manga-reader', { slug: manga.slug, chapterId: nextChapter.id })}
                  className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <span>Keyingi Bob ({nextChapter.chapterNumber})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : <div />}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
