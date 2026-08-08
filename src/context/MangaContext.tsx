import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Manga, MangaChapter, CoinPackage } from '../types';
import { INITIAL_MANGA_DATA, DEFAULT_COIN_PACKAGES } from '../data/mockMangaData';
import { useAuth } from './AuthContext';

interface MangaContextType {
  mangas: Manga[];
  coinPackages: CoinPackage[];
  pricePerCoin: number;
  updatePricePerCoin: (newRateUZS: number) => void;
  addManga: (mangaData: Partial<Manga>) => Manga;
  updateManga: (id: string, updates: Partial<Manga>) => void;
  deleteManga: (id: string) => void;
  addChapter: (mangaId: string, chapterData: Partial<MangaChapter>) => MangaChapter;
  updateChapter: (mangaId: string, chapterId: string, updates: Partial<MangaChapter>) => void;
  deleteChapter: (mangaId: string, chapterId: string) => void;
  unlockChapterWithCoins: (mangaId: string, chapterId: string, coinCost: number) => { success: boolean; message: string };
  buyCoinsPackage: (pkg: CoinPackage, paymentMethod: 'click' | 'payme' | 'card' | 'paynet') => void;
  toggleMangaBookmark: (mangaId: string) => void;
  updateMangaReadingProgress: (mangaId: string, chapterId: string, chapterNumber: number, pageIndex: number) => void;
  isChapterUnlocked: (chapterId: string, isFree: boolean) => boolean;
  updateCoinPackagePrice: (pkgId: string, newPriceUZS: number) => void;
}

const MangaContext = createContext<MangaContextType | undefined>(undefined);

