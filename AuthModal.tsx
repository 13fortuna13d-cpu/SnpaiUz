import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Upload, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  useLockBodyScroll();
  const { t } = useLanguage();
  const { sendOtp, verifyOtp, registerAccount, loginAccount, loginWithGoogle } = useAuth();

  // Mode: 'register' | 'login'
  const [tab, setTab] = useState<'register' | 'login'>('register');

  // Input States
  const [type, setType] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  
  // Register Steps: 1 = target, 2 = otp, 3 = password/profile
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regAvatar, setRegAvatar] = useState<string>('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Login Mode: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtpStep, setLoginOtpStep] = useState<1 | 2>(1);

  // Shared OTP States
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Timer countdown for resend
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getTarget = () => (type === 'phone' ? phone : email);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Rasm hajmi 5MB dan kichik bo\'lishi kerak.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setRegAvatar(reader.result as string);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // REGISTER FLOW HANDLERS
  const handleRegisterSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const target = getTarget();
    if (type === 'phone' && (!phone || phone.length < 9)) {
      setError('Telefon raqamini to\'liq kiriting (+998 90 123 45 67).');
      return;
    }
    if (type === 'email' && (!email || !email.includes('@'))) {
      setError('Email manzilini to\'g\'ri kiriting.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(type, target);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    setTimer(60);
    setRegStep(2);
    setSuccessMsg('SMS tasdiqlash kodi telefoningizga yuborildi!');
  };

  const handleRegisterVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otpCode.length < 4) {
      setError('6 xonali SMS kodini kiriting.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(getTarget(), otpCode);
    setLoading(false);

    if (!res.verified) {
      setError(res.message || 'SMS kodi noto\'g\'ri');
      return;
    }

    setRegStep(3);
    setSuccessMsg('Kod tasdiqlandi! Endi profil rasmingiz va parolingizni belgilang.');
  };

  const handleRegisterComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regAvatar) {
      setError('Profil rasmi (Avatar) yuklanishi majburiy!');
      return;
    }

    if (!regUsername.trim()) {
      setError('Foydalanuvchi nomini kiriting.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Parol kamida 6 belgidan iborat bo\'lishi kerak.');
      return;
    }

    if (regPassword !== regConfirmPass) {
      setError('Parol va parolni tasdiqlash mos kelmadi!');
      return;
    }

    setLoading(true);
    const res = await registerAccount(type, getTarget(), regUsername, regPassword, otpCode, regAvatar);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Ro\'yxatdan o\'tishda xatolik');
      return;
    }

    onClose();
  };

  // LOGIN FLOW HANDLERS
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const target = getTarget();

    if (loginMethod === 'password') {
      if (!loginPassword) {
        setError('Parolingizni kiriting.');
        return;
      }
      setLoading(true);
      const res = await loginAccount('password', target, loginPassword);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Login xatosi');
        return;
      }
      onClose();
    } else {
      // OTP mode
      if (loginOtpStep === 1) {
        setLoading(true);
        const res = await sendOtp(type, target);
        setLoading(false);

        if (!res.success) {
          setError(res.message);
          return;
        }

        setTimer(60);
        setLoginOtpStep(2);
      } else {
        setLoading(true);
        const res = await loginAccount('otp', target, otpCode);
        setLoading(false);

        if (!res.success) {
          setError(res.error || 'OTP kodi xato');
          return;
        }
        onClose();
      }
    }
  };

  const handleGoogle = () => {
    loginWithGoogle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('auth.title_full')}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {tab === 'register' ? 'Ro\'yxatdan O\'tish' : 'Tizimga Kirish'}
          </h2>
          <p className="text-slate-400 text-xs">
            {tab === 'register' 
              ? 'Xavfsiz OTP orqali 3 qadamda yangi hisob yarating' 
              : 'Akkauntingizga kirish uchun malumotlarni kiriting'}
          </p>
        </div>

        {/* Top Tab Bar: Register vs Login */}
        <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegStep(1);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ro'yxatdan O'tish
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginOtpStep(1);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tizimga Kirish
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* Method Switcher: Phone vs Email */}
        {((tab === 'register' && regStep === 1) || (tab === 'login' && loginOtpStep === 1)) && (
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setType('phone')}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                type === 'phone'
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('auth.phone_tab')}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('email')}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                type === 'email'
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('auth.email_tab')}</span>
            </button>
          </div>
        )}

        {/* TAB 1: REGISTER FLOW */}
        {tab === 'register' && (
          <>
            {regStep === 1 && (
              <form onSubmit={handleRegisterSendOtp} className="space-y-4">
                {type === 'phone' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.phone_number_label')}</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.email_address_label')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@anisenpaiuz.uz"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30"
                >
                  <span>{loading ? 'Yuborilmoqda...' : 'Tasdiqlash Kodini Yuborish'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {regStep === 2 && (
              <form onSubmit={handleRegisterVerifyOtp} className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{t('auth.enter_sms_code_label')}</h3>
                  <p className="text-xs text-slate-400">
                    <span className="text-purple-300 font-bold">{getTarget()}</span> ga SMS kodi yuborildi.
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  className="w-44 mx-auto text-center font-mono text-2xl tracking-[0.4em] bg-slate-950 border-2 border-purple-500 rounded-2xl py-2.5 text-white"
                />

                <div className="text-[11px] text-slate-400">
                  {timer > 0 ? (
                    <span>{t('auth.resend_prefix')} <strong className="text-white">{timer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sendOtp(type, getTarget());
                        setTimer(60);
                      }}
                      className="text-purple-400 hover:underline font-bold"
                    >
                      Kodni Qayta Yuborish
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="flex-1 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Orqaga
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30"
                  >
                    Tasdiqlash
                  </button>
                </div>
              </form>
            )}

            {regStep === 3 && (
              <form onSubmit={handleRegisterComplete} className="space-y-4">
                {/* Avatar Upload (Mandatory) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{t('auth.avatar_label')} <span className="text-red-400">* Majburiy</span></span>
                  </label>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      regAvatar 
                        ? 'border-purple-500 bg-purple-950/30' 
                        : 'border-slate-800 hover:border-purple-500 bg-slate-950 hover:bg-slate-900/80'
                    }`}
                  >
                    {regAvatar ? (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
                        <img src={regAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}

                    <div className="text-xs">
                      {regAvatar ? (
                        <span className="text-purple-300 font-bold hover:underline">{t('auth.change_photo')}</span>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-white font-semibold">{t('auth.choose_from_gallery')}</p>
                          <p className="text-[11px] text-slate-400">{t('auth.file_size_hint')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.username_name_label')}</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Jasur Otaku"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.create_password_label')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.confirm_password_label')}</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30"
                >
                  {loading ? 'Yaratilmoqda...' : 'Hisob Yaratish & Kirish'}
                </button>
              </form>
            )}
          </>
        )}

        {/* TAB 2: LOGIN FLOW */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] mb-2">
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  loginMethod === 'password' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Parol Orqali
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); setLoginOtpStep(1); setError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  loginMethod === 'otp' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                OTP Kodi Orqali
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {type === 'phone' ? 'Telefon Raqami' : 'Email Manzil'}
              </label>
              <div className="relative">
                {type === 'phone' ? (
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                ) : (
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                )}
                <input
                  type={type === 'phone' ? 'text' : 'email'}
                  required
                  value={type === 'phone' ? phone : email}
                  onChange={(e) => type === 'phone' ? setPhone(e.target.value) : setEmail(e.target.value)}
                  placeholder={type === 'phone' ? '+998 90 123 45 67' : 'admin@anisenpaiuz.uz'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {loginMethod === 'password' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">{t('auth.your_password_label')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {loginMethod === 'otp' && loginOtpStep === 2 && (
              <div className="space-y-2 text-center">
                <p className="text-xs text-slate-400 mb-2">{t('auth.sms_code_hint')}</p>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  className="w-40 mx-auto text-center font-mono text-2xl tracking-[0.4em] bg-slate-950 border-2 border-purple-500 rounded-2xl py-2 text-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30"
            >
              <span>
                {loading
                  ? 'Kutilmoqda...'
                  : loginMethod === 'otp' && loginOtpStep === 1
                  ? 'Kod Yuborish'
                  : 'Tizimga Kirish'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Google Login Footer */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 4.3 1.9 6.7l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            Google orqali tezkor kirish
          </button>
        </div>

      </div>
    </div>
  );
};
