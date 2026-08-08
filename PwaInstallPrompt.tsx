import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PwaInstallPrompt: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(t('pwa.install_manual_hint'));
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm bg-slate-900/95 border border-purple-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-white text-xs">{t('pwa.install_title')}</h4>
          <p className="text-[11px] text-slate-400">{t('pwa.install_desc')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-purple-600/30"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('pwa.install_btn')}</span>
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
