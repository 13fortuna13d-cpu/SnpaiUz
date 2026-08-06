import { Manga, CoinPackage } from '../types';

export const DEFAULT_COIN_PACKAGES: CoinPackage[] = [
  { id: 'coin-pkg-1', coins: 50, priceUZS: 10000 },
  { id: 'coin-pkg-2', coins: 100, priceUZS: 20000 },
  { id: 'coin-pkg-3', coins: 250, priceUZS: 50000 },
  { id: 'coin-pkg-4', coins: 500, priceUZS: 100000, bonusCoins: 50, popular: true },
  { id: 'coin-pkg-5', coins: 1000, priceUZS: 200000, bonusCoins: 150 },
  { id: 'coin-pkg-6', coins: 2000, priceUZS: 400000, bonusCoins: 400 },
  { id: 'coin-pkg-7', coins: 5000, priceUZS: 1000000, bonusCoins: 1000 }
];

export const INITIAL_MANGA_DATA: Manga[] = [
  {
    id: 'manga-1',
    slug: 'solo-leveling-manhwa',
    title: {
      uz: "Solo Leveling (Yolg'iz Daraja Oshirish)",
      en: 'Solo Leveling',
      jp: '俺だけレベルアップな件'
    },
    originalTitle: 'Na Honjaman Rebeleop',
    synopsis: {
      uz: "Dunyoning eng ojiz 'E-darajali' ovchisi Sung Jinwoo dahshatli zindondagi sinovdan so'ng g'aroyib 'Tizim' kuchiga ega bo'ladi va dunyoni qutqaruvchi eng qudratli soyalar qiroliga aylanadi.",
      en: "The weakest E-rank hunter Sung Jinwoo gains the mysterious 'System' power after surviving a double dungeon, becoming the ultimate Shadow Monarch.",
      ru: "Cлабейший охотник Е-ранга Сон Джин-у обретает уникальную 'Систему' и становится легендарным Повелителем Теней."
    },
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    author: 'Chugong',
    artist: 'DUBU (REDICE STUDIO)',
    genres: ['Ekshn', 'Fentezi', 'Sarguzasht', 'Super Kuch'],
    tags: ['Hunter', 'Level Up', 'Shadow Monarch', 'System'],
    status: 'Completed',
    language: "O'zbekcha (Lokalizatsiya)",
    releaseYear: 2018,
    rating: 9.9,
    views: 452000,
    likes: 38900,
    bookmarksCount: 24500,
    isPremium: false,
    coinPrice: 0,
    createdAt: '2024-01-10',
    chapters: [
      {
        id: 'ch-sl-1',
        mangaId: 'manga-1',
        chapterNumber: 1,
        title: "1-Bob: E-Darajali Ovchi",
        isFree: true,
        coinPrice: 0,
        views: 120000,
        createdAt: '2024-01-10',
        pages: [
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ch-sl-2',
        mangaId: 'manga-1',
        chapterNumber: 2,
        title: "2-Bob: Qo'shaloq Zindon Dahshati",
        isFree: true,
        coinPrice: 0,
        views: 98000,
        createdAt: '2024-01-11',
        pages: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ch-sl-3',
        mangaId: 'manga-1',
        chapterNumber: 3,
        title: "3-Bob: Tizimning Uyg'onishi (VIP)",
        isFree: false,
        coinPrice: 5,
        views: 75000,
        createdAt: '2024-01-12',
        pages: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ch-sl-4',
        mangaId: 'manga-1',
        chapterNumber: 4,
        title: "4-Bob: Kundalik Topshiriq Sinovi",
        isFree: false,
        coinPrice: 5,
        views: 64000,
        createdAt: '2024-01-13',
        pages: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'manga-2',
    slug: 'jujutsu-kaisen-manga',
    title: {
      uz: 'Jujutsu Kaisen (Sehrgarlar Jangi)',
      en: 'Jujutsu Kaisen',
      jp: '呪術廻戦'
    },
    originalTitle: 'Jujutsu Kaisen',
    synopsis: {
      uz: "Itadori Yuji afsonaviy iblis Sukunaning barmog'ini yutib yuborib, la'natlar dunyosiga kirib keladi va sehrgarlar akademiyasida jang qilishni boshlaydi.",
      en: "Yuji Itadori swallows a legendary cursed finger of Sukuna, entering the world of sorcery and curses.",
      ru: "Юдзи Итадори проглатывает проклятый палец Сукуны и вступает в мир магов."
    },
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    genres: ['Ekshn', 'Müstika', 'Maktab', 'Sehr-jodu'],
    tags: ['Sukuna', 'Gojo Satoru', 'Curses', 'Sorcerers'],
    status: 'Ongoing',
    language: "O'zbekcha",
    releaseYear: 2018,
    rating: 9.7,
    views: 310000,
    likes: 29000,
    bookmarksCount: 18000,
    isPremium: false,
    coinPrice: 0,
    createdAt: '2024-02-01',
    chapters: [
      {
        id: 'ch-jjk-1',
        mangaId: 'manga-2',
        chapterNumber: 1,
        title: "1-Bob: Ryomen Sukuna",
        isFree: true,
        coinPrice: 0,
        views: 89000,
        createdAt: '2024-02-01',
        pages: [
          'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ch-jjk-2',
        mangaId: 'manga-2',
        chapterNumber: 2,
        title: "2-Bob: Satoru Gojo Bilan Uchrashuv",
        isFree: false,
        coinPrice: 5,
        views: 71000,
        createdAt: '2024-02-02',
        pages: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'manga-3',
    slug: 'demon-slayer-manga',
    title: {
      uz: 'Demon Slayer (Iblis Qotili)',
      en: 'Demon Slayer',
      jp: '鬼滅の刃'
    },
    originalTitle: 'Kimetsu no Yaiba',
    synopsis: {
      uz: "Oilasi iblislar tomonidan o'ldirilgan Tanjiro opasi Nezukoni odamga aylantirish uchun Iblis Qotillari safiga qo'shiladi.",
      en: "Tanjiro sets out to become a demon slayer after his family is slaughtered and his sister turned into a demon.",
      ru: "Тандзиро становится истребителем демонов, чтобы спасти свою сестру Незуко."
    },
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    author: 'Koyoharu Gotouge',
    artist: 'Koyoharu Gotouge',
    genres: ['Ekshn', 'Tarixiy', 'Sarguzasht', 'Müstika'],
    tags: ['Tanjiro', 'Nezuko', 'Katanas', 'Demons'],
    status: 'Completed',
    language: "O'zbekcha",
    releaseYear: 2016,
    rating: 9.8,
    views: 280000,
    likes: 24000,
    bookmarksCount: 16200,
    isPremium: false,
    coinPrice: 0,
    createdAt: '2024-02-10',
    chapters: [
      {
        id: 'ch-ds-1',
        mangaId: 'manga-3',
        chapterNumber: 1,
        title: "1-Bob: Shafqatsizlik",
        isFree: true,
        coinPrice: 0,
        views: 95000,
        createdAt: '2024-02-10',
        pages: [
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  }
];
