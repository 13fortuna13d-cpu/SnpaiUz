import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Check, Send, X, QrCode } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  title: string;
  url?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ title, url = window.location.href, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate simple QR Code pattern on canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 160, 160);
        ctx.fillStyle = '#a855f7';
        // Draw grid simulation
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 16; j++) {
            if ((i + j) % 3 === 0 || (i * j) % 5 === 0) {
              ctx.fillRect(i * 10, j * 10, 8, 8);
            }
          }
        }
      }
    }
  }, [url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - SnpaiUz Anime Platformasida tomosha qiling!')}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' on SnpaiUz')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white">{t('common.share')}</h3>
        <p className="text-slate-400 text-xs line-clamp-1">{title}</p>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 w-44 mx-auto space-y-2">
          <canvas ref={canvasRef} width={160} height={160} className="rounded-lg" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">{t('common.qr_code')}</span>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-sky-600/20 border border-sky-500/40 text-sky-300 hover:bg-sky-600/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Twitter / X</span>
          </a>
        </div>

        {/* Copy Link */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 pl-3">
          <span className="text-xs text-slate-400 truncate flex-1 text-left">{url}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('common.copied') : t('common.copy_link')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
