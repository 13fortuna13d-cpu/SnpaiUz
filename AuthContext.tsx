import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction, NotificationItem } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sendOtp: (type: 'phone' | 'email', target: string) => Promise<{ success: boolean; message: string; code?: string }>;
  verifyOtp: (target: string, code: string) => Promise<{ verified: boolean; message?: string }>;
  registerAccount: (type: 'phone' | 'email', target: string, username: string, pass: string, otpCode: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  loginAccount: (method: 'password' | 'otp', target: string, passOrOtp: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginWithGoogle: () => void;
  logout: () => void;
  upgradeVip: (planMonths: number) => void;
  topUpBalance: (amountUZS: number, paymentMethod: 'click' | 'payme' | 'card' | 'system') => void;
  buyVipWithBalance: (planMonths: number, costUZS: number) => boolean;
  toggleFavorite: (animeId: string) => void;
  updateHistory: (animeId: string, episodeId: string, episodeNumber: number, progressSeconds: number, totalSeconds: number) => void;
  updateAvatar: (avatarUrl: string) => void;
  updateProfile: (name: string, email: string, phone: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isFavorite: (animeId: string) => boolean;
  updateUserCoinsState: (
    coinDelta: number,
    type: 'topup' | 'spend' | 'referral_bonus' | 'admin_adjust',
    description: string,
    unlockedChapterId?: string,
    unlockedMangaId?: string,
    coinPackagePurchased?: any,
    bookmarksUpdate?: string[],
    readingHistoryUpdate?: any[]
  ) => void;
}

const DEFAULT_SUPER_USER: User = {
  id: '8431057',
  name: 'SuperAdmin_AniSenpaiUz',
  email: 'admin@anisenpaiuz.uz',
  phone: '+998901234567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'super_admin',
  isBlocked: false,
  isVip: true,
  vipExpiresAt: '2030-01-01',
  balanceUZS: 1000000,
  balanceHistory: [
    {
      id: 'tx-seed-1',
      amount: 1000000,
      type: 'topup',
      paymentMethod: 'system',
      description: 'Super Admin Boshlang\'ich Balansi',
      createdAt: '2024-01-01'
    }
  ],
  coins: 50,
  coinHistory: [
    {
      id: 'coin-tx-seed-1',
      userId: '8431057',
      amount: 50,
      type: 'topup',
      description: 'Boshlang\'ich Admin Coin Bonusi',
      createdAt: new Date().toISOString()
    }
  ],
  referralCode: 'SNP-ADM84',
  totalReferrals: 0,
  referralBonusEarned: 0,
  unlockedChapters: [],
  unlockedMangas: [],
  mangaBookmarks: [],
  mangaReadingHistory: [],
  notifications: [
    {
      id: 'n-super-1',
      title: '👑 Super Admin Xush Kelibsiz!',
      message: 'Platformani to\'liq boshqarish huquqiga egasiz.',
      date: 'Hozir',
      read: false,
      type: 'info'
    }
  ],
  favorites: [],
  watchHistory: [],
  createdAt: '2024-01-01'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('senpaiuz_token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('senpaiuz_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Guarantee 6-10 digit numeric ID format
          const rawId = String(parsed.id || '');
          const numericId = /^\d{6,10}$/.test(rawId) ? rawId : '8431057';

          return {
            ...DEFAULT_SUPER_USER,
            ...parsed,
            id: numericId,
            favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
            watchHistory: Array.isArray(parsed.watchHistory) ? parsed.watchHistory : [],
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
            balanceHistory: Array.isArray(parsed.balanceHistory) ? parsed.balanceHistory : [],
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }
    return DEFAULT_SUPER_USER;
  });

  // Sync token & user to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('senpaiuz_token', token);
      } else {
        localStorage.removeItem('senpaiuz_token');
      }
      if (user) {
        localStorage.setItem('senpaiuz_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('senpaiuz_user');
      }
    } catch (e) {
      console.error('Failed saving auth state:', e);
    }
  }, [user, token]);

  // Sync profile on load if token exists
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(prev => ({ ...prev, ...data.user }));
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // Send 6-digit OTP code (Phone or Email)
  const sendOtp = async (type: 'phone' | 'email', target: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'OTP yuborishda xatolik yuz berdi' };
      }
      return { success: true, message: data.message, code: data.code };
    } catch (e) {
      return { success: false, message: 'Tarmoq xatoligi. Server bilan aloqa yo\'q.' };
    }
  };

  // Verify OTP code
  const verifyOtp = async (target: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, code })
      });
      const data = await res.json();
      if (!res.ok) {
        return { verified: false, message: data.error || 'OTP tasdiqlanmadi' };
      }
      return { verified: true, message: data.message };
    } catch (e) {
      return { verified: false, message: 'Tarmoq xatoligi' };
    }
  };

  // Register Account (Strictly defaults to 'user' role)
  const registerAccount = async (type: 'phone' | 'email', target: string, username: string, pass: string, otpCode: string, avatar: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target, username, password: pass, otpCode, avatar })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Ro\'yxatdan o\'tish xatosi' };
      }
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Server bilan aloqa o\'rnatib bo\'lmadi' };
    }
  };

  // Login Account
  const loginAccount = async (method: 'password' | 'otp', target: string, passOrOtp: string) => {
    try {
      const body = method === 'password'
        ? { method: 'password', target, password: passOrOtp }
        : { method: 'otp', target, otpCode: passOrOtp };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login xatoligi' };
      }
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Server bilan aloqa xatosi' };
    }
  };

  // Change Password
  const changePassword = async (oldPass: string, newPass: string) => {
    if (!token) return { success: false, error: 'Avtorizatsiya mavjud emas' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Parol o\'zgarmadi' };
      }
      return { success: true, message: data.message };
    } catch (e) {
      return { success: false, error: 'Server xatosi' };
    }
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      id: 'USR-G' + Math.floor(10000 + Math.random() * 90000),
      name: 'Google Otaku User',
      email: 'otaku.user@gmail.com',
      phone: '+998 90 999 88 77',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'user', // STRICTLY USER
      isBlocked: false,
      isVip: false,
      balanceUZS: 0,
      balanceHistory: [],
      notifications: [
        {
          id: 'n-g',
          title: 'Google orqali kirdingiz',
          message: 'Hisobingiz muvaffaqiyatli ulangan.',
          date: 'Hozir',
          read: false,
          type: 'info'
        }
      ],
      favorites: [],
      watchHistory: [],
      coins: 20,
      coinHistory: [],
      referralCode: 'SNP-G' + Math.floor(1000 + Math.random() * 9000),
      totalReferrals: 0,
      referralBonusEarned: 0,
      unlockedChapters: [],
      unlockedMangas: [],
      mangaBookmarks: [],
      mangaReadingHistory: [],
      createdAt: new Date().toISOString()
    };
    setUser(googleUser);
    setToken('google_oauth_dummy_token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const upgradeVip = (months: number) => {
    if (!user) return;
    const now = new Date();
    const expiry = new Date(now.setMonth(now.getMonth() + months));
    setUser({
      ...user,
      isVip: true,
      vipExpiresAt: expiry.toISOString()
    });
  };

  const topUpBalance = (amountUZS: number, paymentMethod: 'click' | 'payme' | 'card' | 'system') => {
    if (!user) return;
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      amount: amountUZS,
      type: 'topup',
      paymentMethod,
      description: `${paymentMethod.toUpperCase()} orqali balans to'ldirildi`,
      createdAt: new Date().toLocaleString()
    };
    const newNotif: NotificationItem = {
      id: 'n-' + Date.now(),
      title: '💳 Balans to\'ldirildi!',
      message: `Hisobingizga +${amountUZS.toLocaleString()} so'm muvaffaqiyatli qo'shildi.`,
      date: 'Hozir',
      read: false,
      type: 'balance'
    };
    setUser({
      ...user,
      balanceUZS: user.balanceUZS + amountUZS,
      balanceHistory: [newTx, ...user.balanceHistory],
      notifications: [newNotif, ...user.notifications]
    });
  };

  const buyVipWithBalance = (planMonths: number, costUZS: number): boolean => {
    if (!user) return false;
    if (user.balanceUZS < costUZS) return false;

    const now = new Date();
    const expiry = new Date(now.setMonth(now.getMonth() + planMonths));
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      amount: costUZS,
      type: 'vip_purchase',
      paymentMethod: 'system',
      description: `${planMonths} oylik VIP obunasi xarid qilindi`,
      createdAt: new Date().toLocaleString()
    };
    const newNotif: NotificationItem = {
      id: 'n-' + Date.now(),
      title: '✨ VIP Obuna faollashtirildi!',
      message: `${planMonths} oy davomida barcha animelarni reklamasiz va VIP formatda tomosha qiling.`,
      date: 'Hozir',
      read: false,
      type: 'vip'
    };

    setUser({
      ...user,
      isVip: true,
      vipExpiresAt: expiry.toISOString(),
      balanceUZS: user.balanceUZS - costUZS,
      balanceHistory: [newTx, ...user.balanceHistory],
      notifications: [newNotif, ...user.notifications]
    });
    return true;
  };

  const toggleFavorite = (animeId: string) => {
    if (!user) return;
    const exists = user.favorites.includes(animeId);
    const updated = exists
      ? user.favorites.filter(id => id !== animeId)
      : [...user.favorites, animeId];
    setUser({ ...user, favorites: updated });

    if (token) {
      fetch('/api/auth/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ favorites: updated })
      }).catch(() => {});
    }
  };

  const updateHistory = (animeId: string, episodeId: string, episodeNumber: number, progressSeconds: number, totalSeconds: number) => {
    if (!user) return;
    const existing = user.watchHistory.filter(h => h.animeId !== animeId);
    const newItem = {
      animeId,
      episodeId,
      episodeNumber,
      progressSeconds,
      totalSeconds,
      updatedAt: new Date().toISOString()
    };
    setUser({
      ...user,
      watchHistory: [newItem, ...existing]
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    setUser({ ...user, avatar: avatarUrl });
    if (token) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatar: avatarUrl })
      }).catch(() => {});
    }
  };

  const updateProfile = (name: string, email: string, phone: string) => {
    if (!user) return;
    setUser({
      ...user,
      name,
      email,
      phone
    });
    if (token) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, phone })
      }).catch(() => {});
    }
  };

  const markNotificationRead = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      notifications: user.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    });
  };

  const clearAllNotifications = () => {
    if (!user) return;
    setUser({
      ...user,
      notifications: []
    });
  };

  const isFavorite = (animeId: string) => {
    return user ? user.favorites.includes(animeId) : false;
  };

  const updateUserCoinsState = (
    coinDelta: number,
    type: 'topup' | 'spend' | 'referral_bonus' | 'admin_adjust',
    description: string,
    unlockedChapterId?: string,
    unlockedMangaId?: string,
    coinPackagePurchased?: any,
    bookmarksUpdate?: string[],
    readingHistoryUpdate?: any[]
  ) => {
    if (!user) return;

    let currentCoins = user.coins ?? 0;
    let newCoins = currentCoins + coinDelta;
    if (newCoins < 0) newCoins = 0;

    const coinTx = {
      id: 'coin-tx-' + Date.now(),
      userId: user.id,
      amount: coinDelta,
      type,
      description,
      createdAt: new Date().toISOString()
    };

    const updatedUnlockedChapters = unlockedChapterId
      ? Array.from(new Set([...(user.unlockedChapters || []), unlockedChapterId]))
      : (user.unlockedChapters || []);

    const updatedUnlockedMangas = unlockedMangaId
      ? Array.from(new Set([...(user.unlockedMangas || []), unlockedMangaId]))
      : (user.unlockedMangas || []);

    const updatedBookmarks = bookmarksUpdate !== undefined
      ? bookmarksUpdate
      : (user.mangaBookmarks || []);

    const updatedReadingHistory = readingHistoryUpdate !== undefined
      ? readingHistoryUpdate
      : (user.mangaReadingHistory || []);

    const newNotif = coinDelta !== 0 ? {
      id: 'n-coin-' + Date.now(),
      title: coinDelta > 0 ? '🪙 Coin hisobingizga tushdi!' : '🪙 Coin sarflandi',
      message: `${description} (${coinDelta > 0 ? '+' : ''}${coinDelta} Coin)`,
      date: 'Hozir',
      read: false,
      type: 'balance' as const
    } : null;

    const updatedNotifications = newNotif
      ? [newNotif, ...(user.notifications || [])]
      : (user.notifications || []);

    const updatedUser: User = {
      ...user,
      coins: newCoins,
      coinHistory: [coinTx, ...(user.coinHistory || [])],
      unlockedChapters: updatedUnlockedChapters,
      unlockedMangas: updatedUnlockedMangas,
      mangaBookmarks: updatedBookmarks,
      mangaReadingHistory: updatedReadingHistory,
      notifications: updatedNotifications
    };

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      sendOtp,
      verifyOtp,
      registerAccount,
      loginAccount,
      changePassword,
      loginWithGoogle,
      logout,
      upgradeVip,
      topUpBalance,
      buyVipWithBalance,
      toggleFavorite,
      updateHistory,
      updateAvatar,
      updateProfile,
      markNotificationRead,
      clearAllNotifications,
      isFavorite,
      updateUserCoinsState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