export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserCoinsState } = useAuth();

  // Load Initial Manga List safely
  const [mangas, setMangas] = useState<Manga[]>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_mangas');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading mangas from localStorage:', e);
    }
    return INITIAL_MANGA_DATA;
  });

  // Load Coin Packages safely
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_coin_packages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading coin packages from localStorage:', e);
    }
    return DEFAULT_COIN_PACKAGES;
  });

  // Load Price per coin
  const [pricePerCoin, setPricePerCoin] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_price_per_coin');
      if (saved) {
        const val = Number(saved);
        if (!isNaN(val) && val > 0) return val;
      }
    } catch (e) {
      console.error('Error loading price per coin from localStorage:', e);
    }
    return 200; // Default: 1 Coin = 200 UZS
  });

  // Persist Mangas
  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_mangas', JSON.stringify(mangas));
    } catch (e) {
      console.error('Error saving mangas to localStorage:', e);
    }
  }, [mangas]);

  // Persist Coin Packages
  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_coin_packages', JSON.stringify(coinPackages));
    } catch (e) {
      console.error('Error saving coin packages to localStorage:', e);
    }
  }, [coinPackages]);

  // CREATE MANGA
  const addManga = (data: Partial<Manga>): Manga => {
    const id = 'manga-' + Date.now();
    const rawTitle = data.title?.uz || data.title?.en || 'Yangi Manga';
    const generatedSlug = rawTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const newManga: Manga = {
      id,
      slug: data.slug || generatedSlug || id,
      title: {
        uz: data.title?.uz || 'Yangi Manga',
        en: data.title?.en || 'New Manga',
        jp: data.title?.jp || '新しいマンガ',
        ...data.title
      },
      originalTitle: data.originalTitle || '',
      synopsis: {
        uz: data.synopsis?.uz || '',
        en: data.synopsis?.en || '',
        ru: data.synopsis?.ru || '',
        ...data.synopsis
      },
      poster: data.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      banner: data.banner || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      author: data.author || 'Noma\'lum',
      artist: data.artist || 'Noma\'lum',
      genres: Array.isArray(data.genres) && data.genres.length > 0 ? data.genres : ['Ekshn'],
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: data.status || 'Ongoing',
      language: data.language || "O'zbekcha",
      releaseYear: data.releaseYear || new Date().getFullYear(),
      rating: data.rating ?? 9.0,
      views: data.views || 0,
      likes: data.likes || 0,
      bookmarksCount: data.bookmarksCount || 0,
      isPremium: !!data.isPremium,
      coinPrice: data.coinPrice || 0,
      chapters: Array.isArray(data.chapters) ? data.chapters : [],
      createdAt: data.createdAt || new Date().toISOString()
    };

    setMangas(prev => [newManga, ...prev]);
    return newManga;
  };

  // UPDATE MANGA
  const updateManga = (id: string, updates: Partial<Manga>) => {
    setMangas(prev =>
      prev.map(m => {
        if (m.id !== id) return m;

        return {
          ...m,
          ...updates,
          title: updates.title ? { ...m.title, ...updates.title } : m.title,
          synopsis: updates.synopsis ? { ...m.synopsis, ...updates.synopsis } : m.synopsis,
        };
      })
    );
  };

  // DELETE MANGA
  const deleteManga = (id: string) => {
    setMangas(prev => prev.filter(m => m.id !== id));
  };

  // CREATE CHAPTER
  const addChapter = (mangaId: string, chapterData: Partial<MangaChapter>): MangaChapter => {
    const id = 'ch-' + Date.now();
    const chNum = chapterData.chapterNumber ?? 1;

    const newChapter: MangaChapter = {
      id,
      mangaId,
      chapterNumber: chNum,
      title: chapterData.title || `${chNum}-Bob`,
      pages: Array.isArray(chapterData.pages) && chapterData.pages.length > 0
        ? chapterData.pages
        : [
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
          ],
      isFree: chapterData.isFree ?? true,
      coinPrice: chapterData.coinPrice ?? 5,
      views: chapterData.views || 0,
      createdAt: chapterData.createdAt || new Date().toISOString()
    };

    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        // Prevent duplicate chapter IDs or numbers if possible, maintain sorted order
        const filteredChapters = m.chapters.filter(c => c.id !== id);
        const updatedChapters = [...filteredChapters, newChapter].sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
        return {
          ...m,
          chapters: updatedChapters
        };
      }
      return m;
    }));

    return newChapter;
  };

  // UPDATE CHAPTER
  const updateChapter = (mangaId: string, chapterId: string, updates: Partial<MangaChapter>) => {
    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        const updatedChapters = m.chapters.map(c => {
          if (c.id === chapterId) {
            return { ...c, ...updates };
          }
          return c;
        }).sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));

        return {
          ...m,
          chapters: updatedChapters
        };
      }
      return m;
    }));
  };

  // DELETE CHAPTER
  const deleteChapter = (mangaId: string, chapterId: string) => {
    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        return {
          ...m,
          chapters: m.chapters.filter(c => c.id !== chapterId)
        };
      }
      return m;
    }));
  };

  // CHECK IF CHAPTER IS UNLOCKED
  const isChapterUnlocked = useCallback((chapterId: string, isFree: boolean): boolean => {
    if (isFree) return true;
    if (user?.isVip) return true;
    if (user?.unlockedChapters && Array.isArray(user.unlockedChapters)) {
      return user.unlockedChapters.includes(chapterId);
    }
    return false;
  }, [user]);

  // UNLOCK CHAPTER WITH COINS
  const unlockChapterWithCoins = (mangaId: string, chapterId: string, coinCost: number) => {
    if (!user) {
      return { success: false, message: "Bobni ochish uchun avval tizimga kiring!" };
    }

    if (isChapterUnlocked(chapterId, false)) {
      return { success: true, message: "Ushbu bob allaqachon ochiq!" };
    }

    if ((user.coins || 0) < coinCost) {
      return { success: false, message: `Balansingizda yetarli Coin mavjud emas! (Kerak: ${coinCost} Coin)` };
    }

    // Deduct coins & record unlock
    updateUserCoinsState(-coinCost, 'spend', `Manga bobini ochish (${coinCost} Coin)`, chapterId, mangaId);

    return { success: true, message: "Bob muvaffaqiyatli ochildi! Yoqimli mutolaa tilaymiz!" };
  };

  // BUY COINS PACKAGE
  const buyCoinsPackage = (pkg: CoinPackage, paymentMethod: 'click' | 'payme' | 'card' | 'paynet') => {
    if (!user) return;
    const totalCoinsEarned = pkg.coins + (pkg.bonusCoins || 0);

    // Add Coins to user balance
    updateUserCoinsState(
      totalCoinsEarned,
      'topup',
      `${paymentMethod.toUpperCase()} orqali ${totalCoinsEarned} Coin paket xaridi`,
      undefined,
      undefined,
      pkg
    );
  };

  // TOGGLE MANGA BOOKMARK
  const toggleMangaBookmark = (mangaId: string) => {
    if (!user) return;
    const bookmarks = Array.isArray(user.mangaBookmarks) ? user.mangaBookmarks : [];
    const isBookmarked = bookmarks.includes(mangaId);
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== mangaId)
      : [...bookmarks, mangaId];

    // Update in AuthContext
    updateUserCoinsState(0, 'admin_adjust', 'Bookmark update', undefined, mangaId, undefined, updatedBookmarks);

    // Update manga bookmarksCount in local state safely
    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        const currentCount = typeof m.bookmarksCount === 'number' ? m.bookmarksCount : 0;
        return {
          ...m,
          bookmarksCount: Math.max(0, currentCount + (isBookmarked ? -1 : 1))
        };
      }
      return m;
    }));
  };

  // UPDATE COIN PRICE RATE
  const updatePricePerCoin = (newRateUZS: number) => {
    const rate = Math.max(1, newRateUZS);
    setPricePerCoin(rate);
    try {
      localStorage.setItem('senpaiuz_price_per_coin', String(rate));
    } catch (e) {
      console.error('Error saving price per coin:', e);
    }
    setCoinPackages(prev => prev.map(pkg => ({
      ...pkg,
      priceUZS: pkg.coins * rate
    })));
  };

  // SAVE READING PROGRESS
  const updateMangaReadingProgress = (mangaId: string, chapterId: string, chapterNumber: number, pageIndex: number) => {
    if (!user) return;
    const history = Array.isArray(user.mangaReadingHistory) ? user.mangaReadingHistory : [];
    const filtered = history.filter(h => h.mangaId !== mangaId);
    const newItem = {
      mangaId,
      chapterId,
      chapterNumber,
      pageIndex,
      updatedAt: new Date().toISOString()
    };

    updateUserCoinsState(
      0,
      'admin_adjust',
      'Reading history update',
      undefined,
      undefined,
      undefined,
      undefined,
      [newItem, ...filtered]
    );
  };

  // UPDATE INDIVIDUAL PACKAGE PRICE
  const updateCoinPackagePrice = (pkgId: string, newPriceUZS: number) => {
    setCoinPackages(prev => prev.map(p => p.id === pkgId ? { ...p, priceUZS: Math.max(0, newPriceUZS) } : p));
  };

  return (
    <MangaContext.Provider value={{
      mangas,
      coinPackages,
      pricePerCoin,
      updatePricePerCoin,
      addManga,
      updateManga,
      deleteManga,
      addChapter,
      updateChapter,
      deleteChapter,
      unlockChapterWithCoins,
      buyCoinsPackage,
      toggleMangaBookmark,
      updateMangaReadingProgress,
      isChapterUnlocked,
      updateCoinPackagePrice
    }}>
      {children}
    </MangaContext.Provider>
  );
};

export const useManga = () => {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};

