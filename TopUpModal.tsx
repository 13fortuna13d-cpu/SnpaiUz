import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface TopUpModalProps {
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ onClose }) => {
  useLockBodyScroll();
  const { t } = useLanguage();
  const { user, topUpBalance } = useAuth();

  const [provider, setProvider] = useState<'click' | 'payme' | 'card'>('click');
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const presetAmounts = [20000, 50000, 100000, 250000, 500000, 1000000];

  const handlePay = () => {
    const amount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!amount || amount < 1000) return;

    setIsProcessing(true);
    setTimeout(() => {
      topUpBalance(amount, provider);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">{t('topup.title')}</h2>
              <p className="text-slate-400 text-xs">
                Joriy Balansingiz: <span className="text-purple-300 font-bold">{user?.balanceUZS.toLocaleString()} so'm</span>
              </p>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 block">{t('topup.payment_system')}</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('click')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    provider === 'click'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-black text-sm tracking-wider">CLICK</span>
                  <span className="text-[10px] text-cyan-400">{t('topup.instant_uzs')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('payme')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    provider === 'payme'
                      ? 'bg-cyan-950/40 border-teal-500 text-teal-300 ring-2 ring-teal-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-black text-sm tracking-wider">Payme</span>
                  <span className="text-[10px] text-teal-400">{t('topup.payme_go')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    provider === 'card'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300 ring-2 ring-purple-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-[11px]">{t('topup.uzcard_humo')}</span>
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 block">{t('topup.choose_amount')}</label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {amt.toLocaleString()} so'm
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="pt-2">
                <input
                  type="number"
                  placeholder="Boshqa summa kiritish (Masalan: 150000)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Security Note */}
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('topup.ssl_notice')}</span>
            </div>

            {/* Pay Action Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all"
            >
              {isProcessing ? (
                <span>{t('topup.processing')}</span>
              ) : (
                <>
                  <span>
                    {(customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount).toLocaleString()} so'm To'lash
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">{t('topup.success')}</h3>
            <p className="text-xs text-slate-300">
              Balansingizga <span className="text-emerald-400 font-bold">{(customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount).toLocaleString()} so'm</span> qo'shildi.
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
              Yangi Balans: <span className="text-purple-300 font-bold">{user?.balanceUZS.toLocaleString()} so'm</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs"
            >
              Yopish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
