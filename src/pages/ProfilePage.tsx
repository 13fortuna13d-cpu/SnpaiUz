import React, { useState } from 'react';
import { Heart, History, Settings, Crown, Camera, Play, Wallet, ShieldCheck, User as UserIcon, Phone, Mail, LogOut, Plus, ArrowUpRight, Award, Edit3, Check, Bell, Lock, Coins, Share2, Copy, Sparkles, BookOpen, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnime } from '../context/AnimeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { AnimeCard } from '../components/AnimeCard';
import { SeoHead } from '../components/SeoHead';
import { TopUpModal } from '../components/TopUpModal';

interface ProfilePageProps {
  initialTab?: 'overview' | 'watchlist' | 'history' | 'balance' | 'settings' | 'coins';
  onNavigate: (page: string, params?: any) => void;
  onOpenVip: () => void;
  onOpenCoinModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialTab = 'overview',
  onNavigate,
  onOpenVip,
  onOpenCoinModal
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, themeNames } = useTheme();
  const { user, updateAvatar, updateProfile, logout, buyVipWithBalance, changePassword } = useAuth();
  const { animeList, socialSettings } = useAnime();

  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'history' | 'balance' | 'settings' | 'coins'>(initialTab);
  const [copiedRefLink, setCopiedRefLink] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Edit states
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [vipSuccessMsg, setVipSuccessMsg] = useState('');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
        <UserIcon className="w-12 h-12 text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">{t('auth.login_required')}</h2>
        <p className="text-xs text-slate-400">Profil va balansni boshqarish uchun tizimga kiring.</p>
        <button onClick={() => onNavigate('home')} className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-xl shadow-purple-600/30">
          {t('auth.back_home')}
        </button>
      </div>
    );
  }

  const favoriteAnimeList = animeList.filter(a => user.favorites.includes(a.id));

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Rasm hajmi 5MB dan oshmasligi kerak!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAvatar(event.target.result as string);
          setShowAvatarPicker(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1614680376593-902f749f7b2c?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=200&q=80'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editName, editEmail, editPhone);
    setIsEditingProfile(false);
  };

  const handleBuyVip = (months: number, cost: number) => {
    const ok = buyVipWithBalance(months, cost);
    if (ok) {
      setVipSuccessMsg(`${months} Oylik VIP obunasi muvaffaqiyatli xarid qilindi!`);
      setTimeout(() => setVipSuccessMsg(''), 4000);
    } else {
      setShowTopUpModal(true);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SeoHead title={`Profil - ${user.name} (SenpaiUz)`} />

      {/* Profile Main Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 rounded-3xl border border-purple-900/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar with editor */}
          <div className="flex flex-col items-center sm:items-start gap-2.5 shrink-0">
            <div className="relative group shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-purple-500/40 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-purple-900/60 ring-4 ring-purple-500/40 shadow-xl flex items-center justify-center text-purple-300 font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute inset-0 bg-slate-950/80 rounded-3xl flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 mb-1 text-purple-400" />
                <span>O'zgartirish</span>
              </button>
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>{user.avatar ? "Rasmni O'zgartirish" : "Rasm Qo'shish"}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              {user.isVip ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-[10px] flex items-center gap-1 shadow-md">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP A'ZO
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px]">
                  ODDIY FOYDALANUVCHI
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-mono">
              <span>ID: <strong className="text-purple-400">{user.id}</strong></span>
              {user.phone && <span>📱 {user.phone}</span>}
              <span>📧 {user.email}</span>
            </div>

            <p className="text-slate-500 text-[11px]">
              Ro'yxatdan o'tgan sana: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>

        {/* Action Controls & Admin / Logout buttons */}
        <div className="flex flex-wrap sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setShowTopUpModal(true)}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>Balansni to'ldirish</span>
          </button>

          <button
            onClick={onOpenVip}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIP Xarid Qilish</span>
          </button>

          {/* Telegram Support Button */}
          <a
            href={socialSettings.telegramUrl || 'https://t.me/SenpaiUzz'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-cyan-600/30 border border-cyan-500/50 hover:bg-cyan-600/40 text-cyan-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/10"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Qo'llab-quvvatlash ({socialSettings.telegramUsername || '@SenpaiUzz'})</span>
          </a>

          {/* Admin Panel Button - ONLY FOR ADMINS */}
          {(user.role === 'admin' || user.role === 'super_admin') && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/40 text-purple-300 font-black text-xs flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Panelga O'tish</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Tizimdan Chiqish</span>
          </button>
        </div>
      </div>

      {/* Avatar Picker Modal/Drawer with Upload & Anime Presets */}
      {showAvatarPicker && (
        <div className="p-5 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/40 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              <span>Profil Rasmini O'zgartirish</span>
            </h3>
            <button onClick={() => setShowAvatarPicker(false)} className="text-slate-400 hover:text-white text-xs">
              Yopish ✕
            </button>
          </div>

          {/* Custom Upload Button */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white">📱 O'z rasmingizni yuklash</p>
              <p className="text-[11px] text-slate-400">Telefon yoki kompyuterdan rasm faylini tanlang (PNG, JPG)</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-purple-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Fayl Tanlash</span>
            </button>
          </div>

          {/* Preset Anime Avatars */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300">Yoki tayyor anime avatarkalardan birini tanlang:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-2.5">
              {avatars.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Avatar option ${i + 1}`}
                  onClick={() => {
                    updateAvatar(img);
                    setShowAvatarPicker(false);
                  }}
                  className="w-14 h-14 rounded-2xl object-cover cursor-pointer hover:scale-110 hover:ring-2 ring-purple-500 transition-all border border-slate-800"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      {(() => {
        const uniqueWatchedAnimeCount = new Set(user.watchHistory.map(w => w.animeId)).size;
        const totalWatchedEpisodes = user.watchHistory.length;
        const favoritesCount = user.favorites.length;
        const createdDateFormatted = user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
          : new Date().toLocaleDateString('uz-UZ');
        const lastActiveFormatted = user.lastActiveAt
          ? new Date(user.lastActiveAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
          : 'Hozir (Online)';

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Balans UZS</span>
                <p className="text-base font-black text-emerald-400">{user.balanceUZS.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Sevimlilar</span>
                <p className="text-base font-black text-pink-400">{favoritesCount} ta</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Ko'rilgan Animelar</span>
                <p className="text-base font-black text-purple-400">{uniqueWatchedAnimeCount} ta</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Ko'rilgan Qismlar</span>
                <p className="text-base font-black text-cyan-400">{totalWatchedEpisodes} qism</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Yaratilgan Sana</span>
                <p className="text-xs font-bold text-slate-300">{createdDateFormatted}</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Oxirgi Kirgan Vaqt</span>
                <p className="text-xs font-bold text-emerald-300">{lastActiveFormatted}</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Foydalanuvchi ID</span>
                <p className="text-xs font-mono font-bold text-amber-400 truncate">{user.id}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {vipSuccessMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{vipSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'overview' ? 'bg-purple-600 border border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Ma'lumotlarim</span>
        </button>

        <button
          onClick={() => setActiveTab('balance')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'balance' ? 'bg-purple-600 border border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>Balans va Tarix</span>
        </button>

        <button
          onClick={() => setActiveTab('coins')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'coins' ? 'bg-amber-500 border border-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-950 text-amber-400 hover:text-amber-300'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Coin & Referal ({user.coins || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'watchlist' ? 'bg-purple-600 border border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400" />
          <span>Sevimlilar ({favoriteAnimeList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'history' ? 'bg-purple-600 border border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>Tarix</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'settings' ? 'bg-purple-600 border border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Sozlamalar</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PROFILE EDIT */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-purple-400" />
              <span>Shaxsiy Ma'lumotlar</span>
            </h3>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-600/30"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Bekor qilish' : 'Tahrirlash'}</span>
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Foydalanuvchi Nomi:</span>
                <span className="font-bold text-white text-sm">{user.name}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">User ID:</span>
                <span className="font-mono text-purple-300 text-sm font-bold">{user.id}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Telefon Raqami:</span>
                <span className="font-mono text-white text-sm">{user.phone || 'Kiritilmagan'}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Email Manzil:</span>
                <span className="font-mono text-white text-sm">{user.email}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Ism / Username</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Telefon Raqami</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
              >
                O'zgarishlarni Saqlash
              </button>
            </form>
          )}

          {/* Quick VIP Purchase Block */}
          <div className="p-6 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 rounded-3xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-amber-300 text-base flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>VIP Obunalar Tariflari</span>
                </h4>
                <p className="text-xs text-slate-400">Balansingizdan to'g'ridan-to'g'ri xarid qiling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <span className="text-xs font-bold text-slate-300 block">1 Oylik VIP</span>
                <span className="text-lg font-black text-amber-400 block">30,000 so'm</span>
                <button
                  onClick={() => handleBuyVip(1, 30000)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
                >
                  Xarid qilish
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 relative space-y-2 text-center">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase">Mashhur</span>
                <span className="text-xs font-bold text-slate-300 block">3 Oylik VIP</span>
                <span className="text-lg font-black text-amber-400 block">75,000 so'm</span>
                <button
                  onClick={() => handleBuyVip(3, 75000)}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs"
                >
                  Xarid qilish
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <span className="text-xs font-bold text-slate-300 block">1 Yillik VIP</span>
                <span className="text-lg font-black text-amber-400 block">250,000 so'm</span>
                <button
                  onClick={() => handleBuyVip(12, 250000)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
                >
                  Xarid qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE & TRANSACTIONS */}
      {activeTab === 'balance' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Hisob Balansi va Tranzaksiyalar</span>
              </h3>
              <p className="text-xs text-slate-400">Joriy balans: <strong className="text-emerald-400">{user.balanceUZS.toLocaleString()} so'm</strong></p>
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>To'ldirish</span>
            </button>
          </div>

          {/* History table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tranzaksiyalar Tarixi:</h4>

            {user.balanceHistory.length === 0 ? (
              <p className="py-8 text-center text-slate-500 text-xs">Hali tranzaksiyalar yo'q</p>
            ) : (
              <div className="space-y-2">
                {user.balanceHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${tx.type === 'topup' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{tx.description}</span>
                        <span className="text-[10px] text-slate-500">{tx.createdAt}</span>
                      </div>
                    </div>

                    <span className={`font-mono font-bold text-sm ${tx.type === 'topup' ? 'text-emerald-400' : 'text-purple-300'}`}>
                      {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} so'm
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2.5: COIN & REFERRAL SYSTEM */}
      {activeTab === 'coins' && (
        <div className="space-y-6">
          
          {/* Coin Balance Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Coins className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider block">Coin Balansingiz</span>
                <h3 className="text-3xl font-black text-white flex items-center gap-2">
                  <span>{user.coins || 0}</span>
                  <span className="text-sm font-bold text-amber-400">Tangalar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manga va premium boblarni ochish uchun foydalaning</p>
              </div>
            </div>

            <button
              onClick={onOpenCoinModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Coin Balansini To'ldirish</span>
            </button>
          </div>

          {/* Referral Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <span>Referal Tizim (Do'stlarni Taklif Qilish)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Har bir taklif qilingan do'stingiz birinchi marta Coin sotib olganida sizga <strong className="text-amber-400">10 Coin Bonus</strong> beriladi!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Sizning Referal Kodingiz:</span>
                <p className="text-lg font-mono font-black text-purple-300">{user.referralCode || `SNP-${user.id}`}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Taklif Qilingan Do'stlar:</span>
                <p className="text-lg font-black text-emerald-400">{user.totalReferrals || 0} kishi</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Ishlangan Referal Bonus:</span>
                <p className="text-lg font-black text-amber-400">{user.referralBonusEarned || 0} Coin</p>
              </div>
            </div>

            {/* Referral Link Copy Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Sizning Shaxsiy Referal Havolangiz:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://snpaiuz.uz/#ref=${user.referralCode || `SNP-${user.id}`}`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://snpaiuz.uz/#ref=${user.referralCode || `SNP-${user.id}`}`);
                    setCopiedRefLink(true);
                    setTimeout(() => setCopiedRefLink(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  {copiedRefLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedRefLink ? 'Nusxalandi!' : 'Nusxalash'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coin History */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Coin Harakatlari Tarixi</span>
            </h3>

            {(!user.coinHistory || user.coinHistory.length === 0) ? (
              <p className="py-8 text-center text-slate-500 text-xs">Hali coin tranzaksiyalari yo'q</p>
            ) : (
              <div className="space-y-2">
                {user.coinHistory.map((tx) => (
                  <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{tx.description}</span>
                      <span className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleString('uz-UZ')}</span>
                    </div>

                    <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} Coin
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div>
          {favoriteAnimeList.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-sm">{t('profile.no_favorites')}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favoriteAnimeList.map(anime => (
                <AnimeCard key={anime.id} anime={anime} onSelect={(s) => onNavigate('anime', { slug: s })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {user.watchHistory.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-sm">Hali tomosha tarixi mavjud emas.</p>
          ) : (
            user.watchHistory.map((item) => {
              const anime = animeList.find(a => a.id === item.animeId);
              if (!anime) return null;
              const ep = anime.episodes.find(e => e.id === item.episodeId) || anime.episodes[0];
              const animeTitle = anime.title[language] || anime.title.en || anime.title.uz;
              const epTitle = ep.title[language] || ep.title.en || ep.title.uz;

              return (
                <div
                  key={item.animeId}
                  onClick={() => onNavigate('watch', { slug: anime.slug, epId: ep.id })}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-between cursor-pointer hover:border-purple-500/50"
                >
                  <div className="flex items-center gap-4">
                    <img src={anime.poster} alt={animeTitle} className="w-12 h-16 object-cover rounded-xl" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{animeTitle}</h4>
                      <p className="text-xs text-purple-300">{ep.number}-{t('player.episode_short')}: {epTitle}</p>
                      <p className="text-[10px] text-slate-500">{item.updatedAt.split('T')[0]}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-600 text-white">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white text-lg">{t('profile.tab_settings')}</h3>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">{t('profile.language')}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'uz', label: "O'zbekcha (UZ)" },
                  { code: 'en', label: "English (EN)" },
                  { code: 'ru', label: "Русский (RU)" }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code as any)}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      language === item.code ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Theme Selector (8 Themes) */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white block">🎨 {language === 'uz' ? 'Sayt Mavzusi (Theme)' : language === 'ru' ? 'Тема Сайта' : 'Site Theme'}</label>
              <p className="text-[11px] text-slate-400">
                {language === 'uz' ? 'Sayt dizaynining ranglar gammasi va uslubini tanlang:' : language === 'ru' ? 'Выберите цветовую гамму и стиль сайта:' : 'Select color scheme and style for the app:'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themeNames.map((tItem) => {
                  const isSelected = theme === tItem.id;
                  const itemLabel = language === 'uz' ? tItem.labelUz : language === 'ru' ? tItem.labelRu : tItem.labelEn;
                  return (
                    <button
                      key={tItem.id}
                      onClick={() => setTheme(tItem.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden group ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: tItem.bgHex }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: tItem.accentHex }} />
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-slate-300'}`}>
                        {itemLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Change Form */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Parolni Almashtirish</span>
              </h4>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPassword !== confirmNewPassword) {
                    setPassError('Yangi parollar mos kelmadi!');
                    return;
                  }
                  if (newPassword.length < 6) {
                    setPassError('Parol kamida 6 belgidan iborat bo\'lishi kerak!');
                    return;
                  }
                  setPassError('');
                  setPassSuccess('');
                  const res = await changePassword(oldPassword, newPassword);
                  if (res.success) {
                    setPassSuccess('Parol muvaffaqiyatli almashtirildi!');
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  } else {
                    setPassError(res.error || 'Parolni o\'zgartirib bo\'lmadi');
                  }
                }}
                className="max-w-md space-y-3"
              >
                {passError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                    {passError}
                  </div>
                )}
                {passSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium">
                    {passSuccess}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Eski Parol</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Yangi Parol</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Yangi Parolni Tasdiqlash</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                >
                  Parolni Yangilash
                </button>
              </form>
            </div>

            {/* Support Channels & Assistance */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Qo'llab-quvvatlash va Yordam (Support)</span>
              </h4>
              <p className="text-xs text-slate-400">
                Savollaringiz, takliflaringiz yoki texnik muammolar bo'yicha ma'murlarga bog'laning:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <a
                  href={socialSettings.telegramUrl || 'https://t.me/SenpaiUzz'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex items-center gap-3 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300">Telegram Support</span>
                    <span className="text-[11px] text-cyan-400 font-mono">{socialSettings.telegramUsername || '@SenpaiUzz'}</span>
                  </div>
                </a>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block">Email Pochta</span>
                    <span className="text-[11px] text-slate-400 font-mono truncate block">{socialSettings.email || 'support@anisenpaiuz.com'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Ishonch Telefoni</span>
                    <span className="text-[11px] text-slate-400 font-mono">{socialSettings.phone || '+998 (90) 123-45-67'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
                className="px-6 py-3 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 font-bold text-xs flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Hisobdan Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TopUp Modal */}
      {showTopUpModal && (
        <TopUpModal onClose={() => setShowTopUpModal(false)} />
      )}

    </div>
  );
};
