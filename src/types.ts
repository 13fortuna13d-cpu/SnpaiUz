export interface SocialSettings {
  telegramUsername: string;
  telegramUrl: string;
  email: string;
  phone: string;
  discordUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  telegramBannerTitle: string;
  telegramBannerDesc: string;
  showTelegramBanner: boolean;
}

export type Language = 'uz' | 'en' | 'ru';

export type AnimeStatus = 'Ongoing' | 'Completed' | 'Upcoming';
export type Quality = '1080p' | '720p' | '480p' | '360p' | 'Auto';

export interface Episode {
  id: string;
  number: number;
  title: Record<Language, string>;
  duration: string;
  videoUrl: string; // standard MP4 or HLS link
  qualityUrls?: Partial<Record<Quality, string>>;
  subtitles?: {
    uz?: string;
    en?: string;
    ru?: string;
  };
  hasDubUZ: boolean;
  hasDubRU: boolean;
  introStart?: number; // seconds
  introEnd?: number;
  outroStart?: number;
  outroEnd?: number;
  airDate: string;
  views: number;
}

export interface Comment {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: 'Admin' | 'VIP' | 'User';
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  replies?: Comment[];
  isReported?: boolean;
}

export interface Anime {
  id: string;
  slug: string;
  title: {
    uz: string;
    en: string;
    jp: string;
  };
  synopsis: Record<Language, string>;
  poster: string;
  banner: string;
  trailerUrl?: string;
  screenshots: string[];
  rating: number; // 0 - 10
  votesCount: number;
  imdbRating: number;
  views: number;
  popularityScore: number;
  year: number;
  status: AnimeStatus;
  type: 'TV' | 'Movie' | 'OVA' | 'ONA';
  genres: string[];
  country: string; // 'Japan', 'China', 'Korea'
  studio: string;
  episodesCount: number;
  hasSub: boolean;
  hasDubUZ: boolean;
  hasDubRU: boolean;
  episodes: Episode[];
  isTrending?: boolean;
  isPopular?: boolean;
  isTopRated?: boolean;
  isFeatured?: boolean;
  ageRating?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'topup' | 'vip_purchase' | 'spend';
  paymentMethod?: 'click' | 'payme' | 'card' | 'system';
  description: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'episode' | 'balance' | 'vip';
  link?: string;
}

export interface MangaChapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  pages: string[]; // array of image URLs
  isFree: boolean;
  coinPrice: number; // e.g. 5
  views: number;
  createdAt: string;
}

export interface Manga {
  id: string;
  slug: string;
  title: {
    uz: string;
    en: string;
    jp: string;
  };
  originalTitle: string;
  synopsis: Record<Language, string>;
  poster: string;
  banner: string;
  author: string;
  artist: string;
  genres: string[];
  tags: string[];
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  language: string;
  releaseYear: number;
  rating: number; // 0 - 10
  views: number;
  likes: number;
  bookmarksCount: number;
  isPremium?: boolean;
  coinPrice?: number;
  chapters: MangaChapter[];
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earn/topup, negative for spend
  type: 'topup' | 'spend' | 'referral_bonus' | 'admin_adjust';
  description: string;
  createdAt: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  priceUZS: number;
  bonusCoins?: number;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'super_admin' | 'admin' | 'user';
  isBlocked?: boolean;
  isVip: boolean;
  vipExpiresAt?: string;
  balanceUZS: number;
  balanceHistory: Transaction[];
  coins: number;
  coinHistory: CoinTransaction[];
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  referralBonusEarned: number;
  unlockedChapters: string[]; // chapterIds
  unlockedMangas: string[]; // mangaIds
  mangaBookmarks: string[]; // mangaIds
  mangaReadingHistory: {
    mangaId: string;
    chapterId: string;
    chapterNumber: number;
    pageIndex: number;
    updatedAt: string;
  }[];
  notifications: NotificationItem[];
  favorites: string[]; // animeIds
  watchHistory: {
    animeId: string;
    episodeId: string;
    episodeNumber: number;
    progressSeconds: number;
    totalSeconds: number;
    updatedAt: string;
  }[];
  createdAt: string;
}

export interface AdConfig {
  id: string;
  type: 'banner' | 'video' | 'native';
  title: string;
  imageUrl?: string;
  targetUrl: string;
  active: boolean;
  position: 'header' | 'sidebar' | 'player_pre_roll' | 'footer';
}

export interface Report {
  id: string;
  type: 'comment' | 'video_error' | 'subtitle_error' | 'other';
  targetId: string;
  reason: string;
  reportedBy: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface Supporter {
  id: string;
  nickname: string;
  avatar: string;
  isVip?: boolean;
  amount?: number;
  dateSupported?: string;
  visible: boolean;
  displayOrder: number;
}

export interface SystemStats {
  totalViews: number;
  totalUsers: number;
  totalAnime: number;
  vipSubscribers: number;
  totalRevenueUZS: number;
}
