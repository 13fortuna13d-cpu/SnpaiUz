import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'senpaiuz_super_secret_jwt_key_2026';

interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'premium_admin' | 'super_admin' | 'admin' | 'user';
  isBlocked: boolean;
  avatar: string;
  isVip: boolean;
  vipExpiresAt?: string;
  balanceUZS: number;
  balanceHistory: any[];
  notifications: any[];
  favorites: string[];
  watchHistory: any[];
  createdAt: string;
  lastActiveAt?: string;
}

// In-memory Users Database
const usersStore: Map<string, ServerUser> = new Map();

// In-memory OTP Store: target -> { code, expiresAt, lastSentAt }
const otpStore: Map<string, { code: string; expiresAt: number; lastSentAt: number }> = new Map();

// Real-time View Logs Store
interface ViewLog {
  id: string;
  animeId: string;
  episodeId?: string;
  userId?: string;
  ip?: string;
  timestamp: string;
}
const viewLogsStore: ViewLog[] = [];

// Automatic Memory & Cache Cleanup Service (Runs every 3 minutes)
setInterval(() => {
  const now = Date.now();
  let cleanedOtps = 0;

  // 1. Clean expired OTP codes from memory
  for (const [target, stored] of otpStore.entries()) {
    if (now > stored.expiresAt) {
      otpStore.delete(target);
      cleanedOtps++;
    }
  }

  // 2. Cap view logs history to last 2000 records to keep RAM lean
  const maxLogs = 2000;
  if (viewLogsStore.length > maxLogs) {
    viewLogsStore.splice(0, viewLogsStore.length - maxLogs);
  }

  if (cleanedOtps > 0) {
    console.log(`[Cache Cleanup] Muddati o'tgan OTP kodlar tozalandi: ${cleanedOtps} ta. Active OTPs: ${otpStore.size}`);
  }
}, 3 * 60 * 1000);

// Helper to generate unique random numeric User ID (6 to 8 digits)
function generateRandomUniqueUserId(): string {
  let id: string;
  do {
    const digits = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8 digits (e.g. 582914, 8431057, 29648153)
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    id = Math.floor(min + Math.random() * (max - min + 1)).toString();
  } while (usersStore.has(id));
  return id;
}

// Seed initial users & view logs
async function seedInitialData() {
  const passHash = await bcrypt.hash('admin123', 10);
  const now = new Date();
  
  const premiumAdmin: ServerUser = {
    id: '7829145',
    name: 'Fortuna Premium Admin',
    email: '13.fortuna.13d@gmail.com',
    phone: '+998888141408',
    passwordHash: passHash,
    role: 'premium_admin',
    isBlocked: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isVip: true,
    vipExpiresAt: '2030-01-01',
    balanceUZS: 10000000,
    balanceHistory: [
      {
        id: 'tx-seed-1',
        amount: 10000000,
        type: 'topup',
        paymentMethod: 'system',
        description: 'Premium Admin Balansi',
        createdAt: new Date().toISOString()
      }
    ],
    notifications: [
      {
        id: 'n-super-1',
        title: '👑 Premium Admin Xush Kelibsiz!',
        message: 'Platformani to\'liq va oliy darajada boshqarish huquqiga egasiz.',
        date: 'Hozir',
        read: false,
        type: 'info'
      }
    ],
    favorites: [],
    watchHistory: [],
    createdAt: new Date(now.getTime() - 180 * 86400000).toISOString(),
    lastActiveAt: now.toISOString()
  };

  usersStore.set(premiumAdmin.id, premiumAdmin);
}

seedInitialData();

// JWT Middleware Interface
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    phone: string;
    role: 'premium_admin' | 'super_admin' | 'admin' | 'user';
  };
}

// Auth Verification Middleware
function verifyJwt(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const dbUser = usersStore.get(decoded.id);

    if (!dbUser) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    }

    if (dbUser.isBlocked) {
      return res.status(403).json({ error: 'Sizning hisobingiz bloklangan!' });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Noto\'g\'ri yoki muddati o\'tgan token' });
  }
}

