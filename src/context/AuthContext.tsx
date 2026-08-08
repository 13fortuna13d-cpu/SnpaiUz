import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- Type Definitions ---
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'user';

export interface Transaction {
  id: string;
  amount: number;
  type: 'topup' | 'spend' | 'vip_purchase' | 'admin_adjust';
  paymentMethod: 'click' | 'payme' | 'card' | 'system';
  description: string;
  createdAt: string;
}

export interface CoinHistoryItem {
  id: string;
  userId: string;
  amount: number;
  type: 'topup' | 'spend' | 'referral_bonus' | 'admin_adjust';
  description: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'balance' | 'vip' | 'warning';
}

export interface WatchHistoryItem {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  progressSeconds: number;
  totalSeconds: number;
  updatedAt: string;
}

export interface MangaReadingHistoryItem {
  mangaId: string;
  chapterId: string;
  chapterNumber: number;
  updatedAt: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  priceUZS: number;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  roleVerified?: boolean;
  isBlocked: boolean;
  isVip: boolean;
  vipExpiresAt?: string | null;
  balanceUZS: number;
  balanceHistory: Transaction[];
  coins: number;
  coinHistory: CoinHistoryItem[];
  referralCode: string;
  totalReferrals: number;
  referralBonusEarned: number;
  unlockedChapters: string[];
  unlockedMangas: string[];
  mangaBookmarks: string[];
  mangaReadingHistory: MangaReadingHistoryItem[];
  notifications: NotificationItem[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
  createdAt: string;
}

// --- Default Super User Constant ---
export const DEFAULT_SUPER_USER: User = {
  id: 'admin-super-001',
  name: 'Super Admin',
  email: 'admin@anisenpai.uz',
  phone: '+998900000000',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'super_admin',
  roleVerified: true,
  isBlocked: false,
  isVip: true,
  vipExpiresAt: null,
  balanceUZS: 1000000,
  balanceHistory: [],
  coins: 1000,
  coinHistory: [],
  referralCode: 'SENPAI-ADMIN',
  totalReferrals: 0,
  referralBonusEarned: 0,
  unlockedChapters: [],
  unlockedMangas: [],
  mangaBookmarks: [],
  mangaReadingHistory: [],
  notifications: [],
  favorites: [],
  watchHistory: [],
  createdAt: new Date().toISOString()
};

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
  buyVipWithBalance: (planMonths: number, costUZS: number) => Promise<boolean>;
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
    coinPackagePurchased?: CoinPackage,
    bookmarksUpdate?: string[],
    readingHistoryUpdate?: MangaReadingHistoryItem[]
  ) => void;
}

// --- Safe Storage Utility (SSR Compatible) ---
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error(`localStorage.getItem xatosi (${key}):`, e);
      }
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`localStorage.setItem xatosi (${key}):`, e);
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`localStorage.removeItem xatosi (${key}):`, e);
      }
    }
  }
};

