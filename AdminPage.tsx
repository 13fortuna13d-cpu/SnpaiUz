import React, { useState, useEffect } from 'react';
import { 
  Shield, Film, Tv, Users, MessageSquare, Sparkles, Database, 
  Plus, Trash2, Edit, Check, AlertTriangle, Eye, DollarSign, Crown, RefreshCw, Wallet, Grid, Sliders,
  Activity, Server, Cpu, UserCheck, UserPlus, BarChart3, TrendingUp, Clock, Heart, Award,
  Send, Instagram, Youtube, Share2, BookOpen, Coins, Globe
} from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { useManga } from '../context/MangaContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Anime, Episode, Category } from '../types';
import { SeoHead } from '../components/SeoHead';

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    animeList, addAnime, updateAnime, deleteAnime, 
    comments, reports, resolveReport, deleteCommentAdmin,
    socialSettings, updateSocialSettings,
    supporters, addSupporter, updateSupporter, deleteSupporter,
    categories, addCategory, updateCategory, deleteCategory
  } = useAnime();
  const {
    mangas, coinPackages, pricePerCoin, updatePricePerCoin, addManga, updateManga, deleteManga,
    addChapter, updateChapter, deleteChapter, updateCoinPackagePrice
  } = useManga();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'anime' | 'manga' | 'categories' | 'episodes' | 'users' | 'ai' | 'reports' | 'social' | 'supporters'>('dashboard');

  // Supporters Form state
  const [suppNickname, setSuppNickname] = useState('');
  const [suppAvatar, setSuppAvatar] = useState('');
  const [suppIsVip, setSuppIsVip] = useState(false);
  const [suppVisible, setSuppVisible] = useState(true);
  const [suppDisplayOrder, setSuppDisplayOrder] = useState(1);
  const [suppDate, setSuppDate] = useState(new Date().toISOString().split('T')[0]);
  const [suppSearch, setSuppSearch] = useState('');
  const [suppSortBy, setSuppSortBy] = useState<'order' | 'nickname' | 'date'>('order');
  const [editingSuppId, setEditingSuppId] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<any>(null);

  // New Manga Form state
  const [mangaTitleUz, setMangaTitleUz] = useState('');
  const [mangaAuthor, setMangaAuthor] = useState('');
  const [mangaGenres, setMangaGenres] = useState('Ekshn, Fentezi');
  const [mangaPoster, setMangaPoster] = useState('');
  const [mangaSynopsisUz, setMangaSynopsisUz] = useState('');
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);

  const resetMangaForm = () => {
    setMangaTitleUz('');
    setMangaAuthor('');
    setMangaGenres('Ekshn, Fentezi');
    setMangaPoster('');
    setMangaSynopsisUz('');
    setEditingMangaId(null);
  };

  const handleEditMangaClick = (m: typeof mangas[number]) => {
    setEditingMangaId(m.id);
    setMangaTitleUz(m.title.uz || '');
    setMangaAuthor(m.author || '');
    setMangaGenres((m.genres || []).join(', '));
    setMangaPoster(m.poster || '');
    setMangaSynopsisUz(m.synopsis?.uz || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chapter management state (list/edit within selected manga)
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterActionLoading, setChapterActionLoading] = useState<string | null>(null);

  // New Chapter Form state
  const [selectedMangaForChapter, setSelectedMangaForChapter] = useState('');
  const [chapterNum, setChapterNum] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterIsFree, setChapterIsFree] = useState(true);
  const [chapterCoinPrice, setChapterCoinPrice] = useState(5);
  const [chapterPagesText, setChapterPagesText] = useState('');

  // Socials & Banner Form state
  const [tgUsername, setTgUsername] = useState(socialSettings?.telegramUsername || '@SenpaiUzz');
  const [tgUrl, setTgUrl] = useState(socialSettings?.telegramUrl || 'https://t.me/SenpaiUzz');
  const [supportEmail, setSupportEmail] = useState(socialSettings?.email || 'support@anisenpaiuz.com');
  const [supportPhone, setSupportPhone] = useState(socialSettings?.phone || '+998 (90) 123-45-67');
  const [discordUrl, setDiscordUrl] = useState(socialSettings?.discordUrl || 'https://discord.gg/anisenpaiuz');
  const [instaUrl, setInstaUrl] = useState(socialSettings?.instagramUrl || 'https://instagram.com/anisenpaiuz');
  const [fbUrl, setFbUrl] = useState(socialSettings?.facebookUrl || 'https://facebook.com/anisenpaiuz');
  const [ytUrl, setYtUrl] = useState(socialSettings?.youtubeUrl || 'https://youtube.com/@anisenpaiuz');
  const [webUrl, setWebUrl] = useState(socialSettings?.websiteUrl || 'https://anisenpaiuz.com');
  const [bannerTitle, setBannerTitle] = useState(socialSettings?.telegramBannerTitle || "AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!");
  const [bannerDesc, setBannerDesc] = useState(socialSettings?.telegramBannerDesc || "Eng so'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo'lib xabardor bo'ling!");
  const [showBanner, setShowBanner] = useState(socialSettings?.showTelegramBanner ?? true);

  useEffect(() => {
    if (socialSettings) {
      setTgUsername(socialSettings.telegramUsername || '@SenpaiUzz');
      setTgUrl(socialSettings.telegramUrl || 'https://t.me/SenpaiUzz');
      setSupportEmail(socialSettings.email || 'support@anisenpaiuz.com');
      setSupportPhone(socialSettings.phone || '+998 (90) 123-45-67');
      setDiscordUrl(socialSettings.discordUrl || 'https://discord.gg/anisenpaiuz');
      setInstaUrl(socialSettings.instagramUrl || 'https://instagram.com/anisenpaiuz');
      setFbUrl(socialSettings.facebookUrl || 'https://facebook.com/anisenpaiuz');
      setYtUrl(socialSettings.youtubeUrl || 'https://youtube.com/@anisenpaiuz');
      setWebUrl(socialSettings.websiteUrl || 'https://anisenpaiuz.com');
      setBannerTitle(socialSettings.telegramBannerTitle || "AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!");
      setBannerDesc(socialSettings.telegramBannerDesc || "Eng so'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo'lib xabardor bo'ling!");
      setShowBanner(socialSettings.showTelegramBanner ?? true);
    }
  }, [socialSettings]);

  useEffect(() => {
    fetch('/api/stats/admin')
      .then(res => res.json())
      .then(data => setAdminStats(data))
      .catch(err => console.error('Failed to load admin stats:', err));
  }, []);

  // AI Synopsis Generator state
  const [aiPromptTitle, setAiPromptTitle] = useState('');
  const [aiResult, setAiResult] = useState<{ uz: string; en: string; ru: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // New Anime Form
  const [newTitleUz, setNewTitleUz] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleJp, setNewTitleJp] = useState('');
  const [newPoster, setNewPoster] = useState('');
  const [newBanner, setNewBanner] = useState('');
  const [newTrailer, setNewTrailer] = useState('');
  const [newSynopsisUz, setNewSynopsisUz] = useState('');
  const [newStudio, setNewStudio] = useState('MAPPA');
  const [newYear, setNewYear] = useState(2024);
  const [newGenres, setNewGenres] = useState('Action, Fantasy');

  // New Episode Form
  const [selectedAnimeId, setSelectedAnimeId] = useState(animeList[0]?.id || '');
  const [epNumber, setEpNumber] = useState(1);
  const [epTitleUz, setEpTitleUz] = useState('');
  const [epVideoUrl, setEpVideoUrl] = useState('');

  // User Management State (Real Users from Database)
  const [usersList, setUsersList] = useState<any[]>([]);

  const fetchUsers = () => {
    const token = localStorage.getItem('snpaiuz_jwt_token');
    if (!token) return;
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.users && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      })
      .catch(err => console.error('Failed to load users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const [topUpUserId, setTopUpUserId] = useState('');
  const [topUpAmt, setTopUpAmt] = useState(50000);

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'super_admin';

  if (!user || !isAdminOrSuper) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-slate-900/60 p-8 rounded-3xl border border-red-500/30">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">{t('admin.access_denied')}</h2>
        <p className="text-xs text-slate-400">{t('admin.access_denied_desc')}</p>
      </div>
    );
  }

  // Calculate stats
  const totalViews = animeList.reduce((acc, a) => acc + a.views, 0);
  const totalAnime = animeList.length;

  const [editingAnimeId, setEditingAnimeId] = useState<string | null>(null);

  const handleSubmitAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleUz || !newPoster) return;

    if (editingAnimeId) {
      const existing = animeList.find(a => a.id === editingAnimeId);
      if (!existing) return;
      updateAnime({
        ...existing,
        title: { uz: newTitleUz, en: newTitleEn || newTitleUz, jp: newTitleJp || newTitleUz },
        synopsis: { uz: newSynopsisUz || existing.synopsis.uz, en: newSynopsisUz || existing.synopsis.en, ru: existing.synopsis.ru },
        poster: newPoster,
        banner: newBanner || newPoster,
        trailerUrl: newTrailer,
        year: Number(newYear),
        genres: newGenres.split(',').map(g => g.trim()),
        studio: newStudio,
      });
      setEditingAnimeId(null);
      setNewTitleUz(''); setNewTitleEn(''); setNewTitleJp(''); setNewPoster(''); setNewBanner(''); setNewTrailer('');
      setNewSynopsisUz(''); setNewStudio('MAPPA'); setNewYear(2024); setNewGenres('Action, Fantasy');
      alert(t('admin.alert_anime_updated'));
      return;
    }

    const slug = newTitleEn ? newTitleEn.toLowerCase().replace(/\s+/g, '-') : 'anime-' + Date.now();
    const created: Anime = {
      id: 'anime-' + Date.now(),
      slug,
      title: { uz: newTitleUz, en: newTitleEn || newTitleUz, jp: newTitleJp || newTitleUz },
      synopsis: { uz: newSynopsisUz || 'Tavsif yo\'q', en: newSynopsisUz, ru: newSynopsisUz },
      poster: newPoster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      banner: newBanner || newPoster || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: newTrailer,
      screenshots: [newPoster],
      rating: 0,
      votesCount: 0,
      imdbRating: 0,
      views: 0,
      popularityScore: 80,
      year: Number(newYear),
      status: 'Ongoing',
      type: 'TV',
      genres: newGenres.split(',').map(g => g.trim()),
      country: 'Japan',
      studio: newStudio,
      episodesCount: 1,
      hasSub: true,
      hasDubUZ: true,
      hasDubRU: true,
      episodes: [
        {
          id: 'ep-1-' + Date.now(),
          number: 1,
          title: { uz: '1-qism', en: 'Episode 1', ru: '1 серия' },
          duration: '24:00',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          hasDubUZ: true,
          hasDubRU: true,
          airDate: new Date().toISOString().split('T')[0],
          views: 10
        }
      ]
    };

    addAnime(created);
    setNewTitleUz('');
    setNewTitleEn('');
    setNewPoster('');
    alert(t('admin.alert_anime_added'));
  };

  const handleEditAnimeClick = (a: Anime) => {
    setEditingAnimeId(a.id);
    setNewTitleUz(a.title.uz || '');
    setNewTitleEn(a.title.en || '');
    setNewTitleJp(a.title.jp || '');
    setNewPoster(a.poster || '');
    setNewBanner(a.banner || '');
    setNewTrailer(a.trailerUrl || '');
    setNewSynopsisUz(a.synopsis.uz || '');
    setNewStudio(a.studio || 'MAPPA');
    setNewYear(a.year || 2024);
    setNewGenres((a.genres || []).join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditAnime = () => {
    setEditingAnimeId(null);
    setNewTitleUz(''); setNewTitleEn(''); setNewTitleJp(''); setNewPoster(''); setNewBanner(''); setNewTrailer('');
    setNewSynopsisUz(''); setNewStudio('MAPPA'); setNewYear(2024); setNewGenres('Action, Fantasy');
  };
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

  // Category Form state
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const resetCategoryForm = () => {
    setNewCatId('');
    setNewCatName('');
    setNewCatIcon('🏷️');
    setEditingCategoryId(null);
    setCategoryError(null);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError(null);
    if (!newCatName.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, { nameUz: newCatName, iconEmoji: newCatIcon });
      resetCategoryForm();
      alert(t('admin.alert_category_updated'));
      return;
    }

    const result = addCategory({ id: newCatId.trim() || newCatName.trim(), nameUz: newCatName, iconEmoji: newCatIcon });
    if (!result.ok) {
      setCategoryError(result.error === 'duplicate_id' ? t('admin.error_category_duplicate') : t('admin.error_category_invalid'));
      return;
    }
    resetCategoryForm();
    alert(t('admin.alert_category_added'));
  };

  const handleEditCategoryClick = (c: Category) => {
    setEditingCategoryId(c.id);
    setNewCatId(c.id);
    setNewCatName(c.nameUz);
    setNewCatIcon(c.iconEmoji || c.icon || '🏷️');
    setCategoryError(null);
  };

  const handleDeleteCategory = (c: Category) => {
    if (!confirm(t('admin.confirm_delete_category').replace('{name}', c.nameUz))) return;
    const result = deleteCategory(c.id);
    if (!result.ok) {
      alert(t('admin.error_category_in_use'));
    }
  };

  const handleSubmitEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAnime = animeList.find(a => a.id === selectedAnimeId);
    if (!targetAnime || !epTitleUz) return;

    if (editingEpisodeId) {
      const updatedEpisodes = targetAnime.episodes.map(ep =>
        ep.id === editingEpisodeId
          ? { ...ep, number: Number(epNumber), title: { uz: epTitleUz, en: epTitleUz, ru: epTitleUz }, videoUrl: epVideoUrl || ep.videoUrl }
          : ep
      );
      updateAnime({ ...targetAnime, episodes: updatedEpisodes });
      setEditingEpisodeId(null);
      setEpTitleUz('');
      setEpVideoUrl('');
      alert(t('admin.alert_episode_updated').replace('{n}', String(epNumber)));
      return;
    }

    const newEp: Episode = {
      id: 'ep-' + Date.now(),
      number: Number(epNumber),
      title: { uz: epTitleUz, en: epTitleUz, ru: epTitleUz },
      duration: '23:50',
      videoUrl: epVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      hasDubUZ: true,
      hasDubRU: true,
      airDate: new Date().toISOString().split('T')[0],
      views: 0
    };

    const updated = {
      ...targetAnime,
      episodesCount: targetAnime.episodes.length + 1,
      episodes: [...targetAnime.episodes, newEp]
    };

    updateAnime(updated);
    setEpTitleUz('');
    setEpVideoUrl('');
    alert(t('admin.alert_episode_added').replace('{n}', String(epNumber)));
  };

  const handleDeleteEpisode = (animeId: string, episodeId: string) => {
    const targetAnime = animeList.find(a => a.id === animeId);
    if (!targetAnime) return;
    const remaining = targetAnime.episodes.filter(ep => ep.id !== episodeId);
    updateAnime({ ...targetAnime, episodes: remaining, episodesCount: remaining.length });
    if (editingEpisodeId === episodeId) {
      setEditingEpisodeId(null);
      setEpTitleUz('');
      setEpVideoUrl('');
    }
  };

  const handleCancelEditEpisode = () => {
    setEditingEpisodeId(null);
    setEpTitleUz('');
    setEpVideoUrl('');
    setEpNumber(1);
  };

  const [topUpLoading, setTopUpLoading] = useState<string | null>(null);
  const handleUserTopUp = (userId: string) => {
    const token = localStorage.getItem('snpaiuz_jwt_token');
    if (!token) return;
    setTopUpLoading(userId);
    fetch(`/api/admin/users/${userId}/balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amountUZS: topUpAmt })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsersList(prev => prev.map(u => u.id === userId ? { ...u, balance: data.balanceUZS } : u));
          alert(t('admin.alert_balance_added').replace('{id}', userId).replace('{amount}', topUpAmt.toLocaleString()));
        } else {
          alert(data.error || t('admin.alert_action_failed'));
        }
      })
      .catch(() => alert(t('admin.alert_action_failed')))
      .finally(() => setTopUpLoading(null));
  };

  const [vipLoading, setVipLoading] = useState<string | null>(null);
  const handleToggleVip = (userId: string) => {
    const token = localStorage.getItem('snpaiuz_jwt_token');
    if (!token) return;
    setVipLoading(userId);
    fetch(`/api/admin/users/${userId}/vip`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isVip: data.isVip } : u));
        } else {
          alert(data.error || t('admin.alert_action_failed'));
        }
      })
      .catch(() => alert(t('admin.alert_action_failed')))
      .finally(() => setVipLoading(null));
  };

  const handleGenerateAISynopsis = async () => {
    if (!aiPromptTitle.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-generate-synopsis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeTitle: aiPromptTitle })
      });
      const data = await res.json();
      if (data.synopsis) {
        setAiResult(data.synopsis);
      } else {
        setAiResult({
          uz: `${aiPromptTitle} — hayajonli sarguzashtlar, sehr-jodu va do'stlik haqidagi ajoyib anime. Bosh qahramon qiyinchiliklarni yengib o'tib dunyoni qutqaradi.`,
          en: `${aiPromptTitle} is an epic fantasy action anime full of supernatural powers and deep friendship.`,
          ru: `${aiPromptTitle} — захватывающее аниме о невероятных приключениях и магии.`
        });
      }
    } catch {
      setAiResult({
        uz: `${aiPromptTitle} — AniSenpaiUz AI tomonidan avtomatik yaratilgan tavsif.`,
        en: `${aiPromptTitle} — AI generated synopsis.`,
        ru: `${aiPromptTitle} — описание сгенерировано ИИ.`
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Access Guard
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <SeoHead title={t('admin.access_denied')} />
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">{t('admin.access_denied')}</h1>
        <p className="text-slate-400 text-sm max-w-md">
          {t('admin.access_denied_desc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SeoHead title={t('admin.title')} />

      {/* Admin Title Bar */}
      <div className="bg-slate-900/80 rounded-3xl border border-cyan-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{t('admin.title')}</h1>
            <p className="text-xs text-slate-400">{t('admin.subtitle')}</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {t('admin.production_active')}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{t('admin.tab_dashboard')}</span>
        </button>

        <button
          onClick={() => setActiveTab('anime')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'anime' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>{t('admin.tab_anime')} ({animeList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manga')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'manga' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>{t('admin.tab_manga')} ({mangas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'categories' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>{t('admin.tab_categories')}</span>
        </button>

        <button
          onClick={() => setActiveTab('episodes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'episodes' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{t('admin.tab_episodes')}</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{t('admin.tab_users')} ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'ai' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'bg-slate-900 text-cyan-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('admin.tab_ai')}</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'social' ? 'bg-sky-600 text-white font-bold shadow-lg shadow-sky-600/30' : 'bg-slate-900 text-sky-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>{t('admin.tab_social')}</span>
        </button>

        <button
          onClick={() => setActiveTab('supporters')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'supporters' ? 'bg-pink-600 text-white font-bold shadow-lg shadow-pink-600/30' : 'bg-slate-900 text-pink-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
          <span>{t('admin.tab_supporters')} ({supporters.length})</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>{t('admin.total_users')}</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">{adminStats?.totalUsers || animeList.length}</p>
              <span className="text-[11px] text-emerald-400 font-medium">+{adminStats?.newUsersToday || 0} {t('admin.today_joined')}</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>{t('admin.active_users')}</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-300">{adminStats?.activeUsers || 0}</p>
              <span className="text-[11px] text-slate-400 font-medium">{t('admin.active_7d')}</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>{t('admin.total_anime')}</span>
                <Film className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-cyan-300">{animeList.length}</p>
              <span className="text-[11px] text-cyan-400 font-medium">{t('admin.catalog_titles')}</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>{t('admin.total_views')}</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-amber-300">{(adminStats?.totalViews ?? 0).toLocaleString()}</p>
              <span className="text-[11px] text-amber-400 font-medium">+{adminStats?.todayViews || 0} {t('admin.today_views_suffix')}</span>
            </div>
          </div>

          {/* Views Breakdown Metrics Grid */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>{t('admin.views_breakdown')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">{t('admin.today_views')}</span>
                <p className="text-xl font-black text-amber-400">{(adminStats?.todayViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">{t('admin.weekly_views')}</span>
                <p className="text-xl font-black text-indigo-400">{(adminStats?.weeklyViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">{t('admin.monthly_views')}</span>
                <p className="text-xl font-black text-rose-400">{(adminStats?.monthlyViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">{t('admin.total_views_logs')}</span>
                <p className="text-xl font-black text-emerald-400">{(adminStats?.totalViews || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Top 10 Popular Anime & Top Active Users Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 Popular Anime */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{t('admin.top10_anime')}</span>
                </h3>
              </div>

              <div className="space-y-2">
                {[...animeList].sort((a, b) => b.views - a.views).slice(0, 10).map((anime, idx) => (
                  <div key={anime.id} className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <img src={anime.poster} alt={anime.title.uz} className="w-8 h-10 object-cover rounded-md" />
                      <div>
                        <p className="font-bold text-white text-xs">{anime.title.uz || anime.title.en}</p>
                        <span className="text-[11px] text-slate-400">⭐ {anime.rating} / 10</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-xs">{anime.views.toLocaleString()} views</p>
                      <span className="text-[10px] text-slate-500">{anime.episodes.length} qism</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Active Users */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('admin.top_active_users')}</span>
                </h3>
              </div>

              <div className="space-y-2">
                {(adminStats?.topActiveUsers || []).map((u: any, idx: number) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-white text-xs flex items-center gap-1.5">
                          {u.name}
                          {u.role === 'super_admin' && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">{t('admin.super_admin_badge')}</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-cyan-400 text-xs">{u.watchedEpisodes} {t('admin.watched_episodes_suffix')}</p>
                      <span className="text-[10px] text-pink-400 font-medium block">{u.favoritesCount} {t('admin.favorites_suffix')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Server & Infrastructure Health Panel */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>{t('admin.server_health')}</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {t('admin.online_healthy')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {t('admin.uptime')}
                </span>
                <p className="font-bold text-white text-sm">
                  {Math.floor((adminStats?.system?.uptimeSeconds || 3600) / 3600)} {t('admin.hours')} {Math.floor(((adminStats?.system?.uptimeSeconds || 3600) % 3600) / 60)} {t('admin.minutes')}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {t('admin.memory_usage')}
                </span>
                <p className="font-bold text-cyan-300 text-sm">
                  {adminStats?.system?.heapUsedMB || 45} MB / {adminStats?.system?.heapTotalMB || 128} MB
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> {t('admin.node_platform')}
                </span>
                <p className="font-bold text-amber-300 text-xs">
                  {adminStats?.system?.nodeVersion || 'v20.x'} ({adminStats?.system?.platform || 'linux'})
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {t('admin.request_logs')}
                </span>
                <p className="font-bold text-emerald-400 text-sm">
                  {adminStats?.system?.requestsCount || 15} {t('admin.total_logs_suffix')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANIME MANAGEMENT */}
      {activeTab === 'anime' && (
        <div className="space-y-8">
          {/* Add / Edit Anime Form */}
          <form onSubmit={handleSubmitAnime} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                {editingAnimeId ? t('admin.edit_anime_title') : t('admin.create_anime_title')}
              </h3>
              {editingAnimeId && (
                <button
                  type="button"
                  onClick={handleCancelEditAnime}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={t('admin.ph_title_uz')}
                required
                value={newTitleUz}
                onChange={(e) => setNewTitleUz(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_title_en')}
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_title_jp')}
                value={newTitleJp}
                onChange={(e) => setNewTitleJp(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={t('admin.ph_poster_url')}
                required
                value={newPoster}
                onChange={(e) => setNewPoster(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_banner_url')}
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_trailer_url')}
                value={newTrailer}
                onChange={(e) => setNewTrailer(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <textarea
              placeholder={t('admin.ph_synopsis_uz')}
              rows={2}
              value={newSynopsisUz}
              onChange={(e) => setNewSynopsisUz(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
            >
              {editingAnimeId ? `💾 ${t('common.save')}` : t('admin.add_to_db')}
            </button>
          </form>

          {/* Anime List Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">{t('admin.th_poster')}</th>
                  <th className="p-4">{t('admin.th_name')}</th>
                  <th className="p-4">{t('admin.th_studio')}</th>
                  <th className="p-4">{t('admin.th_episodes')}</th>
                  <th className="p-4">{t('admin.th_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {animeList.map(a => (
                  <tr key={a.id} className="hover:bg-slate-950/40">
                    <td className="p-4">
                      <img src={a.poster} alt={a.title.uz} className="w-10 h-14 object-cover rounded-lg" />
                    </td>
                    <td className="p-4 font-bold text-white">{a.title.uz}</td>
                    <td className="p-4">{a.studio} ({a.year})</td>
                    <td className="p-4 text-purple-300 font-bold">{a.episodesCount} {t('admin.episodes_suffix')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAnimeClick(a)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title={t('common.edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('admin.confirm_delete_anime').replace('{name}', a.title.uz))) {
                              deleteAnime(a.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2.5: MANGA & COIN MANAGEMENT */}
      {activeTab === 'manga' && (
        <div className="space-y-8">
          
          {/* Add / Edit Manga Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!mangaTitleUz.trim()) return;
              if (editingMangaId) {
                updateManga(editingMangaId, {
                  title: { uz: mangaTitleUz, en: mangaTitleUz, jp: mangaTitleUz },
                  author: mangaAuthor || "Noma'lum",
                  genres: mangaGenres.split(',').map(s => s.trim()),
                  poster: mangaPoster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
                  synopsis: { uz: mangaSynopsisUz, en: '', ru: '' }
                });
                alert(t('admin.alert_manga_updated'));
              } else {
                addManga({
                  title: { uz: mangaTitleUz, en: mangaTitleUz, jp: mangaTitleUz },
                  author: mangaAuthor || 'Noma\'lum',
                  genres: mangaGenres.split(',').map(s => s.trim()),
                  poster: mangaPoster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
                  synopsis: { uz: mangaSynopsisUz, en: '', ru: '' }
                });
                alert(t('admin.alert_manga_added'));
              }
              resetMangaForm();
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                {editingMangaId ? t('admin.edit_manga_title') : t('admin.create_manga_title')}
              </h3>
              {editingMangaId && (
                <button
                  type="button"
                  onClick={resetMangaForm}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={t('admin.ph_manga_title_uz')}
                required
                value={mangaTitleUz}
                onChange={(e) => setMangaTitleUz(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_author')}
                value={mangaAuthor}
                onChange={(e) => setMangaAuthor(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_genres')}
                value={mangaGenres}
                onChange={(e) => setMangaGenres(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <input
              type="url"
              placeholder={t('admin.ph_poster_img_url')}
              value={mangaPoster}
              onChange={(e) => setMangaPoster(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <textarea
              placeholder={t('admin.ph_manga_synopsis')}
              value={mangaSynopsisUz}
              onChange={(e) => setMangaSynopsisUz(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
            >
              {editingMangaId ? `💾 ${t('common.save')}` : t('admin.save_manga')}
            </button>
          </form>

          {/* Add / Edit Chapter Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedMangaForChapter) {
                alert(t('admin.alert_select_manga'));
                return;
              }
              const pages = chapterPagesText.split('\n').map(s => s.trim()).filter(Boolean);
              if (editingChapterId) {
                updateChapter(selectedMangaForChapter, editingChapterId, {
                  chapterNumber: Number(chapterNum),
                  title: chapterTitle || `${chapterNum}-Bob`,
                  isFree: chapterIsFree,
                  coinPrice: Number(chapterCoinPrice),
                  ...(pages.length > 0 ? { pages } : {})
                });
                setEditingChapterId(null);
                alert(t('admin.alert_chapter_updated').replace('{n}', String(chapterNum)));
              } else {
                addChapter(selectedMangaForChapter, {
                  chapterNumber: Number(chapterNum),
                  title: chapterTitle || `${chapterNum}-Bob`,
                  isFree: chapterIsFree,
                  coinPrice: Number(chapterCoinPrice),
                  pages: pages.length > 0 ? pages : [
                    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
                  ]
                });
                alert(t('admin.alert_chapter_added').replace('{n}', String(chapterNum)));
              }
              setChapterTitle('');
              setChapterPagesText('');
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                {editingChapterId ? t('admin.edit_chapter_title') : t('admin.add_chapter_title')}
              </h3>
              {editingChapterId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingChapterId(null);
                    setChapterTitle('');
                    setChapterPagesText('');
                    setChapterNum(1);
                    setChapterIsFree(true);
                    setChapterCoinPrice(5);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                required
                value={selectedMangaForChapter}
                onChange={(e) => setSelectedMangaForChapter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
              >
                <option value="">{t('admin.select_manga_placeholder')}</option>
                {mangas.map(m => (
                  <option key={m.id} value={m.id}>{m.title.uz}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder={t('admin.ph_chapter_num')}
                value={chapterNum}
                onChange={(e) => setChapterNum(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />

              <input
                type="text"
                placeholder={t('admin.ph_chapter_title')}
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chapterIsFree}
                    onChange={(e) => setChapterIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-0"
                  />
                  <span>{t('admin.free_chapter')}</span>
                </label>

                {!chapterIsFree && (
                  <input
                    type="number"
                    placeholder={t('admin.ph_coin_price')}
                    value={chapterCoinPrice}
                    onChange={(e) => setChapterCoinPrice(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-400 font-bold"
                  />
                )}
              </div>
            </div>

            <textarea
              placeholder={t('admin.ph_pages_urls')}
              value={chapterPagesText}
              onChange={(e) => setChapterPagesText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
            >
              {editingChapterId ? `💾 ${t('common.save')}` : t('admin.save_chapter')}
            </button>
          </form>

          {/* Existing Chapters List (for the manga selected above) */}
          {selectedMangaForChapter && (() => {
            const selectedManga = mangas.find(m => m.id === selectedMangaForChapter);
            if (!selectedManga) return null;
            return (
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {t('admin.existing_chapters_title')} — {selectedManga.title.uz} ({selectedManga.chapters.length})
                </h4>
                {selectedManga.chapters.length === 0 ? (
                  <p className="text-xs text-slate-500">{t('admin.no_chapters_yet')}</p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {[...selectedManga.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber).map(ch => (
                      <div key={ch.id} className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                            #{ch.chapterNumber}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{ch.title}</p>
                            <p className="text-[10px] text-slate-500">
                              {ch.isFree ? t('admin.free_chapter') : `${ch.coinPrice} Coin`} · {ch.pages.length} {t('admin.pages_suffix')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChapterId(ch.id);
                              setChapterNum(ch.chapterNumber);
                              setChapterTitle(ch.title);
                              setChapterIsFree(ch.isFree);
                              setChapterCoinPrice(ch.coinPrice || 5);
                              setChapterPagesText(ch.pages.join('\n'));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title={t('common.edit')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={chapterActionLoading === ch.id}
                            onClick={() => {
                              if (confirm(t('admin.confirm_delete_chapter').replace('{name}', ch.title))) {
                                setChapterActionLoading(ch.id);
                                deleteChapter(selectedMangaForChapter, ch.id);
                                setChapterActionLoading(null);
                                if (editingChapterId === ch.id) setEditingChapterId(null);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 disabled:opacity-50"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Coin Package Pricing Table & Formula Calculation */}
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-amber-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  {t('admin.coin_packages_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('admin.coin_formula_desc')}
                </p>
              </div>

              {/* Formula Rate Controller */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-amber-500/20 shrink-0">
                <span className="text-xs text-slate-300 font-bold pl-2">{t('admin.one_coin_equals')}</span>
                <input
                  type="number"
                  value={pricePerCoin}
                  onChange={(e) => updatePricePerCoin(Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-black text-amber-400 text-center"
                />
                <span className="text-xs text-slate-300 font-bold pr-2">so'm (5 Coin = {(pricePerCoin * 5).toLocaleString()} UZS)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {coinPackages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-400 text-sm flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {pkg.coins} Coin
                    </span>
                    {pkg.bonusCoins ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                        +{pkg.bonusCoins} {t('admin.bonus')}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">{t('admin.package_price_label')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={pkg.priceUZS}
                        onChange={(e) => updateCoinPackagePrice(pkg.id, Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-black text-white focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-bold shrink-0">UZS</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono text-right">
                    ~{(pkg.priceUZS / pkg.coins).toFixed(1)} so'm / coin
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Manga List Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">{t('admin.th_poster')}</th>
                  <th className="p-4">{t('admin.th_manga_name')}</th>
                  <th className="p-4">{t('admin.th_author_col')}</th>
                  <th className="p-4">{t('admin.th_chapters_count')}</th>
                  <th className="p-4">{t('admin.th_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mangas.map(m => (
                  <tr key={m.id} className="hover:bg-slate-950/40">
                    <td className="p-4">
                      <img src={m.poster} alt={m.title.uz} className="w-10 h-14 object-cover rounded-lg" />
                    </td>
                    <td className="p-4 font-bold text-white">{m.title.uz}</td>
                    <td className="p-4">{m.author}</td>
                    <td className="p-4 text-purple-300 font-bold">{m.chapters.length} {t('admin.chapters_suffix')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditMangaClick(m)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title={t('common.edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('admin.confirm_delete_manga').replace('{name}', m.title.uz))) {
                              deleteManga(m.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Add / Edit Category Form */}
          <form onSubmit={handleSubmitCategory} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                {editingCategoryId ? t('admin.edit_category_title') : t('admin.add_category_title')}
              </h3>
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder={t('admin.ph_category_icon')}
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                maxLength={4}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white text-center"
              />
              <input
                type="text"
                placeholder={t('admin.ph_category_name')}
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white sm:col-span-2"
              />
              <input
                type="text"
                placeholder={t('admin.ph_category_id')}
                value={newCatId}
                disabled={!!editingCategoryId}
                onChange={(e) => setNewCatId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white disabled:opacity-50"
              />
            </div>

            {categoryError && (
              <p className="text-xs text-rose-400 font-bold">{categoryError}</p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
            >
              {editingCategoryId ? `💾 ${t('common.save')}` : t('common.add')}
            </button>
          </form>

          {/* Categories List */}
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Grid className="w-5 h-5 text-cyan-400" />
              <span>{t('admin.categories_list_title')} ({categories.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(c => {
                const animeCount = animeList.filter(a => a.genres.includes(c.id)).length;
                return (
                  <div key={c.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">{c.iconEmoji || c.icon} {c.nameUz}</span>
                      <span className="text-[10px] text-purple-400 font-mono">ID: {c.id} · {animeCount} {t('admin.anime_suffix')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditCategoryClick(c)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                        title={t('common.edit')}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EPISODES */}
      {activeTab === 'episodes' && (
        <div className="space-y-6 max-w-xl">
          <form onSubmit={handleSubmitEpisode} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{editingEpisodeId ? t('admin.edit_episode_title') : t('admin.add_episode_title')}</h3>
              {editingEpisodeId && (
                <button
                  type="button"
                  onClick={handleCancelEditEpisode}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">{t('admin.select_anime_label')}</label>
              <select
                value={selectedAnimeId}
                onChange={(e) => { setSelectedAnimeId(e.target.value); handleCancelEditEpisode(); }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                {animeList.map(a => (
                  <option key={a.id} value={a.id}>{a.title.uz} ({a.episodes.length} {t('admin.episodes_suffix')})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('admin.ph_episode_num')}
                required
                value={epNumber}
                onChange={(e) => setEpNumber(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder={t('admin.ph_episode_title')}
                required
                value={epTitleUz}
                onChange={(e) => setEpTitleUz(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <input
              type="text"
              placeholder={t('admin.ph_video_url')}
              value={epVideoUrl}
              onChange={(e) => setEpVideoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              {editingEpisodeId ? `💾 ${t('common.save')}` : t('admin.upload_episode')}
            </button>
          </form>

          {/* Existing Episodes List for selected anime */}
          {selectedAnimeId && (() => {
            const targetAnime = animeList.find(a => a.id === selectedAnimeId);
            if (!targetAnime) return null;
            return (
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-purple-400" />
                  {t('admin.existing_episodes_title')} — {targetAnime.title.uz} ({targetAnime.episodes.length})
                </h4>
                {targetAnime.episodes.length === 0 ? (
                  <p className="text-xs text-slate-500">{t('admin.no_episodes_yet')}</p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {[...targetAnime.episodes].sort((a, b) => a.number - b.number).map(ep => (
                      <div key={ep.id} className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">
                            #{ep.number}
                          </span>
                          <p className="font-bold text-white truncate">{ep.title.uz}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEpisodeId(ep.id);
                              setEpNumber(ep.number);
                              setEpTitleUz(ep.title.uz);
                              setEpVideoUrl(ep.videoUrl);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title={t('common.edit')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(t('admin.confirm_delete_episode').replace('{name}', ep.title.uz))) {
                                handleDeleteEpisode(selectedAnimeId, ep.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: USERS & BALANCES */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>{t('admin.users_balance_title')}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">{t('admin.th_user_id')}</th>
                  <th className="p-3">{t('admin.th_name_col')}</th>
                  <th className="p-3">{t('admin.th_email_phone')}</th>
                  <th className="p-3">{t('admin.th_vip')}</th>
                  <th className="p-3">{t('admin.th_balance')}</th>
                  <th className="p-3">{t('admin.th_add_balance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-mono text-purple-300 font-bold">{u.id}</td>
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 text-slate-400">{u.email} <br/> <span className="text-[10px] text-slate-500">{u.phone}</span></td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleVip(u.id)}
                        disabled={vipLoading === u.id}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] disabled:opacity-50 disabled:cursor-wait ${
                          u.isVip ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {vipLoading === u.id ? '...' : (u.isVip ? t('admin.vip_active') : t('admin.vip_regular'))}
                      </button>
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{u.balance.toLocaleString()} UZS</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserTopUp(u.id)}
                          disabled={topUpLoading === u.id}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] disabled:opacity-50 disabled:cursor-wait"
                        >
                          {topUpLoading === u.id ? t('admin.generating') : `+${topUpAmt.toLocaleString()} UZS`}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: GEMINI AI */}
      {activeTab === 'ai' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-cyan-500/30 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">{t('admin.ai_generator_title')}</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('admin.ph_ai_title')}
              value={aiPromptTitle}
              onChange={(e) => setAiPromptTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
            <button
              onClick={handleGenerateAISynopsis}
              disabled={aiLoading}
              className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              {aiLoading ? t('admin.generating') : t('admin.auto_generate')}
            </button>
          </div>

          {aiResult && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <p className="font-bold text-cyan-300">{t('admin.uzbek_label')}</p>
              <p className="text-slate-300">{aiResult.uz}</p>
              <p className="font-bold text-purple-300">{t('admin.english_label')}</p>
              <p className="text-slate-300">{aiResult.en}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: IJTIMOIY TARMOQLAR VA BANNER SOZLAMALARI */}
      {activeTab === 'social' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-sky-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-base font-bold text-white">{t('admin.social_settings_title')}</h3>
                <p className="text-xs text-slate-400">{t('admin.social_settings_desc')}</p>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            updateSocialSettings({
              telegramUsername: tgUsername,
              telegramUrl: tgUrl,
              email: supportEmail,
              phone: supportPhone,
              discordUrl: discordUrl,
              instagramUrl: instaUrl,
              facebookUrl: fbUrl,
              youtubeUrl: ytUrl,
              websiteUrl: webUrl,
              telegramBannerTitle: bannerTitle,
              telegramBannerDesc: bannerDesc,
              showTelegramBanner: showBanner
            });
            alert(t('admin.alert_social_saved'));
          }} className="space-y-6">

            {/* Banner Toggle & Banner Text Section */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-white text-sm">{t('admin.telegram_block_title')}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBanner}
                    onChange={(e) => setShowBanner(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('admin.banner_title_label')}</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('admin.banner_desc_label')}</label>
                  <textarea
                    rows={2}
                    value={bannerDesc}
                    onChange={(e) => setBannerDesc(e.target.value)}
                    placeholder="Eng so'nggi va yangi anime qismlari, premyeralar va yangiliklardan birinchilardan bo'lib xabardor bo'ling!"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Support & Social Links inputs */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                {t('admin.support_channels_title')}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> {t('admin.tg_username_label')}
                  </label>
                  <input
                    type="text"
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    placeholder="@SenpaiUzz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none font-bold"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.tg_username_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> {t('admin.tg_link_label')}
                  </label>
                  <input
                    type="text"
                    value={tgUrl}
                    onChange={(e) => setTgUrl(e.target.value)}
                    placeholder="https://t.me/SenpaiUzz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.tg_link_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> {t('admin.email_label')}
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@anisenpaiuz.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.email_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> {t('admin.phone_label')}
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.phone_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> {t('admin.discord_label')}
                  </label>
                  <input
                    type="text"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    placeholder="https://discord.gg/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.discord_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                    <Instagram className="w-4 h-4" /> {t('admin.instagram_label')}
                  </label>
                  <input
                    type="text"
                    value={instaUrl}
                    onChange={(e) => setInstaUrl(e.target.value)}
                    placeholder="https://instagram.com/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-pink-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.instagram_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> {t('admin.facebook_label')}
                  </label>
                  <input
                    type="text"
                    value={fbUrl}
                    onChange={(e) => setFbUrl(e.target.value)}
                    placeholder="https://facebook.com/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.facebook_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4" /> {t('admin.youtube_label')}
                  </label>
                  <input
                    type="text"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://youtube.com/@anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.youtube_hint')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> {t('admin.website_label')}
                  </label>
                  <input
                    type="text"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="https://anisenpaiuz.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{t('admin.website_hint')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 transition-all"
              >
                💾 {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 10: SUPPORTERS MANAGEMENT */}
      {activeTab === 'supporters' && (
        <div className="space-y-8">
          {/* Add / Edit Supporter Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!suppNickname.trim()) return;
              if (editingSuppId) {
                updateSupporter(editingSuppId, {
                  nickname: suppNickname,
                  avatar: suppAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                  isVip: suppIsVip,
                  visible: suppVisible,
                  displayOrder: Number(suppDisplayOrder),
                  dateSupported: suppDate
                });
                setEditingSuppId(null);
                alert(t('admin.alert_supporter_updated'));
              } else {
                addSupporter({
                  nickname: suppNickname,
                  avatar: suppAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                  isVip: suppIsVip,
                  visible: suppVisible,
                  displayOrder: Number(suppDisplayOrder),
                  dateSupported: suppDate
                });
                alert(t('admin.alert_supporter_added'));
              }
              setSuppNickname('');
              setSuppAvatar('');
              setSuppIsVip(false);
              setSuppVisible(true);
              setSuppDisplayOrder(supporters.length + 2);
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-pink-500/30 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-pink-300 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400/20" />
                <span>{editingSuppId ? t('admin.edit_supporter_title') : t('admin.add_supporter_title')}</span>
              </h3>
              {editingSuppId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSuppId(null);
                    setSuppNickname('');
                    setSuppAvatar('');
                    setSuppIsVip(false);
                    setSuppVisible(true);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t('admin.nickname_label')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('admin.ph_nickname')}
                  value={suppNickname}
                  onChange={(e) => setSuppNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t('admin.avatar_url_label')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t('admin.ph_avatar_url')}
                    value={suppAvatar}
                    onChange={(e) => setSuppAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                  />
                  <label className="shrink-0 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs text-pink-300 font-bold rounded-xl cursor-pointer">
                    <span>{t('admin.file_label')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) setSuppAvatar(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t('admin.date_supported_label')}</label>
                <input
                  type="date"
                  value={suppDate}
                  onChange={(e) => setSuppDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t('admin.display_order_label')}</label>
                <input
                  type="number"
                  value={suppDisplayOrder}
                  onChange={(e) => setSuppDisplayOrder(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppIsVip}
                    onChange={(e) => setSuppIsVip(e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-0"
                  />
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>{t('admin.vip_status')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppVisible}
                    onChange={(e) => setSuppVisible(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                  />
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>{t('admin.visible_label')}</span>
                </label>
              </div>

              {/* Avatar Preview */}
              <div className="flex items-center gap-3 justify-end">
                {suppAvatar && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{t('admin.preview_label')}</span>
                    <img
                      src={suppAvatar}
                      alt="Crop preview"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500 shadow-md aspect-square"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 transition-all"
                >
                  {editingSuppId ? `💾 ${t('common.save')}` : `➕ ${t('common.add')}`}
                </button>
              </div>
            </div>
          </form>

          {/* Supporters List / Management Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" />
                <span>{t('admin.all_supporters_list')} ({supporters.length})</span>
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={suppSearch}
                  onChange={(e) => setSuppSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                />

                <select
                  value={suppSortBy}
                  onChange={(e) => setSuppSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="order">{t('admin.sort_order')}</option>
                  <option value="nickname">{t('admin.sort_nickname')}</option>
                  <option value="date">{t('admin.sort_date')}</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">{t('admin.th_avatar')}</th>
                    <th className="p-3">{t('admin.th_nickname')}</th>
                    <th className="p-3">{t('admin.th_vip')}</th>
                    <th className="p-3">{t('admin.th_date')}</th>
                    <th className="p-3">{t('admin.th_order')}</th>
                    <th className="p-3">{t('admin.th_status')}</th>
                    <th className="p-3 text-right">{t('admin.th_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(() => {
                    const orderSorted = [...supporters].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                    const moveSupporter = (id: string, direction: -1 | 1) => {
                      const idx = orderSorted.findIndex(sp => sp.id === id);
                      const neighborIdx = idx + direction;
                      if (idx === -1 || neighborIdx < 0 || neighborIdx >= orderSorted.length) return;
                      const current = orderSorted[idx];
                      const neighbor = orderSorted[neighborIdx];
                      updateSupporter(current.id, { displayOrder: neighbor.displayOrder || 0 });
                      updateSupporter(neighbor.id, { displayOrder: current.displayOrder || 0 });
                    };
                    return supporters
                    .filter(s => s.nickname.toLowerCase().includes(suppSearch.toLowerCase()))
                    .sort((a, b) => {
                      if (suppSortBy === 'nickname') return a.nickname.localeCompare(b.nickname);
                      if (suppSortBy === 'date') return (b.dateSupported || '').localeCompare(a.dateSupported || '');
                      return (a.displayOrder || 0) - (b.displayOrder || 0);
                    })
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <img
                            src={s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                            alt={s.nickname}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/50 shadow"
                          />
                        </td>
                        <td className="p-3 font-extrabold text-white">{s.nickname}</td>
                        <td className="p-3">
                          {s.isVip ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                              <Crown className="w-3 h-3 text-amber-400" /> VIP
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-400">{s.dateSupported || '-'}</td>
                        <td className="p-3 font-bold text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span>#{s.displayOrder}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => moveSupporter(s.id, -1)}
                                className="text-slate-500 hover:text-white leading-none"
                                title="Yuqoriga"
                              >▲</button>
                              <button
                                onClick={() => moveSupporter(s.id, 1)}
                                className="text-slate-500 hover:text-white leading-none"
                                title="Pastga"
                              >▼</button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => updateSupporter(s.id, { visible: !s.visible })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${
                              s.visible !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {s.visible !== false ? <Eye className="w-3 h-3" /> : <Eye className="w-3 h-3 line-through" />}
                            {s.visible !== false ? t('common.visible') : t('common.hidden')}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingSuppId(s.id);
                              setSuppNickname(s.nickname);
                              setSuppAvatar(s.avatar);
                              setSuppIsVip(!!s.isVip);
                              setSuppVisible(s.visible !== false);
                              setSuppDisplayOrder(s.displayOrder || 1);
                              setSuppDate(s.dateSupported || new Date().toISOString().split('T')[0]);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title={t('common.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(t('admin.confirm_delete_supporter').replace('{name}', s.nickname))) {
                                deleteSupporter(s.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