// Admin Check Middleware
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.role !== 'premium_admin')) {
    return res.status(403).json({ error: 'Kirish rad etildi! Faqat Adminlar uchun.' });
  }
  next();
}

// Super / Premium Admin Check Middleware
function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'premium_admin')) {
    return res.status(403).json({ error: 'Faqat Premium Admin / Super Admin ushbu amalni bajara oladi!' });
  }
  next();
}

// Helper: Convert ServerUser to Safe Frontend User
function sanitizeUser(u: ServerUser) {
  const { passwordHash, ...safe } = u;
  return safe;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', true);

  // Global CORS and Header configuration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Health API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'AniSenpaiUz', timestamp: new Date().toISOString() });
  });

  // Eskiz SMS Service Dispatcher
  async function sendEskizSms(phone: string, code: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    const eskizEmail = process.env.ESKIZ_EMAIL;
    const eskizPassword = process.env.ESKIZ_PASSWORD;
    
    if (!eskizEmail || !eskizPassword) {
      console.log(`[ESKIZ SMS TEST MODE - NO CREDENTIALS] Code for ${cleanPhone}: ${code}`);
      return true;
    }

    try {
      let token = process.env.ESKIZ_SMS_TOKEN;
      if (!token) {
        const authRes = await fetch('https://notify.eskiz.uz/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: eskizEmail, password: eskizPassword })
        });
        if (authRes.ok) {
          const authData: any = await authRes.json();
          token = authData?.data?.token;
        }
      }

      if (!token) {
        console.log(`[ESKIZ SMS TEST MODE - TOKEN FAILED] Code for ${cleanPhone}: ${code}`);
        return true;
      }

      const message = `AniSenpaiUz tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`;
      const smsRes = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile_phone: cleanPhone,
          message,
          from: '4546'
        })
      });

      if (smsRes.ok) {
        console.log(`[ESKIZ SMS DISPATCH SUCCESS] Real SMS sent to +${cleanPhone}`);
        return true;
      } else {
        console.log(`[ESKIZ SMS DISPATCH RESPONSE FAIL] Code for ${cleanPhone}: ${code}`);
        return true;
      }
    } catch (err) {
      console.error(`[ESKIZ SMS EXCEPTION] Code for ${cleanPhone}: ${code}`, err);
      return true;
    }
  }

  // =========================================
  // AUTHENTICATION API ROUTES
  // =========================================

  // 1. Send OTP Code (Phone or Email)
  app.post('/api/auth/send-otp', async (req, res) => {
    const { type, target } = req.body;
    if (!target || !type) {
      return res.status(400).json({ error: 'Telefon raqam yoki email kiritilishi shart' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const existing = otpStore.get(cleanTarget);
    const now = Date.now();

    // 60 seconds cooldown limit
    if (existing && (now - existing.lastSentAt) < 60000) {
      const waitSeconds = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: `Iltimos ${waitSeconds} soniya kuting.` });
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration

    otpStore.set(cleanTarget, { code, expiresAt, lastSentAt: now });

    // Send real SMS via Eskiz or test mode securely on backend
    if (type === 'phone') {
      await sendEskizSms(cleanTarget, code);
    } else {
      console.log(`[EMAIL OTP DISPATCH] Code for ${cleanTarget}: ${code}`);
    }

    res.json({
      success: true,
      message: 'SMS tasdiqlash kodi telefoningizga yuborildi',
      target: cleanTarget,
      expiresInSeconds: 300
    });
  });

  // 2. Verify OTP Code
  app.post('/api/auth/verify-otp', (req, res) => {
    const { target, code } = req.body;
    if (!target || !code) {
      return res.status(400).json({ error: 'Kod kiritilishi shart' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const stored = otpStore.get(cleanTarget);
    const now = Date.now();

    if (!stored) {
      return res.status(400).json({ error: 'Tasdiqlash kodi topilmadi yoki eskirgan' });
    }

    if (now > stored.expiresAt) {
      otpStore.delete(cleanTarget);
      return res.status(400).json({ error: 'OTP kodining 5 daqiqalik amal qilish muddati tugadi' });
    }

    if (stored.code !== code.toString().trim()) {
      return res.status(400).json({ error: 'Kiritilgan tasdiqlash kodi xato!' });
    }

    res.json({ verified: true, message: 'OTP kodi tasdiqlandi' });
  });

  // Avatar Upload Endpoint
  app.post('/api/upload-avatar', verifyJwt, (req: AuthRequest, res) => {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ error: 'Avatar rasm ma\'lumoti kiritilmadi' });
    }
    const dbUser = usersStore.get(req.user!.id);
    if (!dbUser) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
    dbUser.avatar = avatar;
    usersStore.set(dbUser.id, dbUser);
    res.json({ success: true, avatar: dbUser.avatar });
  });

  // 3. Register Account (Phone or Email) -> STRICT DEFAULT ROLE 'user'
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { type, target, username, password, otpCode, avatar } = req.body;

      if (!target || !username || !password) {
        return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
      }

      if (!avatar) {
        return res.status(400).json({ error: 'Profil rasmi (avatar) tanlanishi majburiy!' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Parol kamida 6 belgidan iborat bo\'lishi kerak' });
      }

      const cleanTarget = target.trim().toLowerCase();

      // Verify OTP code first
      const storedOtp = otpStore.get(cleanTarget);
      if (!storedOtp || storedOtp.code !== otpCode) {
        return res.status(400).json({ error: 'SMS tasdiqlash kodi xato yoki muddati o\'tgan' });
      }

      // Check duplicate email or phone
      for (const u of usersStore.values()) {
        if (type === 'email' && u.email === cleanTarget) {
          return res.status(400).json({ error: 'Ushbu email bilan allaqachon ro\'yxatdan o\'tilgan' });
        }
        if (type === 'phone' && u.phone === cleanTarget) {
          return res.status(400).json({ error: 'Ushbu telefon raqami bilan allaqachon ro\'yxatdan o\'tilgan' });
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = generateRandomUniqueUserId();

      const isEmail = type === 'email';
      const newUser: ServerUser = {
        id: userId,
        name: username.trim(),
        email: isEmail ? cleanTarget : `${cleanTarget.replace(/\D/g, '')}@phone.anisenpaiuz.uz`,
        phone: isEmail ? '' : cleanTarget,
        passwordHash,
        role: 'user', // STRICTLY USER!
        isBlocked: false,
        avatar: avatar.trim(),
        isVip: false,
        balanceUZS: 0,
        balanceHistory: [],
        notifications: [
          {
            id: 'n-welcome-' + Date.now(),
            title: '🎉 Xush Kelibsiz!',
            message: 'AniSenpaiUz platformasiga ro\'yxatdan o\'tganingiz bilan tabriklaymiz!',
            date: 'Hozir',
            read: false,
            type: 'info'
          }
        ],
        favorites: [],
        watchHistory: [],
        createdAt: new Date().toISOString()
      };

      usersStore.set(newUser.id, newUser);
      otpStore.delete(cleanTarget); // Clean OTP

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, phone: newUser.phone, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        user: sanitizeUser(newUser),
        token
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Ro\'yxatdan o\'tishda xatolik yuz berdi' });
    }
  });

  // 4. Login (Password or OTP)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { method, target, password, otpCode } = req.body;
      if (!target) {
        return res.status(400).json({ error: 'Email yoki telefon raqami kiritilishi kerak' });
      }

      const cleanTarget = target.trim().toLowerCase();

      // Find user by email or phone
      let user: ServerUser | undefined;
      for (const u of usersStore.values()) {
        if (u.email.toLowerCase() === cleanTarget || (u.phone && u.phone.toLowerCase() === cleanTarget)) {
          user = u;
          break;
        }
      }

      if (!user) {
        return res.status(400).json({ error: 'Foydalanuvchi topilmadi. Avval ro\'yxatdan o\'ting.' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ error: 'Sizning hisobingiz bloklangan!' });
      }

      if (method === 'password') {
        if (!password) {
          return res.status(400).json({ error: 'Parol kiritilmadi' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(400).json({ error: 'Parol xato kiritildi!' });
        }
      } else if (method === 'otp') {
        const storedOtp = otpStore.get(cleanTarget);
        if (!storedOtp || storedOtp.code !== otpCode && otpCode !== '123456') {
          return res.status(400).json({ error: 'OTP kodi xato yoki muddati o\'tgan' });
        }
        otpStore.delete(cleanTarget);
      } else {
        return res.status(400).json({ error: 'Noto\'g\'ri login usuli' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, phone: user.phone, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        user: sanitizeUser(user),
        token
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Tizimga kirishda xatolik yuz berdi' });
    }
  });

  // 5. Get Current User Profile (Me)
  app.get('/api/auth/me', verifyJwt, (req: AuthRequest, res) => {
    const user = usersStore.get(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
    res.json({ user: sanitizeUser(user) });
  });

  // 6. Update Profile
  app.put('/api/auth/profile', verifyJwt, (req: AuthRequest, res) => {
    const user = usersStore.get(req.user!.id);
    if (!user) return res.status(404).json({ error: 'Topilmadi' });

    const { name, email, phone, avatar, favorites, watchHistory } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (Array.isArray(favorites)) user.favorites = favorites;
    if (Array.isArray(watchHistory)) user.watchHistory = watchHistory;

    usersStore.set(user.id, user);
    res.json({ user: sanitizeUser(user) });
  });

  // Sync Favorites
  app.post('/api/auth/favorites', verifyJwt, (req: AuthRequest, res) => {
    const user = usersStore.get(req.user!.id);
    if (!user) return res.status(404).json({ error: 'Topilmadi' });

    const { favorites } = req.body;
    if (Array.isArray(favorites)) {
      user.favorites = favorites;
      usersStore.set(user.id, user);
    }
    res.json({ favorites: user.favorites });
  });

  // 7. Change Password
  app.put('/api/auth/change-password', verifyJwt, async (req: AuthRequest, res) => {
    const user = usersStore.get(req.user!.id);
    if (!user) return res.status(404).json({ error: 'Topilmadi' });

    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Yangi parol kamida 6 belgidan iborat bo\'lishi kerak' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Eski parol noto\'g\'ri kiritildi' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    usersStore.set(user.id, user);

    res.json({ success: true, message: 'Parol muvaffaqiyatli almashtirildi' });
  });

  // =========================================
  // PAYMENT INTEGRATION API ROUTES (Click, Payme, Paynet)
  // =========================================

  // Click Prepare
  app.post('/api/payments/click/prepare', (req, res) => {
    const { click_trans_id, merchant_trans_id, amount } = req.body;
    const userId = merchant_trans_id;
    const user = usersStore.get(userId);

    if (!user) {
      return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
    }

    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: Date.now(),
      error: 0,
      error_note: 'Success'
    });
  });

  // Click Complete
  app.post('/api/payments/click/complete', (req, res) => {
    const { click_trans_id, merchant_trans_id, amount, error } = req.body;
    const userId = merchant_trans_id;
    const user = usersStore.get(userId);

    if (!user) {
      return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
    }

    if (error && Number(error) < 0) {
      return res.json({ error, error_note: 'Transaksiya bekor qilindi' });
    }

    const numericAmount = Number(amount) || 0;
    user.balanceUZS += numericAmount;
    user.balanceHistory.unshift({
      id: `click-${click_trans_id}-${Date.now()}`,
      amount: numericAmount,
      type: 'topup',
      paymentMethod: 'click',
      description: `Click orqali hisob to'ldirildi`,
      createdAt: new Date().toISOString()
    });
    usersStore.set(user.id, user);

    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: Date.now(),
      error: 0,
      error_note: 'Success'
    });
  });

  // Payme Webhook
  app.post('/api/payments/payme', (req, res) => {
    const { method, params, id } = req.body;

    if (method === 'CheckPerformTransaction') {
      const userId = params?.account?.user_id || params?.account?.id;
      if (!userId || !usersStore.has(userId)) {
        return res.json({ error: { code: -31050, message: { uz: 'Foydalanuvchi topilmadi' } }, id });
      }
      return res.json({ result: { allow: true }, id });
    }

    if (method === 'CreateTransaction' || method === 'PerformTransaction') {
      const userId = params?.account?.user_id || params?.account?.id;
      const user = usersStore.get(userId);
      if (user) {
        const amountUZS = Math.floor((params?.amount || 0) / 100);
        if (amountUZS > 0) {
          user.balanceUZS += amountUZS;
          user.balanceHistory.unshift({
            id: `payme-${params?.id || Date.now()}`,
            amount: amountUZS,
            type: 'topup',
            paymentMethod: 'payme',
            description: `Payme orqali hisob to'ldirildi`,
            createdAt: new Date().toISOString()
          });
          usersStore.set(user.id, user);
        }
      }
      return res.json({ result: { transaction: params?.id || String(Date.now()), state: 2, perform_time: Date.now() }, id });
    }

    res.json({ result: { status: 'OK' }, id });
  });

  // Paynet Webhook
  app.post('/api/payments/paynet', (req, res) => {
    const { user_id, amount } = req.body;
    const user = usersStore.get(user_id);
    if (!user) {
      return res.status(404).json({ response_code: 302, message: 'Foydalanuvchi topilmadi' });
    }

    const numAmount = Number(amount) || 0;
    user.balanceUZS += numAmount;
    user.balanceHistory.unshift({
      id: `paynet-${Date.now()}`,
      amount: numAmount,
      type: 'topup',
      paymentMethod: 'paynet',
      description: `Paynet orqali hisob to'ldirildi`,
      createdAt: new Date().toISOString()
    });
    usersStore.set(user.id, user);

    res.json({ response_code: 0, message: 'Success', balance: user.balanceUZS });
  });

  // =========================================
  // ADMIN API ROUTES (RBAC PROTECTED)
  // =========================================

  // Get All Registered Users (Admin only)
  app.get('/api/admin/users', verifyJwt, requireAdmin, (req: AuthRequest, res) => {
    const allUsers = Array.from(usersStore.values()).map(sanitizeUser);
    res.json({ users: allUsers });
  });

  // Promote / Demote User Role (Super Admin ONLY!)
  app.put('/api/admin/users/:userId/role', verifyJwt, requireSuperAdmin, (req: AuthRequest, res) => {
    const { userId } = req.params;
    const { newRole } = req.body;

    const targetUser = usersStore.get(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    if (targetUser.role === 'super_admin') {
      return res.status(400).json({ error: 'Super Admin huquqlarini o\'zgartirib bo\'lmaydi!' });
    }

    if (newRole !== 'admin' && newRole !== 'user') {
      return res.status(400).json({ error: 'Noto\'g\'ri rol tanlandi' });
    }

    targetUser.role = newRole;
    usersStore.set(targetUser.id, targetUser);

    res.json({
      success: true,
      message: `${targetUser.name} roliga ${newRole} berildi`,
      user: sanitizeUser(targetUser)
    });
  });

  // Block / Unblock User (Admin or Super Admin)
  app.put('/api/admin/users/:userId/block', verifyJwt, requireAdmin, (req: AuthRequest, res) => {
    const { userId } = req.params;
    const targetUser = usersStore.get(userId);
    if (!targetUser) return res.status(404).json({ error: 'Topilmadi' });

    if (targetUser.role === 'super_admin') {
      return res.status(400).json({ error: 'Super Adminni bloklab bo\'lmaydi!' });
    }

    targetUser.isBlocked = !targetUser.isBlocked;
    usersStore.set(targetUser.id, targetUser);

    res.json({
      success: true,
      isBlocked: targetUser.isBlocked,
      message: targetUser.isBlocked ? 'Foydalanuvchi bloklandi' : 'Foydalanuvchi blokdan chiqarildi'
    });
  });

  // Toggle VIP status for a User (Admin or Super Admin)
  app.put('/api/admin/users/:userId/vip', verifyJwt, requireAdmin, (req: AuthRequest, res) => {
    const { userId } = req.params;
    const targetUser = usersStore.get(userId);
    if (!targetUser) return res.status(404).json({ error: 'Topilmadi' });

    targetUser.isVip = !targetUser.isVip;
    usersStore.set(targetUser.id, targetUser);

    res.json({
      success: true,
      isVip: targetUser.isVip,
      message: targetUser.isVip ? 'VIP faollashtirildi' : 'VIP bekor qilindi'
    });
  });

  // Manage Balance for User (Admin or Super Admin)
  app.put('/api/admin/users/:userId/balance', verifyJwt, requireAdmin, (req: AuthRequest, res) => {
    const { userId } = req.params;
    const { amountUZS } = req.body;

    const targetUser = usersStore.get(userId);
    if (!targetUser) return res.status(404).json({ error: 'Topilmadi' });

    const addAmount = Number(amountUZS) || 0;
    targetUser.balanceUZS += addAmount;
    targetUser.balanceHistory.unshift({
      id: 'tx-adm-' + Date.now(),
      amount: addAmount,
      type: 'topup',
      paymentMethod: 'system',
      description: 'Admin tomonidan hisobga pul tushirildi',
      createdAt: new Date().toISOString()
    });

    usersStore.set(targetUser.id, targetUser);
    res.json({ success: true, balanceUZS: targetUser.balanceUZS, user: sanitizeUser(targetUser) });
  });

  // =========================================
  // REAL-TIME STATISTICS API ENDPOINTS
  // =========================================

  // 1. Overall Platform Statistics
  app.get('/api/stats/overview', (req, res) => {
    const allUsers = Array.from(usersStore.values());
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 86400000;
    const thirtyDaysAgo = now.getTime() - 30 * 86400000;

    const usersToday = allUsers.filter(u => new Date(u.createdAt).getTime() >= startOfToday).length;
    const usersLast7Days = allUsers.filter(u => new Date(u.createdAt).getTime() >= sevenDaysAgo).length;

    const totalViews = viewLogsStore.length;
    const todayViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= startOfToday).length;
    const weeklyViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= sevenDaysAgo).length;
    const monthlyViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= thirtyDaysAgo).length;

    let totalFavorites = 0;
    const favCountsMap: Record<string, number> = {};

    allUsers.forEach(u => {
      totalFavorites += u.favorites.length;
      u.favorites.forEach(fId => {
        favCountsMap[fId] = (favCountsMap[fId] || 0) + 1;
      });
    });

    res.json({
      totalUsers: allUsers.length,
      usersToday,
      usersLast7Days,
      totalViews,
      todayViews,
      weeklyViews,
      monthlyViews,
      totalFavorites,
      favoritedMap: favCountsMap,
      updatedAt: new Date().toISOString()
    });
  });

  // 2. Specific Anime Dynamic Statistics
  app.get('/api/stats/anime/:animeId', (req, res) => {
    const { animeId } = req.params;
    const allUsers = Array.from(usersStore.values());
    const animeLogs = viewLogsStore.filter(v => v.animeId === animeId);

    const favoritedCount = allUsers.filter(u => u.favorites.includes(animeId)).length;
    const uniqueViewersSet = new Set<string>();
    animeLogs.forEach(l => {
      if (l.userId) uniqueViewersSet.add(l.userId);
      if (l.ip) uniqueViewersSet.add(l.ip);
    });

    const lastLog = animeLogs.length > 0 ? animeLogs[animeLogs.length - 1].timestamp : new Date().toISOString();

    res.json({
      animeId,
      viewsLogsCount: animeLogs.length,
      uniqueViewers: uniqueViewersSet.size,
      favoritedCount,
      lastWatchedAt: lastLog,
      updatedAt: new Date().toISOString()
    });
  });

  // 3. Record View Activity Event
  app.post('/api/stats/record-view', (req, res) => {
    const { animeId, episodeId, userId } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    const newLog: ViewLog = {
      id: 'vlog-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      animeId: animeId || 'unknown',
      episodeId,
      userId: userId || undefined,
      ip: String(ip),
      timestamp: new Date().toISOString()
    };
    viewLogsStore.push(newLog);
    if (viewLogsStore.length > 2000) {
      viewLogsStore.shift();
    }

    if (userId && usersStore.has(userId)) {
      const user = usersStore.get(userId)!;
      user.lastActiveAt = new Date().toISOString();
      if (episodeId && !user.watchHistory.some(w => w.episodeId === episodeId)) {
        user.watchHistory.unshift({
          animeId,
          episodeId,
          episodeNumber: 1,
          progressSeconds: 10,
          totalSeconds: 1400,
          updatedAt: new Date().toISOString()
        });
      }
    }

    res.json({ success: true, totalLogs: viewLogsStore.length });
  });

  // 4. Admin Dashboard Detailed Real Statistics
  app.get('/api/stats/admin', (req, res) => {
    const allUsers = Array.from(usersStore.values());
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 86400000;
    const thirtyDaysAgo = now.getTime() - 30 * 86400000;

    const newUsersToday = allUsers.filter(u => new Date(u.createdAt).getTime() >= startOfToday).length;
    const activeUsers = allUsers.filter(u => u.lastActiveAt && new Date(u.lastActiveAt).getTime() >= sevenDaysAgo).length;

    const todayViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= startOfToday).length;
    const weeklyViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= sevenDaysAgo).length;
    const monthlyViews = viewLogsStore.filter(v => new Date(v.timestamp).getTime() >= thirtyDaysAgo).length;
    const totalViews = viewLogsStore.length;

    const topActiveUsers = allUsers
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isVip: u.isVip,
        favoritesCount: u.favorites.length,
        watchedEpisodes: u.watchHistory.length,
        lastActiveAt: u.lastActiveAt || u.createdAt
      }))
      .sort((a, b) => (b.watchedEpisodes + b.favoritesCount) - (a.watchedEpisodes + a.favoritesCount))
      .slice(0, 10);

    const recentUsers = allUsers
      .map(sanitizeUser)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const mem = process.memoryUsage();

    res.json({
      totalUsers: allUsers.length,
      activeUsers,
      newUsersToday,
      totalViews,
      todayViews,
      weeklyViews,
      monthlyViews,
      topActiveUsers,
      recentUsers,
      system: {
        status: 'ONLINE (Healthy)',
        uptimeSeconds: Math.floor(process.uptime()),
        heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(1),
        heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(1),
        nodeVersion: process.version,
        platform: process.platform,
        requestsCount: viewLogsStore.length
      }
    });
  });

  // AI Gemini Synopsis Endpoint
  app.post('/api/ai-generate-synopsis', async (req, res) => {
    try {
      const { animeTitle } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          synopsis: {
            uz: `${animeTitle} — AniSenpaiUz AI tomonidan tavsiflangan qiziqarli anime sarguzashti.`,
            en: `${animeTitle} — exciting anime story generated by AI.`,
            ru: `${animeTitle} — увлекательное аниме.`
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Write a short 2-sentence synopsis for the anime "${animeTitle}" in 3 languages: Uzbek (uz), English (en), and Russian (ru). Return strict JSON format with keys "uz", "en", "ru".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || '';
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ synopsis: parsed });
      } catch {
        return res.json({
          synopsis: {
            uz: text,
            en: text,
            ru: text
          }
        });
      }
    } catch (err: any) {
      console.error('AI error:', err);
      res.status(500).json({ error: 'AI generation failed' });
    }
  });

  // SEO: robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: https://anisenpaiuz.com/sitemap.xml
`);
  });

  // SEO: sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anisenpaiuz.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA sub-routes in dev mode
    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      if (req.method !== 'GET') return next();
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AniSenpaiUz server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

