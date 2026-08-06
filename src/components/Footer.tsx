import React from 'react';
import { Play, Send, Instagram, Youtube, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-purple-950/60 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400/30" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                Snpai<span className="text-purple-400">Uz</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/SnpaiUz"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all"
                title="Discord"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-purple-300">
              {t('footer.nav_title')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-purple-400 transition-colors">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-purple-400 transition-colors">
                  {t('nav.catalog')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { filter: 'top' })} className="hover:text-purple-400 transition-colors">
                  {t('nav.top')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vip')} className="text-amber-400 hover:underline transition-colors font-semibold">
                  ✨ {t('nav.vip')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-purple-300">
              {t('footer.docs_title')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'dmca' })} className="hover:text-purple-400 transition-colors">
                  {t('footer.dmca')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'privacy' })} className="hover:text-purple-400 transition-colors">
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'terms' })} className="hover:text-purple-400 transition-colors">
                  {t('footer.terms')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'faq' })} className="hover:text-purple-400 transition-colors">
                  {t('footer.faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-purple-300">
              {t('footer.contact_title')}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {t('footer.contact_sub')}
            </p>
            <p className="text-xs font-semibold text-purple-300 mb-2">support@snpaiuz.com</p>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Google Search & DMCA verified platform</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SnpaiUz. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">● {t('common.online')}</span>
            <span>Version 2.4 Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
