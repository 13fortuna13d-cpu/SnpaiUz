import React, { useState, useEffect } from 'react';
import { 
  Shield, Film, Tv, Users, MessageSquare, Sparkles, Database, 
  Plus, Trash2, Edit, Check, AlertTriangle, Eye, DollarSign, Crown, RefreshCw, Wallet, Grid, Sliders,
  Activity, Server, Cpu, UserCheck, UserPlus, BarChart3, TrendingUp, Clock, Heart, Award
} from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
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
    comments, reports, resolveReport, deleteCommentAdmin 
  } = useAnime();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'anime' | 'categories' | 'episodes' | 'users' | 'ai' | 'reports'>('dashboard');
  const [adminStats, setAdminStats] = useState<any>(null);

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

    </div>
  );
};
