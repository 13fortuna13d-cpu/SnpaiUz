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
import { Anime, Episode } from '../types';
import { SeoHead } from '../components/SeoHead';
import { CATEGORIES_LIST } from './CategoriesPage';

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    animeList, addAnime, updateAnime, deleteAnime, 
    comments, reports, resolveReport, deleteCommentAdmin,
    socialSettings, updateSocialSettings,
    supporters, addSupporter, updateSupporter, deleteSupporter
  } = useAnime();
  const {
    mangas, coinPackages, pricePerCoin, updatePricePerCoin, addManga, deleteManga, addChapter, updateCoinPackagePrice
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
        <h2 className="text-xl font-bold text-white">Kirish Taqiqlangan!</h2>
        <p className="text-xs text-slate-400">Ushbu sahifa faqat Admin va Super Admin huquqiga ega foydalanuvchilar uchun.</p>
      </div>
    );
  }

  // Calculate stats
  const totalViews = animeList.reduce((acc, a) => acc + a.views, 0);
  const totalAnime = animeList.length;

  const handleCreateAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleUz || !newPoster) return;

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
    alert('Anime baza parametrlariga muvaffaqiyatli qo\'shildi!');
  };

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAnime = animeList.find(a => a.id === selectedAnimeId);
    if (!targetAnime || !epTitleUz) return;

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
    alert(`Qism #${epNumber} animega qo'shildi!`);
  };

  const handleUserTopUp = (userId: string) => {
    setUsersList(usersList.map(u => u.id === userId ? { ...u, balance: u.balance + topUpAmt } : u));
    alert(`Foydalanuvchi ${userId} balansiga +${topUpAmt.toLocaleString()} so'm qo'shildi!`);
  };

  const handleToggleVip = (userId: string) => {
    setUsersList(usersList.map(u => u.id === userId ? { ...u, isVip: !u.isVip } : u));
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
        uz: `${aiPromptTitle} — SenpaiUz AI tomonidan avtomatik yaratilgan tavsif.`,
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
        <SeoHead title="Ruxsat Cheklangan" />
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">Ruxsat Cheklangan (403)</h1>
        <p className="text-slate-400 text-sm max-w-md">
          Bu sahifa faqat platforma administratorlari va moderatorlari uchun mo'ljallangan. Oddiy foydalanuvchilar admin paneliga kira olmaydi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SeoHead title="SenpaiUz Admin Control Panel" />

      {/* Admin Title Bar */}
      <div className="bg-slate-900/80 rounded-3xl border border-cyan-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{t('admin.title')}</h1>
            <p className="text-xs text-slate-400">SenpaiUz kontent, foydalanuvchilar va balanslarni boshqarish paneli</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Production Active Database
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
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('anime')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'anime' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Animelar ({animeList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manga')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'manga' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Manga & Coin ({mangas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'categories' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>Kategoriyalar</span>
        </button>

        <button
          onClick={() => setActiveTab('episodes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'episodes' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Qismlar Qo'shish</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Foydalanuvchilar ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'ai' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'bg-slate-900 text-cyan-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'social' ? 'bg-sky-600 text-white font-bold shadow-lg shadow-sky-600/30' : 'bg-slate-900 text-sky-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Ijtimoiy Tarmoqlar & Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('supporters')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'supporters' ? 'bg-pink-600 text-white font-bold shadow-lg shadow-pink-600/30' : 'bg-slate-900 text-pink-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
          <span>Supporters ({supporters.length})</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Jami Foydalanuvchilar</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">{adminStats?.totalUsers || animeList.length}</p>
              <span className="text-[11px] text-emerald-400 font-medium">+{adminStats?.newUsersToday || 0} bugun qo'shildi</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Faol Foydalanuvchilar</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-300">{adminStats?.activeUsers || 0}</p>
              <span className="text-[11px] text-slate-400 font-medium">7 kunda faol bo'lganlar</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Jami Animelar</span>
                <Film className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-cyan-300">{animeList.length}</p>
              <span className="text-[11px] text-cyan-400 font-medium">Katalogdagi sarlavhalar</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Jami Ko'rishlar</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-amber-300">{(adminStats?.totalViews ?? 0).toLocaleString()}</p>
              <span className="text-[11px] text-amber-400 font-medium">+{adminStats?.todayViews || 0} bugungi ko'rishlar</span>
            </div>
          </div>

          {/* Views Breakdown Metrics Grid */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Ko'rishlar Dinamikasi (Views breakdown)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">Bugungi Ko'rishlar</span>
                <p className="text-xl font-black text-amber-400">{(adminStats?.todayViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">Haftalik Ko'rishlar</span>
                <p className="text-xl font-black text-indigo-400">{(adminStats?.weeklyViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">Oylik Ko'rishlar</span>
                <p className="text-xl font-black text-rose-400">{(adminStats?.monthlyViews || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">Jami Ko'rishlar Logs</span>
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
                  <span>Eng Mashhur 10 Ta Anime (Ko'rishlar bo'yicha)</span>
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
                  <span>Eng Faol Foydalanuvchilar (Real Database)</span>
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
                          {u.role === 'super_admin' && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">SUPER ADMIN</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-cyan-400 text-xs">{u.watchedEpisodes} qism ko'rilgan</p>
                      <span className="text-[10px] text-pink-400 font-medium block">{u.favoritesCount} sevimli</span>
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
                <span>Server Holati va Tizim Statistikasi (System Health)</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                ● ONLINE (Sog'lom)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Uptime (Ish vaqti)
                </span>
                <p className="font-bold text-white text-sm">
                  {Math.floor((adminStats?.system?.uptimeSeconds || 3600) / 3600)} soat {Math.floor(((adminStats?.system?.uptimeSeconds || 3600) % 3600) / 60)} daqiqa
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Xotira Ishlatilishi
                </span>
                <p className="font-bold text-cyan-300 text-sm">
                  {adminStats?.system?.heapUsedMB || 45} MB / {adminStats?.system?.heapTotalMB || 128} MB
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> Node.js & Platforma
                </span>
                <p className="font-bold text-amber-300 text-xs">
                  {adminStats?.system?.nodeVersion || 'v20.x'} ({adminStats?.system?.platform || 'linux'})
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Sorovlar Loglari
                </span>
                <p className="font-bold text-emerald-400 text-sm">
                  {adminStats?.system?.requestsCount || 15} jami loglar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANIME MANAGEMENT */}
      {activeTab === 'anime' && (
        <div className="space-y-8">
          {/* Add Anime Form */}
          <form onSubmit={handleCreateAnime} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Yangi Anime Yaratish (CRUD)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nomi (O'zbekcha)"
                required
                value={newTitleUz}
                onChange={(e) => setNewTitleUz(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Title (English)"
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Title (Japanese)"
                value={newTitleJp}
                onChange={(e) => setNewTitleJp(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Poster Image URL"
                required
                value={newPoster}
                onChange={(e) => setNewPoster(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Banner Image URL"
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Trailer Youtube Embed URL"
                value={newTrailer}
                onChange={(e) => setNewTrailer(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <textarea
              placeholder="Synopsis / Mazmuni (Uzbek)"
              rows={2}
              value={newSynopsisUz}
              onChange={(e) => setNewSynopsisUz(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
            >
              Bazaga Qo'shish
            </button>
          </form>

          {/* Anime List Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Nomi</th>
                  <th className="p-4">Studiya</th>
                  <th className="p-4">Qismlar</th>
                  <th className="p-4">Amallar</th>
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
                    <td className="p-4 text-purple-300 font-bold">{a.episodesCount} qism</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteAnime(a.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2.5: MANGA & COIN MANAGEMENT */}
      {activeTab === 'manga' && (
        <div className="space-y-8">
          
          {/* Add Manga Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!mangaTitleUz.trim()) return;
              addManga({
                title: { uz: mangaTitleUz, en: mangaTitleUz, jp: mangaTitleUz },
                author: mangaAuthor || 'Noma\'lum',
                genres: mangaGenres.split(',').map(s => s.trim()),
                poster: mangaPoster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
                synopsis: { uz: mangaSynopsisUz, en: '', ru: '' }
              });
              setMangaTitleUz('');
              setMangaAuthor('');
              setMangaPoster('');
              setMangaSynopsisUz('');
              alert("Yangi manga muvaffaqiyatli qo'shildi!");
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Yangi Manga / Manhwa Qo'shish
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Manga Nomi (O'zbekcha)"
                required
                value={mangaTitleUz}
                onChange={(e) => setMangaTitleUz(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Muallif / Artist"
                value={mangaAuthor}
                onChange={(e) => setMangaAuthor(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Janrlar (vergul bilan: Ekshn, Fentezi)"
                value={mangaGenres}
                onChange={(e) => setMangaGenres(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <input
              type="url"
              placeholder="Poster Rasm URL"
              value={mangaPoster}
              onChange={(e) => setMangaPoster(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <textarea
              placeholder="Manga Tavsifi (O'zbekcha)..."
              value={mangaSynopsisUz}
              onChange={(e) => setMangaSynopsisUz(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
            >
              Manga Saqlash
            </button>
          </form>

          {/* Add Chapter Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedMangaForChapter) {
                alert("Iltimos manga tanlang!");
                return;
              }
              const pages = chapterPagesText.split('\n').map(s => s.trim()).filter(Boolean);
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
              setChapterTitle('');
              setChapterPagesText('');
              alert(`Manga uchun ${chapterNum}-bob muvaffaqiyatli qo'shildi!`);
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Manga uchun Bob Qo'shish
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                required
                value={selectedMangaForChapter}
                onChange={(e) => setSelectedMangaForChapter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
              >
                <option value="">-- Manganit Tanlang --</option>
                {mangas.map(m => (
                  <option key={m.id} value={m.id}>{m.title.uz}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Bob raqami (masalan: 1)"
                value={chapterNum}
                onChange={(e) => setChapterNum(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />

              <input
                type="text"
                placeholder="Bob Nomi (masalan: 1-Bob)"
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
                  <span>Bepul Bob</span>
                </label>

                {!chapterIsFree && (
                  <input
                    type="number"
                    placeholder="Coin narxi"
                    value={chapterCoinPrice}
                    onChange={(e) => setChapterCoinPrice(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-400 font-bold"
                  />
                )}
              </div>
            </div>

            <textarea
              placeholder="Sahifalar rasmlari URL (har bir sahifa yangi qatorda)..."
              value={chapterPagesText}
              onChange={(e) => setChapterPagesText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
            >
              Bobni Saqlash
            </button>
          </form>

          {/* Coin Package Pricing Table & Formula Calculation */}
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-amber-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  Coin Paketlari va Narx Formulasi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  5 Coin = 1,000 UZS standarti asosida avtomatik hisoblash yoki har bir paket narxini qo'lda sozlash
                </p>
              </div>

              {/* Formula Rate Controller */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-amber-500/20 shrink-0">
                <span className="text-xs text-slate-300 font-bold pl-2">1 Coin =</span>
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
                        +{pkg.bonusCoins} Bonus
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Paket narxi (so'm):</label>
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
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Manga Nomi</th>
                  <th className="p-4">Muallif</th>
                  <th className="p-4">Boblar Soni</th>
                  <th className="p-4">Amallar</th>
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
                    <td className="p-4 text-purple-300 font-bold">{m.chapters.length} bob</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteManga(m.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <span>Kategoriyalar Ro'yxati</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES_LIST.map(c => (
              <div key={c.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.iconEmoji || c.icon} {c.nameUz}</span>
                <span className="text-[10px] text-purple-400 font-mono">ID: {c.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EPISODES */}
      {activeTab === 'episodes' && (
        <form onSubmit={handleAddEpisode} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-base">Animega Yangi Qism Qo'shish</h3>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Animeni Tanlang:</label>
            <select
              value={selectedAnimeId}
              onChange={(e) => setSelectedAnimeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            >
              {animeList.map(a => (
                <option key={a.id} value={a.id}>{a.title.uz} ({a.episodes.length} qism)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Qism raqami (Masalan: 12)"
              required
              value={epNumber}
              onChange={(e) => setEpNumber(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Qism nomi"
              required
              value={epTitleUz}
              onChange={(e) => setEpTitleUz(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <input
            type="text"
            placeholder="Video Stream URL (.mp4 / embed link)"
            value={epVideoUrl}
            onChange={(e) => setEpVideoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
          />

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            Qismni Yuklash
          </button>
        </form>
      )}

      {/* TAB 5: USERS & BALANCES */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Foydalanuvchilar va Balans Boshqaruvi</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Ismi</th>
                  <th className="p-3">Email / Telefon</th>
                  <th className="p-3">VIP</th>
                  <th className="p-3">Balans</th>
                  <th className="p-3">Balans Qo'shish</th>
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
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          u.isVip ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.isVip ? 'VIP FAOL' : 'ODDIY'}
                      </button>
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{u.balance.toLocaleString()} UZS</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserTopUp(u.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                        >
                          +50 000 UZS
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
            <h3 className="text-base font-bold text-white">Gemini AI Synopsis Generator</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Anime nomini kiriting (Masalan: Solo Leveling)..."
              value={aiPromptTitle}
              onChange={(e) => setAiPromptTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
            <button
              onClick={handleGenerateAISynopsis}
              disabled={aiLoading}
              className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              {aiLoading ? 'Yaratilmoqda...' : 'Avto Yaratish'}
            </button>
          </div>

          {aiResult && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <p className="font-bold text-cyan-300">O'zbekcha:</p>
              <p className="text-slate-300">{aiResult.uz}</p>
              <p className="font-bold text-purple-300">English:</p>
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
                <h3 className="text-base font-bold text-white">Ijtimoiy Tarmoqlar va Telegram Banner Sozlamalari</h3>
                <p className="text-xs text-slate-400">Platformadagi barcha ijtimoiy tarmoq havolalari va Telegram obuna blokini boshqarish</p>
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
            alert('Qo\'llab-quvvatlash va ijtimoiy tarmoq sozlamalari muvaffaqiyatli saqlandi!');
          }} className="space-y-6">

            {/* Banner Toggle & Banner Text Section */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-white text-sm">Bosh Sahifadagi Telegram Obuna Bloki</span>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Sarlavhasi:</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="AniSenpaiUz Telegram Kanaliga A'zo Bo'ling!"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Tavsifi:</label>
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
                🎧 Qo'llab-quvvatlash va Murojaat Sozlamalari (Support Channels)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> Telegram Support Username:
                  </label>
                  <input
                    type="text"
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    placeholder="@SenpaiUzz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Murojaat uchun Telegram nik</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> Telegram Support Linki:
                  </label>
                  <input
                    type="text"
                    value={tgUrl}
                    onChange={(e) => setTgUrl(e.target.value)}
                    placeholder="https://t.me/SenpaiUzz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Rasmiy qo'llab-quvvatlash havolasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Murojaat Email Pochta:
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@anisenpaiuz.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Rasmiy elektron pochta</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Telefon / Ishonch Telefoni:
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Murojaat uchun telefon raqam</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Discord Server Linki:
                  </label>
                  <input
                    type="text"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    placeholder="https://discord.gg/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Discord hamjamiyat havolasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                    <Instagram className="w-4 h-4" /> Instagram Sahifa Linki:
                  </label>
                  <input
                    type="text"
                    value={instaUrl}
                    onChange={(e) => setInstaUrl(e.target.value)}
                    placeholder="https://instagram.com/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-pink-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Instagram rasmiy sahifa</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Facebook Sahifa Linki:
                  </label>
                  <input
                    type="text"
                    value={fbUrl}
                    onChange={(e) => setFbUrl(e.target.value)}
                    placeholder="https://facebook.com/anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Facebook sahifasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4" /> YouTube Kanal Linki:
                  </label>
                  <input
                    type="text"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://youtube.com/@anisenpaiuz"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">YouTube kanal havolasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Veb-sayt Domen Linki:
                  </label>
                  <input
                    type="text"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="https://anisenpaiuz.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Asosiy platforma domeni</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 transition-all"
              >
                💾 Sozlamalarni Saqlash
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
                alert("Supporter ma'lumotlari yangilandi!");
              } else {
                addSupporter({
                  nickname: suppNickname,
                  avatar: suppAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                  isVip: suppIsVip,
                  visible: suppVisible,
                  displayOrder: Number(suppDisplayOrder),
                  dateSupported: suppDate
                });
                alert("Yangi supporter qo'shildi!");
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
                <span>{editingSuppId ? "Supporterni Tahrirlash" : "Yangi Supporter (Homiyni) Qo'shish"}</span>
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
                  Bekor qilish
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Taxallus (Nickname):</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: ShadowKing_Uz"
                  value={suppNickname}
                  onChange={(e) => setSuppNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Avatar Rasm URL / Galereya:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://... yoki fayl tanlang"
                    value={suppAvatar}
                    onChange={(e) => setSuppAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                  />
                  <label className="shrink-0 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs text-pink-300 font-bold rounded-xl cursor-pointer">
                    <span>Fayl</span>
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
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Qo'llab-quvvatlagan Sana:</label>
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
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tartib Raqami (Display Order):</label>
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
                  <span>VIP Status</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppVisible}
                    onChange={(e) => setSuppVisible(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                  />
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Ko'rinishi (Visible)</span>
                </label>
              </div>

              {/* Avatar Preview */}
              <div className="flex items-center gap-3 justify-end">
                {suppAvatar && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Ko'rinish:</span>
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
                  {editingSuppId ? "💾 Saqlash" : "➕ Qo'shish"}
                </button>
              </div>
            </div>
          </form>

          {/* Supporters List / Management Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" />
                <span>Barcha Homiylar Ruyxati ({supporters.length})</span>
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Qidirish (Nickname)..."
                  value={suppSearch}
                  onChange={(e) => setSuppSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                />

                <select
                  value={suppSortBy}
                  onChange={(e) => setSuppSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="order">Tartib raqami</option>
                  <option value="nickname">Taxallus A-Z</option>
                  <option value="date">Sana bo'yicha</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Avatar</th>
                    <th className="p-3">Taxallus</th>
                    <th className="p-3">VIP</th>
                    <th className="p-3">Sana</th>
                    <th className="p-3">Tartib</th>
                    <th className="p-3">Holati</th>
                    <th className="p-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {supporters
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
                        <td className="p-3 font-bold text-slate-300">#{s.displayOrder}</td>
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
                            {s.visible !== false ? 'Ko\'rinadi' : 'Yashiringan'}
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
                            title="Tahrirlash"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Haqiqatan ham "${s.nickname}" nomli homiyni o'chirmoqchimisiz?`)) {
                                deleteSupporter(s.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
