import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Comment, AdConfig, Report, SocialSettings, Supporter } from '../types';
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
  telegramBannerTitle: 'AniSenpaiUz Telegram Kanaliga A\'zo Bo\'ling!',
  telegramBannerDesc: 'Eng so\'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo\'lib xabardor bo\'ling!',
  showTelegramBanner: true
};

const INITIAL_COMMENTS: Record<string, Comment[]> = {};

const DEFAULT_ADS: AdConfig[] = [
  {
    id: 'ad-1',
    type: 'banner',
    title: 'AniSenpaiUz Telegram Kanaliga A\'zo Bo\'ling!',
    targetUrl: 'https://t.me/SenpaiUzz',
    active: true,
    position: 'header'
  }
];

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        if (parsed && typeof parsed === 'object') return parsed;
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
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SOCIAL_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.error('Failed to parse social settings:', e);
    }
    return DEFAULT_SOCIAL_SETTINGS;
  });

  const updateSocialSettings = (newSettings: Partial<SocialSettings>) => {
    setSocialSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('snpaiuz_social_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save social settings:', e);
      }
      return updated;
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    genre: '',
    year: '',
    status: '',
    country: '',
    audioSub: '',
    sortBy: 'popular'
  });

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

  const resetFilters = () => {
    setFilters({
      genre: '',
      year: '',
      status: '',
      country: '',
      audioSub: '',
      sortBy: 'popular'
    });
    setSearchQuery('');
  };

  const addComment = (animeId: string, content: string, episodeId?: string) => {
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      animeId,
      episodeId,
      userId: 'usr-current',
      userName: 'Foydalanuvchi',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      userBadge: 'User',
      content,
      createdAt: 'Hozirgina',
      likes: 0,
      dislikes: 0,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [animeId]: [newComment, ...(prev[animeId] || [])]
    }));
  };

  const likeComment = (commentId: string, animeId: string) => {
    setComments(prev => {
      const list = prev[animeId] || [];
      const updated = list.map(c => {
        if (c.id === commentId) {
          const liked = c.userLiked;
          return {
            ...c,
            userLiked: !liked,
            likes: liked ? c.likes - 1 : c.likes + 1
          };
        }
        return c;
      });
      return { ...prev, [animeId]: updated };
    });
  };

  const reportComment = (commentId: string, animeId: string, reason: string) => {
    const newReport: Report = {
      id: 'rep-' + Date.now(),
      type: 'comment',
      targetId: commentId,
      reason,
      reportedBy: 'User',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
  };

  const rateAnime = (animeId: string, stars: number) => {
    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        const newVotes = a.votesCount + 1;
        const newRating = Number(((a.rating * a.votesCount + stars * 2) / newVotes).toFixed(1));
        return {
          ...a,
          rating: newRating,
          votesCount: newVotes
        };
      }
      return a;
    }));
  };

  const addAnime = (newAnime: Anime) => {
    setAnimeList(prev => [newAnime, ...prev]);
  };

  const updateAnime = (updatedAnime: Anime) => {
    setAnimeList(prev => prev.map(a => a.id === updatedAnime.id ? updatedAnime : a));
  };

  const deleteAnime = (animeId: string) => {
    setAnimeList(prev => prev.filter(a => a.id !== animeId));
  };

  const resolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
  };

  const deleteCommentAdmin = (commentId: string, animeId: string) => {
    setComments(prev => ({
      ...prev,
      [animeId]: (prev[animeId] || []).filter(c => c.id !== commentId)
    }));
  };

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

  const fetchPlatformStats = async () => {
    try {
      const res = await fetch('/api/stats/overview');
      if (res.ok) {
        const data = await res.json();
        setPlatformStats(data);
      }
    } catch (err) {
      console.error('Error fetching platform stats:', err);
    }
  };

  const recordView = async (animeId: string, episodeId?: string, userId?: string) => {
    incrementViews(animeId);
    try {
      await fetch('/api/stats/record-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId, episodeId, userId })
      });
      fetchPlatformStats();
    } catch (err) {
      console.error('Error recording view:', err);
    }
  };

  useEffect(() => {
    fetchPlatformStats();
    const interval = setInterval(() => {
      fetchPlatformStats();
    }, 15000); // Poll every 15s for live stats updates
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('senpaiuz_supporters', JSON.stringify(supporters));
    } catch (e) {
      console.error('Failed to save supporters:', e);
    }
  }, [supporters]);

  const addSupporter = (data: Partial<Supporter>) => {
    const newSupporter: Supporter = {
      id: 'supp-' + Date.now(),
      nickname: data.nickname || 'Anonim Supporter',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVip: data.isVip ?? false,
      amount: data.amount || 10000,
      dateSupported: data.dateSupported || new Date().toISOString().split('T')[0],
      visible: data.visible ?? true,
      displayOrder: data.displayOrder ?? (supporters.length + 1)
    };
    setSupporters(prev => [...prev, newSupporter]);
  };

  const updateSupporter = (id: string, updates: Partial<Supporter>) => {
    setSupporters(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSupporter = (id: string) => {
    setSupporters(prev => prev.filter(s => s.id !== id));
  };

  const incrementViews = (animeId: string) => {
    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        return { ...a, views: a.views + 1 };
      }
      return a;
    }));
  };

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
