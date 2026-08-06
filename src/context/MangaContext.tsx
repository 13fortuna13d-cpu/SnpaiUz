import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const [mangas, setMangas] = useState<Manga[]>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_mangas');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading mangas:', e);
    }
    return INITIAL_MANGA_DATA;
  });

  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_coin_packages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading coin packages:', e);
    }
    return DEFAULT_COIN_PACKAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_mangas', JSON.stringify(mangas));
    } catch (e) {
      console.error('Error saving mangas:', e);
    }
  }, [mangas]);

  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_coin_packages', JSON.stringify(coinPackages));
    } catch (e) {
      console.error('Error saving coin packages:', e);
    }
  }, [coinPackages]);

  // Add new Manga
  const addManga = (data: Partial<Manga>): Manga => {
    const id = 'manga-' + Date.now();
    const newManga: Manga = {
      id,
      slug: data.slug || (data.title?.uz ? data.title.uz.toLowerCase().replace(/\s+/g, '-') : id),
      title: data.title || { uz: 'Yangi Manga', en: 'New Manga', jp: '新しいマンガ' },
      originalTitle: data.originalTitle || '',
      synopsis: data.synopsis || { uz: '', en: '', ru: '' },
      poster: data.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      banner: data.banner || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      author: data.author || 'Noma\'lum',
      artist: data.artist || 'Noma\'lum',
      genres: data.genres || ['Ekshn'],
      tags: data.tags || [],
      status: data.status || 'Ongoing',
      language: data.language || "O'zbekcha",
      releaseYear: data.releaseYear || new Date().getFullYear(),
      rating: data.rating || 9.0,
      views: 0,
      likes: 0,
      bookmarksCount: 0,
      isPremium: data.isPremium || false,
      coinPrice: data.coinPrice || 0,
      chapters: [],
      createdAt: new Date().toISOString()
    };

    setMangas(prev => [newManga, ...prev]);
    return newManga;
  };

  const updateManga = (id: string, updates: Partial<Manga>) => {
    setMangas(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteManga = (id: string) => {
    setMangas(prev => prev.filter(m => m.id !== id));
  };

  // Chapter CRUD
  const addChapter = (mangaId: string, chapterData: Partial<MangaChapter>): MangaChapter => {
    const id = 'ch-' + Date.now();
    const newChapter: MangaChapter = {
      id,
      mangaId,
      chapterNumber: chapterData.chapterNumber || 1,
      title: chapterData.title || `${chapterData.chapterNumber || 1}-Bob`,
      pages: chapterData.pages || [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
      ],
      isFree: chapterData.isFree ?? true,
      coinPrice: chapterData.coinPrice || 5,
      views: 0,
      createdAt: new Date().toISOString()
    };

    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        return {
          ...m,
          chapters: [...m.chapters, newChapter].sort((a, b) => a.chapterNumber - b.chapterNumber)
        };
      }
      return m;
    }));

    return newChapter;
  };

  const updateChapter = (mangaId: string, chapterId: string, updates: Partial<MangaChapter>) => {
    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        return {
          ...m,
          chapters: m.chapters.map(c => c.id === chapterId ? { ...c, ...updates } : c)
        };
      }
      return m;
    }));
  };

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

  // Check if chapter is unlocked for user
  const isChapterUnlocked = (chapterId: string, isFree: boolean): boolean => {
    if (isFree) return true;
    if (user?.isVip) return true;
    if (user?.unlockedChapters?.includes(chapterId)) return true;
    return false;
  };

  // Unlock Chapter with Coins
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

  // Buy Coins Package
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

  // Toggle Manga Bookmark
  const toggleMangaBookmark = (mangaId: string) => {
    if (!user) return;
    const bookmarks = user.mangaBookmarks || [];
    const isBookmarked = bookmarks.includes(mangaId);
    const updated = isBookmarked ? bookmarks.filter(id => id !== mangaId) : [...bookmarks, mangaId];

    // Update in AuthContext
    updateUserCoinsState(0, 'admin_adjust', 'Bookmark update', undefined, mangaId, undefined, updated);

    // Update manga bookmarksCount
    setMangas(prev => prev.map(m => {
      if (m.id === mangaId) {
        return {
          ...m,
          bookmarksCount: Math.max(0, m.bookmarksCount + (isBookmarked ? -1 : 1))
        };
      }
      return m;
    }));
  };

  const [pricePerCoin, setPricePerCoin] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_price_per_coin');
      if (saved) return Number(saved) || 200;
    } catch (e) {
      console.error(e);
    }
    return 200; // Default: 1 Coin = 200 UZS (5 Coin = 1000 UZS)
  });

  const updatePricePerCoin = (newRateUZS: number) => {
    const rate = Math.max(1, newRateUZS);
    setPricePerCoin(rate);
    try {
      localStorage.setItem('senpaiuz_price_per_coin', String(rate));
    } catch (e) {
      console.error(e);
    }
    setCoinPackages(prev => prev.map(pkg => ({
      ...pkg,
      priceUZS: pkg.coins * rate
    })));
  };

  // Save Reading Progress
  const updateMangaReadingProgress = (mangaId: string, chapterId: string, chapterNumber: number, pageIndex: number) => {
    if (!user) return;
    const history = user.mangaReadingHistory || [];
    const filtered = history.filter(h => h.mangaId !== mangaId);
    const newItem = {
      mangaId,
      chapterId,
      chapterNumber,
      pageIndex,
      updatedAt: new Date().toISOString()
    };

    updateUserCoinsState(0, 'admin_adjust', 'Reading history update', undefined, undefined, undefined, undefined, [newItem, ...filtered]);
  };

  // Update Package Price
  const updateCoinPackagePrice = (pkgId: string, newPriceUZS: number) => {
    setCoinPackages(prev => prev.map(p => p.id === pkgId ? { ...p, priceUZS: newPriceUZS } : p));
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
