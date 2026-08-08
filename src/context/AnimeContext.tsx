import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Anime, Episode, Comment, AdConfig, Report, SocialSettings, Supporter } from '../types';
import { INITIAL_ANIME_DATA } from '../data/mockAnimeData';
import { INITIAL_SUPPORTERS } from '../data/mockSupportersData';

interface FilterState {
  genre: string;
  year: string;
  status: string;
  country: string;
  audioSub: string;
  sortBy: 'popular' | 'rating' | 'latest';
}

export interface PlatformStats {
  totalUsers: number;
  usersToday: number;
  usersLast7Days: number;
  totalViews: number;
  todayViews: number;
  weeklyViews: number;
  monthlyViews: number;
  totalFavorites: number;
  favoritedMap: Record<string, number>;
  updatedAt: string;
}

interface AnimeContextType {
  animeList: Anime[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  comments: Record<string, Comment[]>; // animeId -> comments
  addComment: (animeId: string, content: string, episodeId?: string) => void;
  likeComment: (commentId: string, animeId: string) => void;
  reportComment: (commentId: string, animeId: string, reason: string) => void;
  rateAnime: (animeId: string, stars: number) => void;
  addAnime: (anime: Anime) => void;
  updateAnime: (anime: Anime) => void;
  deleteAnime: (animeId: string) => void;
  // Episode CRUD
  addEpisode: (animeId: string, episode: Episode) => void;
  updateEpisode: (animeId: string, episode: Episode) => void;
  deleteEpisode: (animeId: string, episodeId: string) => void;
  ads: AdConfig[];
  reports: Report[];
  resolveReport: (reportId: string) => void;
  deleteCommentAdmin: (commentId: string, animeId: string) => void;
  incrementViews: (animeId: string) => void;
  platformStats: PlatformStats;
  fetchPlatformStats: () => Promise<void>;
  recordView: (animeId: string, episodeId?: string, userId?: string) => Promise<void>;
  socialSettings: SocialSettings;
  updateSocialSettings: (settings: Partial<SocialSettings>) => void;
  supporters: Supporter[];
  addSupporter: (supporter: Partial<Supporter>) => void;
  updateSupporter: (id: string, updates: Partial<Supporter>) => void;
  deleteSupporter: (id: string) => void;
}

const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  telegramUsername: '@SenpaiUzz',
  telegramUrl: 'https://t.me/SenpaiUzz',
  email: 'support@anisenpaiuz.com',
  phone: '+998 (90) 123-45-67',
  discordUrl: 'https://discord.gg/anisenpaiuz',
  instagramUrl: 'https://instagram.com/anisenpaiuz',
  facebookUrl: 'https://facebook.com/anisenpaiuz',
  youtubeUrl: 'https://youtube.com/@anisenpaiuz',
  websiteUrl: 'https://anisenpaiuz.com',
  telegramBannerTitle: "AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!",
  telegramBannerDesc: "Eng so'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo'lib xabardor bo'ling!",
  showTelegramBanner: true
};

const INITIAL_COMMENTS: Record<string, Comment[]> = {};