// --- Helper for Normalizing & Validating User Objects ---
const normalizeUser = (rawData: Partial<User> | null | undefined): User | null => {
  if (!rawData || typeof rawData !== 'object' || !rawData.id) {
    return null;
  }

  const validRoles: UserRole[] = ['super_admin', 'admin', 'moderator', 'user'];
  const requestedRole = rawData.role as UserRole;
  
  const isPrivileged = requestedRole === 'super_admin' || requestedRole === 'admin' || requestedRole === 'moderator';
  const isBackendVerified = Boolean(
    (rawData as any).roleVerified === true ||
    rawData.id === DEFAULT_SUPER_USER.id
  );

  let userRole: UserRole = 'user';
  if (validRoles.includes(requestedRole)) {
    if (isPrivileged) {
      userRole = isBackendVerified ? requestedRole : 'user';
    } else {
      userRole = requestedRole;
    }
  }

  return {
    id: String(rawData.id),
    name: rawData.name || 'Foydalanuvchi',
    email: rawData.email || '',
    phone: rawData.phone || '',
    avatar: rawData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: userRole,
    roleVerified: isBackendVerified && isPrivileged,
    isBlocked: Boolean(rawData.isBlocked),
    isVip: Boolean(rawData.isVip),
    vipExpiresAt: rawData.vipExpiresAt || null,
    balanceUZS: typeof rawData.balanceUZS === 'number' && !isNaN(rawData.balanceUZS) ? Math.max(0, rawData.balanceUZS) : 0,
    balanceHistory: Array.isArray(rawData.balanceHistory)
      ? rawData.balanceHistory.filter((item): item is Transaction => 
          Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.amount === 'number')
        )
      : [],
    coins: typeof rawData.coins === 'number' && !isNaN(rawData.coins) ? Math.max(0, rawData.coins) : 0,
    coinHistory: Array.isArray(rawData.coinHistory)
      ? rawData.coinHistory.filter((item): item is CoinHistoryItem =>
          Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.amount === 'number')
        )
      : [],
    referralCode: rawData.referralCode || '',
    totalReferrals: typeof rawData.totalReferrals === 'number' && !isNaN(rawData.totalReferrals) ? Math.max(0, rawData.totalReferrals) : 0,
    referralBonusEarned: typeof rawData.referralBonusEarned === 'number' && !isNaN(rawData.referralBonusEarned) ? Math.max(0, rawData.referralBonusEarned) : 0,
    unlockedChapters: Array.isArray(rawData.unlockedChapters) ? rawData.unlockedChapters.map(String) : [],
    unlockedMangas: Array.isArray(rawData.unlockedMangas) ? rawData.unlockedMangas.map(String) : [],
    mangaBookmarks: Array.isArray(rawData.mangaBookmarks) ? rawData.mangaBookmarks.map(String) : [],
    mangaReadingHistory: Array.isArray(rawData.mangaReadingHistory) ? rawData.mangaReadingHistory : [],
    notifications: Array.isArray(rawData.notifications)
      ? rawData.notifications.filter((item): item is NotificationItem =>
          Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string')
        )
      : [],
    favorites: Array.isArray(rawData.favorites) ? rawData.favorites.map(String) : [],
    watchHistory: Array.isArray(rawData.watchHistory)
      ? rawData.watchHistory.filter((item): item is WatchHistoryItem =>
          Boolean(item && typeof item === 'object' && typeof item.animeId === 'string')
        )
      : [],
    createdAt: rawData.createdAt || new Date().toISOString()
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => safeStorage.getItem('senpaiuz_token'));
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = safeStorage.getItem('senpaiuz_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return normalizeUser(parsed);
    } catch (e) {
      console.error('Boshlang\'ich localStorage user verifikatsiya xatosi:', e);
      return null;
    }
  });

  // Sync state with localStorage
  useEffect(() => {
    if (token) {
      safeStorage.setItem('senpaiuz_token', token);
    } else {
      safeStorage.removeItem('senpaiuz_token');
    }

    if (user) {
      safeStorage.setItem('senpaiuz_user', JSON.stringify(user));
    } else {
      safeStorage.removeItem('senpaiuz_user');
    }
  }, [user, token]);

  // Sync profile with backend on mount or token change
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          // Token is rejected or expired
          logout();
          throw new Error('Sessiya muddati tugadi. Qayta kiring.');
        }
        if (!res.ok) throw new Error(`Autentifikatsiya xatosi: HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          const userWithAuthVerified = {
            ...data.user,
            roleVerified: data.user.roleVerified ?? (data.user.role && data.user.role !== 'user')
          };
          const normalized = normalizeUser(userWithAuthVerified);
          if (normalized) {
            setUser((prev) => (prev ? { ...prev, ...normalized } : normalized));
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('GET /api/auth/me profili sinxronizatsiyasi xatosi:', err.message || err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [token]);

  // Send 6-digit OTP code (Phone or Email)
  const sendOtp = async (type: 'phone' | 'email', target: string) => {
    if (!target || !target.trim()) {
      return { success: false, message: 'Telefon yoki email kiritilishi shart' };
    }
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target: target.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'OTP yuborishda xatolik yuz berdi' };
      }
      return { success: true, message: data.message, code: data.code };
    } catch (e) {
      console.error('sendOtp API xatosi:', e);
      return { success: false, message: 'Tarmoq xatoligi. Server bilan aloqa yo\'q.' };
    }
  };

  // Verify OTP code
  const verifyOtp = async (target: string, code: string) => {
    if (!target || !code) {
      return { verified: false, message: 'Ma\'lumotlar to\'liq kiritilmadi' };
    }
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim(), code: code.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        return { verified: false, message: data.error || 'OTP tasdiqlanmadi' };
      }
      return { verified: true, message: data.message };
    } catch (e) {
      console.error('verifyOtp API xatosi:', e);
      return { verified: false, message: 'Tarmoq xatoligi' };
    }
  };

  // Register user account (Always sets default role 'user')
  const registerAccount = async (
    type: 'phone' | 'email',
    target: string,
    username: string,
    pass: string,
    otpCode: string,
    avatar: string
  ) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          target: target.trim(),
          username: username.trim(),
          password: pass,
          otpCode: otpCode.trim(),
          avatar,
          role: 'user'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Ro\'yxatdan o\'tish xatosi' };
      }
      
      const userData = { ...data.user, role: 'user', roleVerified: false };
      const normalized = normalizeUser(userData);
      if (normalized) {
        setUser(normalized);
        setToken(data.token || null);
        return { success: true };
      }
      return { success: false, error: 'Serverdan noto\'g\'ri foydalanuvchi ma\'lumotlari olindi' };
    } catch (e) {
      console.error('registerAccount API xatosi:', e);
      return { success: false, error: 'Server bilan aloqa o\'rnatib bo\'lmadi' };
    }
  };

  // User Login (Password or OTP)
  const loginAccount = async (method: 'password' | 'otp', target: string, passOrOtp: string) => {
    try {
      const body = method === 'password'
        ? { method: 'password', target: target.trim(), password: passOrOtp }
        : { method: 'otp', target: target.trim(), otpCode: passOrOtp.trim() };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login xatoligi' };
      }

      const userToNormalize = data.user
        ? { ...data.user, roleVerified: data.user.roleVerified ?? (data.user.role && data.user.role !== 'user') }
        : null;

      const normalized = normalizeUser(userToNormalize);
      if (normalized) {
        setUser(normalized);
        setToken(data.token || null);
        return { success: true };
      }
      return { success: false, error: 'Foydalanuvchi profili ma\'lumotlari mos kelmadi' };
    } catch (e) {
      console.error('loginAccount API xatosi:', e);
      return { success: false, error: 'Server bilan aloqa xatosi' };
    }
  };

  // Change Password
  const changePassword = async (oldPass: string, newPass: string) => {
    if (!token) return { success: false, error: 'Avtorizatsiya mavjud emas' };
    if (!oldPass || !newPass) return { success: false, error: 'Parollar to\'liq kiritilishi shart' };
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
      console.error('changePassword API xatosi:', e);
      return { success: false, error: 'Server xatosi' };
    }
  };

  // Google OAuth Login (Demo Mode)
  const loginWithGoogle = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const googleUserRaw: Partial<User> = {
      id: `google-${Date.now()}-${randomNum}`,
      name: `Google User #${randomNum}`,
      email: `user_${randomNum}@gmail.com`,
      phone: `+99890${randomNum}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      roleVerified: false,
      isBlocked: false,
      isVip: false,
      balanceUZS: 0,
      coins: 20,
      referralCode: `SNP-G${randomNum}`,
      notifications: [
        {
          id: 'n-g-' + Date.now(),
          title: 'Google orqali kirdingiz (Demo Mode)',
          message: 'Hisobingiz muvaffaqiyatli ulangan.',
          date: 'Hozir',
          read: false,
          type: 'info'
        }
      ]
    };

    const normalized = normalizeUser(googleUserRaw);
    if (normalized) {
      setUser(normalized);
      setToken(`google_oauth_demo_token_${Date.now()}`);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    safeStorage.removeItem('senpaiuz_token');
    safeStorage.removeItem('senpaiuz_user');
  }, []);

  // Upgrade VIP Plan
  const upgradeVip = (months: number) => {
    if (typeof months !== 'number' || months <= 0) return;

    setUser((prev) => {
      if (!prev) return null;
      
      const now = new Date();
      const currentExpiry = prev.vipExpiresAt && new Date(prev.vipExpiresAt) > now
        ? new Date(prev.vipExpiresAt)
        : now;

      currentExpiry.setMonth(currentExpiry.getMonth() + months);

      return {
        ...prev,
        isVip: true,
        vipExpiresAt: currentExpiry.toISOString()
      };
    });
  };

  // Top Up UZS Balance
  const topUpBalance = (amountUZS: number, paymentMethod: 'click' | 'payme' | 'card' | 'system') => {
    if (typeof amountUZS !== 'number' || amountUZS <= 0 || isNaN(amountUZS)) return;

    setUser((prev) => {
      if (!prev) return null;

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

      return {
        ...prev,
        balanceUZS: prev.balanceUZS + amountUZS,
        balanceHistory: [newTx, ...(prev.balanceHistory || [])],
        notifications: [newNotif, ...(prev.notifications || [])]
      };
    });
  };

  // Buy VIP Subscription with UZS Balance
  const buyVipWithBalance = async (planMonths: number, costUZS: number): Promise<boolean> => {
    if (typeof planMonths !== 'number' || planMonths <= 0 || typeof costUZS !== 'number' || costUZS <= 0) {
      return false;
    }

    return new Promise((resolve) => {
      setUser((prev) => {
        if (!prev || prev.balanceUZS < costUZS) {
          resolve(false);
          return prev;
        }

        const now = new Date();
        const currentExpiry = prev.vipExpiresAt && new Date(prev.vipExpiresAt) > now
          ? new Date(prev.vipExpiresAt)
          : now;

        currentExpiry.setMonth(currentExpiry.getMonth() + planMonths);

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

        resolve(true);

        return {
          ...prev,
          isVip: true,
          vipExpiresAt: currentExpiry.toISOString(),
          balanceUZS: prev.balanceUZS - costUZS,
          balanceHistory: [newTx, ...(prev.balanceHistory || [])],
          notifications: [newNotif, ...(prev.notifications || [])]
        };
      });
    });
  };

  // Toggle Favorite Anime
  const toggleFavorite = (animeId: string) => {
    if (!animeId) return;
    setUser((prev) => {
      if (!prev) return null;
      const favorites = prev.favorites || [];
      const exists = favorites.includes(animeId);
      const updated = exists
        ? favorites.filter((id) => id !== animeId)
        : [...favorites, animeId];

      if (token) {
        fetch('/api/auth/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ favorites: updated })
        }).catch((err) => console.error('Favorites sync error:', err));
      }

      return { ...prev, favorites: updated };
    });
  };

  // Update Anime Watch History
  const updateHistory = (
    animeId: string,
    episodeId: string,
    episodeNumber: number,
    progressSeconds: number,
    totalSeconds: number
  ) => {
    if (!animeId) return;
    setUser((prev) => {
      if (!prev) return null;
      const watchHistory = prev.watchHistory || [];
      const existing = watchHistory.filter((h) => h.animeId !== animeId);
      const newItem: WatchHistoryItem = {
        animeId,
        episodeId,
        episodeNumber: typeof episodeNumber === 'number' ? episodeNumber : 1,
        progressSeconds: typeof progressSeconds === 'number' ? progressSeconds : 0,
        totalSeconds: typeof totalSeconds === 'number' ? totalSeconds : 0,
        updatedAt: new Date().toISOString()
      };
      return {
        ...prev,
        watchHistory: [newItem, ...existing]
      };
    });
  };

  // Update Avatar URL
  const updateAvatar = (avatarUrl: string) => {
    if (!avatarUrl) return;
    setUser((prev) => {
      if (!prev) return null;

      if (token) {
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ avatar: avatarUrl })
        }).catch((err) => console.error('Avatar update error:', err));
      }

      return { ...prev, avatar: avatarUrl };
    });
  };

  // Update Profile Info
  const updateProfile = (name: string, email: string, phone: string) => {
    setUser((prev) => {
      if (!prev) return null;

      if (token) {
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, email, phone })
        }).catch((err) => console.error('Profile update error:', err));
      }

      return { ...prev, name: name.trim(), email: email.trim(), phone: phone.trim() };
    });
  };

  // Mark Notification as Read
  const markNotificationRead = (id: string) => {
    if (!id) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: (prev.notifications || []).map((n) => (n.id === id ? { ...n, read: true } : n))
      };
    });
  };

  // Clear All Notifications
  const clearAllNotifications = () => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, notifications: [] };
    });
  };

  // Check Favorite Status
  const isFavorite = useCallback((animeId: string) => {
    return user ? (user.favorites || []).includes(animeId) : false;
  }, [user]);

  // Update User Coins State
  const updateUserCoinsState = (
    coinDelta: number,
    type: 'topup' | 'spend' | 'referral_bonus' | 'admin_adjust',
    description: string,
    unlockedChapterId?: string,
    unlockedMangaId?: string,
    coinPackagePurchased?: CoinPackage,
    bookmarksUpdate?: string[],
    readingHistoryUpdate?: MangaReadingHistoryItem[]
  ) => {
    if (typeof coinDelta !== 'number' || isNaN(coinDelta)) return;

    setUser((prev) => {
      if (!prev) return null;

      const currentCoins = prev.coins ?? 0;
      const newCoins = Math.max(0, currentCoins + coinDelta);

      const coinTx: CoinHistoryItem = {
        id: 'coin-tx-' + Date.now(),
        userId: prev.id,
        amount: coinDelta,
        type,
        description,
        createdAt: new Date().toISOString()
      };

      const prevUnlockedChapters = prev.unlockedChapters || [];
      const updatedUnlockedChapters = unlockedChapterId
        ? Array.from(new Set([...prevUnlockedChapters, unlockedChapterId]))
        : prevUnlockedChapters;

      const prevUnlockedMangas = prev.unlockedMangas || [];
      const updatedUnlockedMangas = unlockedMangaId
        ? Array.from(new Set([...prevUnlockedMangas, unlockedMangaId]))
        : prevUnlockedMangas;

      const updatedBookmarks = bookmarksUpdate !== undefined
        ? bookmarksUpdate
        : (prev.mangaBookmarks || []);

      const updatedReadingHistory = readingHistoryUpdate !== undefined
        ? readingHistoryUpdate
        : (prev.mangaReadingHistory || []);

      const newNotif: NotificationItem | null = coinDelta !== 0 ? {
        id: 'n-coin-' + Date.now(),
        title: coinDelta > 0 ? '🪙 Coin hisobingizga tushdi!' : '🪙 Coin sarflandi',
        message: `${description} (${coinDelta > 0 ? '+' : ''}${coinDelta} Coin)`,
        date: 'Hozir',
        read: false,
        type: 'balance'
      } : null;

      const updatedNotifications = newNotif
        ? [newNotif, ...(prev.notifications || [])]
        : (prev.notifications || []);

      return {
        ...prev,
        coins: newCoins,
        coinHistory: [coinTx, ...(prev.coinHistory || [])],
        unlockedChapters: updatedUnlockedChapters,
        unlockedMangas: updatedUnlockedMangas,
        mangaBookmarks: updatedBookmarks,
        mangaReadingHistory: updatedReadingHistory,
        notifications: updatedNotifications
      };
    });
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
    throw new Error('useAuth faqat AuthProvider ichida ishlatilishi shart');
  }
  return context;
};

