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

export interface SystemStats {
  totalViews: number;
  totalUsers: number;
  totalAnime: number;
  vipSubscribers: number;
  totalRevenueUZS: number;
}
