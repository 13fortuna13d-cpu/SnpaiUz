import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AnimeProvider } from './context/AnimeContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { ShareModal } from './components/ShareModal';
import { RatingModal } from './components/RatingModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { WatchPage } from './pages/WatchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';

export default function App() {
  // Parse location hash for direct link navigation
  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return { page: 'home', params: {} };

    if (hash.startsWith('anime/')) {
      const parts = hash.split('/');
      return { page: 'anime', params: { slug: parts[1] || 'solo-leveling' } };
    }
    if (hash.startsWith('watch/')) {
      const parts = hash.split('/');
      return { page: 'watch', params: { slug: parts[1] || 'solo-leveling', epId: parts[2] } };
    }
    if (hash.startsWith('categories')) {
      const genre = new URLSearchParams(hash.split('?')[1] || '').get('genre');
      return { page: 'categories', params: { genre: genre || undefined } };
    }
    if (hash.startsWith('profile')) {
      const tab = new URLSearchParams(hash.split('?')[1] || '').get('tab');
      return { page: 'profile', params: { tab: tab || undefined } };
    }
    if (hash.startsWith('legal')) {
      const doc = new URLSearchParams(hash.split('?')[1] || '').get('doc');
      return { page: 'legal', params: { doc: doc || undefined } };
    }

    const validPages = ['home', 'catalog', 'categories', 'favorites', 'profile', 'admin', 'legal'];
    if (validPages.includes(hash)) {
      return { page: hash, params: {} };
    }
    return { page: 'home', params: {} };
  };

  const initialRoute = parseHash();
  const [activePage, setActivePage] = useState<string>(initialRoute.page);
  const [pageParams, setPageParams] = useState<any>(initialRoute.params);

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const [ratingData, setRatingData] = useState<{ animeId: string; title: string } | null>(null);

  const handleNavigate = (page: string, params: any = {}) => {
    setActivePage(page);
    setPageParams(params);

    // Sync hash location for clean deep-linking across devices
    let hash = `#${page}`;
    if (page === 'anime' && params.slug) {
      hash = `#anime/${params.slug}`;
    } else if (page === 'watch' && params.slug) {
      hash = `#watch/${params.slug}${params.epId ? `/${params.epId}` : ''}`;
    } else if (page === 'categories' && params.genre) {
      hash = `#categories?genre=${encodeURIComponent(params.genre)}`;
    } else if (page === 'profile' && params.tab) {
      hash = `#profile?tab=${encodeURIComponent(params.tab)}`;
    } else if (page === 'legal' && params.doc) {
      hash = `#legal?doc=${encodeURIComponent(params.doc)}`;
    }

    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash();
      setActivePage(route.page);
      setPageParams(route.params);
    };
    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Global Anti-Download and Anti-Screen Record Protections
  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'VIDEO' || target.tagName === 'AUDIO' || target.closest('video') || target.closest('audio'))) {
        e.preventDefault();
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText('');
      }
      // Block Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      // Block Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleGlobalContextMenu);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AnimeProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col justify-between pb-16 md:pb-0 overflow-x-clip w-full max-w-full">
            
            {/* Header */}
            <Header
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenVip={() => setIsVipOpen(true)}
              onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
              onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
              activePage={activePage}
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 w-full flex-1 overflow-x-hidden">
              {activePage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onOpenTrailer={(url) => setTrailerUrl(url)}
                />
              )}

              {activePage === 'catalog' && (
                <CatalogPage onNavigate={handleNavigate} />
              )}

              {activePage === 'categories' && (
                <CategoriesPage
                  onNavigate={handleNavigate}
                  initialGenre={pageParams.genre}
                />
              )}

              {activePage === 'favorites' && (
                <FavoritesPage
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              )}

              {activePage === 'anime' && (
                <AnimeDetailPage
                  slug={pageParams.slug || 'solo-leveling'}
                  onNavigate={handleNavigate}
                  onOpenTrailer={(url) => setTrailerUrl(url)}
                  onOpenShare={(title, url) => setShareData({ title, url })}
                  onOpenRating={(animeId, title) => setRatingData({ animeId, title })}
                />
              )}

              {activePage === 'watch' && (
                <WatchPage
                  slug={pageParams.slug || 'solo-leveling'}
                  epId={pageParams.epId}
                  onNavigate={handleNavigate}
                  onOpenShare={(title, url) => setShareData({ title, url })}
                  onOpenVip={() => setIsVipOpen(true)}
                />
              )}

              {activePage === 'profile' && (
                <ProfilePage
                  initialTab={pageParams.tab || 'overview'}
                  onNavigate={handleNavigate}
                  onOpenVip={() => setIsVipOpen(true)}
                />
              )}

              {activePage === 'admin' && (
                <AdminPage />
              )}

              {activePage === 'legal' && (
                <LegalPage tab={pageParams.tab || 'dmca'} />
              )}
            </main>

            {/* Footer */}
            <Footer onNavigate={handleNavigate} />

            {/* Floating Mobile Bottom Navigation */}
            <BottomNav
              activePage={activePage}
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthOpen(true)}
            />

            {/* Modals & Drawers */}
            {isAuthOpen && (
              <AuthModal onClose={() => setIsAuthOpen(false)} />
            )}

            {isVipOpen && (
              <PaymentModal onClose={() => setIsVipOpen(false)} />
            )}

            {isNotificationsOpen && (
              <NotificationsDrawer
                onClose={() => setIsNotificationsOpen(false)}
                onNavigate={handleNavigate}
              />
            )}

            {isVoiceSearchOpen && (
              <VoiceSearchModal
                onClose={() => setIsVoiceSearchOpen(false)}
                onNavigateCatalog={() => handleNavigate('catalog')}
              />
            )}

            {trailerUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video">
                  <button
                    onClick={() => setTrailerUrl(null)}
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-950/80 text-white font-bold text-xs border border-slate-800"
                  >
                    Yopish ✕
                  </button>
                  <iframe
                    src={trailerUrl}
                    title="Anime Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {shareData && (
              <ShareModal
                title={shareData.title}
                url={shareData.url}
                onClose={() => setShareData(null)}
              />
            )}

            {ratingData && (
              <RatingModal
                animeId={ratingData.animeId}
                animeTitle={ratingData.title}
                onClose={() => setRatingData(null)}
              />
            )}

            {/* PWA Prompt Banner */}
            <PwaInstallPrompt />

          </div>
        </AnimeProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</ErrorBoundary>
  );
}