const DEFAULT_ADS: AdConfig[] = [
  {
    id: 'ad-1',
    type: 'banner',
    title: "AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!",
    targetUrl: 'https://t.me/SenpaiUzz',
    active: true,
    position: 'header'
  }
];

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [animeList, setAnimeList] = useState<Anime[]>(() => {
    try {
      const saved = localStorage.getItem('snpaiuz_anime_catalog_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse anime list from localStorage:', e);
    }
    return INITIAL_ANIME_DATA;
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    try {
      const saved = localStorage.getItem('snpaiuz_comments_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse comments from localStorage:', e);
    }
    return INITIAL_COMMENTS;
  });

  const [ads] = useState<AdConfig[]>(DEFAULT_ADS);
  const [reports, setReports] = useState<Report[]>([]);

  const [socialSettings, setSocialSettings] = useState<SocialSettings>(() => {
    try {
      const saved = localStorage.getItem('snpaiuz_social_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return { ...DEFAULT_SOCIAL_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.error('Failed to parse social settings:', e);
    }
    return DEFAULT_SOCIAL_SETTINGS;
  });

  const [supporters, setSupporters] = useState<Supporter[]>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_supporters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse supporters:', e);
    }
    return INITIAL_SUPPORTERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    genre: '',
    year: '',
    status: '',
    country: '',
    audioSub: '',
    sortBy: 'popular'
  });

  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 1,
    usersToday: 0,
    usersLast7Days: 1,
    totalViews: 0,
    todayViews: 0,
    weeklyViews: 0,
    monthlyViews: 0,
    totalFavorites: 0,
    favoritedMap: {},
    updatedAt: new Date().toISOString()
  });

  // Safe LocalStorage Persistence
  useEffect(() => {
    try {
      localStorage.setItem('snpaiuz_anime_catalog_v2', JSON.stringify(animeList));
    } catch (e) {
      console.error('Failed to save anime list:', e);
    }
  }, [animeList]);

  useEffect(() => {
    try {
      localStorage.setItem('snpaiuz_comments_v2', JSON.stringify(comments));
    } catch (e) {
      console.error('Failed to save comments:', e);
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_supporters', JSON.stringify(supporters));
    } catch (e) {
      console.error('Failed to save supporters:', e);
    }
  }, [supporters]);

  const updateSocialSettings = useCallback((newSettings: Partial<SocialSettings>) => {
    setSocialSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('snpaiuz_social_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save social settings:', e);
      }
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      genre: '',
      year: '',
      status: '',
      country: '',
      audioSub: '',
      sortBy: 'popular'
    });
    setSearchQuery('');
  }, []);

  // Comments Management
  const addComment = useCallback((animeId: string, content: string, episodeId?: string) => {
    if (!animeId || !content.trim()) return;

    const newComment: Comment = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      animeId,
      episodeId,
      userId: 'usr-current',
      userName: 'Foydalanuvchi',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      userBadge: 'User',
      content: content.trim(),
      createdAt: 'Hozirgina',
      likes: 0,
      dislikes: 0,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [animeId]: [newComment, ...(prev[animeId] || [])]
    }));
  }, []);

  const likeComment = useCallback((commentId: string, animeId: string) => {
    if (!commentId || !animeId) return;

    setComments(prev => {
      const list = prev[animeId] || [];
      const updated = list.map(c => {
        if (c.id === commentId) {
          const liked = c.userLiked;
          return {
            ...c,
            userLiked: !liked,
            likes: liked ? Math.max(0, c.likes - 1) : c.likes + 1
          };
        }
        return c;
      });
      return { ...prev, [animeId]: updated };
    });
  }, []);

  const reportComment = useCallback((commentId: string, animeId: string, reason: string) => {
    if (!commentId || !reason) return;

    const newReport: Report = {
      id: 'rep-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      type: 'comment',
      targetId: commentId,
      reason,
      reportedBy: 'User',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
  }, []);

  const deleteCommentAdmin = useCallback((commentId: string, animeId: string) => {
    if (!commentId || !animeId) return;

    setComments(prev => ({
      ...prev,
      [animeId]: (prev[animeId] || []).filter(c => c.id !== commentId)
    }));
  }, []);

  const resolveReport = useCallback((reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r));
  }, []);

  // Anime Rating & Stats
  const rateAnime = useCallback((animeId: string, stars: number) => {
    if (!animeId || stars < 1 || stars > 5) return;

    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        const currentVotes = typeof a.votesCount === 'number' ? a.votesCount : 0;
        const currentRating = typeof a.rating === 'number' ? a.rating : 0;
        const newVotes = currentVotes + 1;
        const newRating = Number(((currentRating * currentVotes + stars * 2) / newVotes).toFixed(1));
        return {
          ...a,
          rating: Math.min(10, Math.max(0, newRating)),
          votesCount: newVotes
        };
      }
      return a;
    }));
  }, []);

  const incrementViews = useCallback((animeId: string) => {
    if (!animeId) return;

    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        return { ...a, views: (a.views || 0) + 1 };
      }
      return a;
    }));
  }, []);

  // Anime CRUD Operations
  const addAnime = useCallback((newAnime: Anime) => {
    if (!newAnime || !newAnime.id) return;

    setAnimeList(prev => {
      const exists = prev.some(a => a.id === newAnime.id);
      if (exists) {
        return prev.map(a => a.id === newAnime.id ? newAnime : a);
      }
      return [newAnime, ...prev];
    });
  }, []);

  const updateAnime = useCallback((updatedAnime: Anime) => {
    if (!updatedAnime || !updatedAnime.id) return;

    setAnimeList(prev => prev.map(a => a.id === updatedAnime.id ? updatedAnime : a));
  }, []);

  const deleteAnime = useCallback((animeId: string) => {
    if (!animeId) return;

    setAnimeList(prev => prev.filter(a => a.id !== animeId));

    // Clean up associated comments to avoid orphan state
    setComments(prev => {
      if (!prev[animeId]) return prev;
      const copy = { ...prev };
      delete copy[animeId];
      return copy;
    });
  }, []);

  // Episode CRUD Operations
  const addEpisode = useCallback((animeId: string, episode: Episode) => {
    if (!animeId || !episode || !episode.id) return;

    setAnimeList(prev => prev.map(anime => {
      if (anime.id === animeId) {
        const currentEpisodes = Array.isArray(anime.episodes) ? anime.episodes : [];
        const episodeExists = currentEpisodes.some(e => e.id === episode.id);
        const updatedEpisodes = episodeExists
          ? currentEpisodes.map(e => e.id === episode.id ? episode : e)
          : [...currentEpisodes, episode];

        return {
          ...anime,
          episodes: updatedEpisodes
        };
      }
      return anime;
    }));
  }, []);

  const updateEpisode = useCallback((animeId: string, updatedEpisode: Episode) => {
    if (!animeId || !updatedEpisode || !updatedEpisode.id) return;

    setAnimeList(prev => prev.map(anime => {
      if (anime.id === animeId) {
        const currentEpisodes = Array.isArray(anime.episodes) ? anime.episodes : [];
        return {
          ...anime,
          episodes: currentEpisodes.map(e => e.id === updatedEpisode.id ? updatedEpisode : e)
        };
      }
      return anime;
    }));
  }, []);

  const deleteEpisode = useCallback((animeId: string, episodeId: string) => {
    if (!animeId || !episodeId) return;

    setAnimeList(prev => prev.map(anime => {
      if (anime.id === animeId) {
        const currentEpisodes = Array.isArray(anime.episodes) ? anime.episodes : [];
        return {
          ...anime,
          episodes: currentEpisodes.filter(e => e.id !== episodeId)
        };
      }
      return anime;
    }));
  }, []);

  // Platform Stats API & Views Tracking
  const fetchPlatformStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats/overview');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (isMountedRef.current && data && typeof data === 'object') {
            setPlatformStats(prev => ({ ...prev, ...data }));
          }
        }
      }
    } catch (err) {
      // Safe catch block to prevent unhandled promise rejections
      console.warn('Unable to fetch platform stats:', err);
    }
  }, []);

  const recordView = useCallback(async (animeId: string, episodeId?: string, userId?: string) => {
    if (!animeId) return;

    // Increment locally immediately for smooth UX
    incrementViews(animeId);

    try {
      const res = await fetch('/api/stats/record-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId, episodeId, userId })
      });

      if (res.ok && isMountedRef.current) {
        await fetchPlatformStats();
      }
    } catch (err) {
      console.warn('Unable to record view on server:', err);
    }
  }, [incrementViews, fetchPlatformStats]);

  // Polling Platform Stats Safely
  useEffect(() => {
    fetchPlatformStats();
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchPlatformStats();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPlatformStats]);

  // Supporter Management
  const addSupporter = useCallback((data: Partial<Supporter>) => {
    const newSupporter: Supporter = {
      id: 'supp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      nickname: data.nickname || 'Anonim Supporter',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVip: data.isVip ?? false,
      amount: data.amount || 10000,
      dateSupported: data.dateSupported || new Date().toISOString().split('T')[0],
      visible: data.visible ?? true,
      displayOrder: data.displayOrder ?? (supporters.length + 1)
    };
    setSupporters(prev => [...prev, newSupporter]);
  }, [supporters.length]);

  const updateSupporter = useCallback((id: string, updates: Partial<Supporter>) => {
    if (!id) return;
    setSupporters(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSupporter = useCallback((id: string) => {
    if (!id) return;
    setSupporters(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <AnimeContext.Provider value={{
      animeList,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      resetFilters,
      comments,
      addComment,
      likeComment,
      reportComment,
      rateAnime,
      addAnime,
      updateAnime,
      deleteAnime,
      addEpisode,
      updateEpisode,
      deleteEpisode,
      ads,
      reports,
      resolveReport,
      deleteCommentAdmin,
      incrementViews,
      platformStats,
      fetchPlatformStats,
      recordView,
      socialSettings,
      updateSocialSettings,
      supporters,
      addSupporter,
      updateSupporter,
      deleteSupporter
    }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
};

