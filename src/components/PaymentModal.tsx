import React, { useState } from 'react';
import { Crown, Check, X, ShieldCheck, Sparkles, CreditCard, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface PaymentModalProps {
  onClose: () => void;
}

type PlanKey = 'monthly' | 'quarterly' | 'nineMonths' | 'yearly';

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { upgradeVip } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('yearly');
  const [paymentGateway, setPaymentGateway] = useState<'click' | 'payme' | 'stripe' | 'paypal'>('click');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans: Record<PlanKey, { months: number; priceUZS: string; priceUSD: string; label: string; badge?: string }> = {
    monthly: { months: 1, priceUZS: '15,000 UZS', priceUSD: '$1.20', label: '1 Oylik VIP' },
    quarterly: { months: 3, priceUZS: '35,000 UZS', priceUSD: '$2.80', label: '3 Oylik VIP', badge: '10,000 UZS tejam' },
    nineMonths: { months: 9, priceUZS: '120,000 UZS', priceUSD: '$9.50', label: '9 Oylik VIP', badge: 'Tejamkor' },
    yearly: { months: 12, priceUZS: '150,000 UZS', priceUSD: '$12.00', label: '1 Yillik VIP', badge: 'Eng Mashhur (30k tejam)' }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      upgradeVip(plans[selectedPlan].months);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-10"
          title="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>AniSenpaiUz Premium VIP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t('vip.title')}</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">{t('vip.subtitle')}</p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">VIP A'zolik Muvaffaqiyatli Aktivlashtirildi!</h3>
            <p className="text-xs text-slate-400">Rahmat! Endi siz barcha 3+ qismlar va HD videolarni cheklovsiz tomosha qilishingiz mumkin.</p>
          </div>
        ) : (
          <>
            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Barcha (3+ qismlar va yangi fasllar) ochiq</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Reklamalarsiz ultra silliq tomosha</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Full HD 1080p va Ultra HD 4K sifat</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>O'zbekcha professional eksklyuziv dublyaj</span>
              </div>
            </div>

            {/* Tariff Plans */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                VIP Tarifini tanlang:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['monthly', 'quarterly', 'nineMonths', 'yearly'] as const).map((pKey) => {
                  const plan = plans[pKey];
                  const active = selectedPlan === pKey;
                  return (
                    <div
                      key={pKey}
                      onClick={() => setSelectedPlan(pKey)}
                      className={`relative p-3 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                        active
                          ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase whitespace-nowrap shadow-sm">
                          {plan.badge}
                        </span>
                      )}
                      <p className="font-bold text-white text-xs pt-1">{plan.label}</p>
                      <p className="font-extrabold text-amber-400 text-sm sm:text-base">{plan.priceUZS}</p>
                      <p className="text-[10px] text-slate-500">{plan.priceUSD}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Gateway Options */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                To'lov tizimini tanlang:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentGateway('click')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentGateway === 'click'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Click.uz</span>
                  <span className="text-[10px] text-blue-400">O'zbekiston</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('payme')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentGateway === 'payme'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Payme</span>
                  <span className="text-[10px] text-cyan-400">O'zbekiston</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('stripe')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentGateway === 'stripe'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Visa / Card</span>
                  <span className="text-[10px] text-purple-400">Xalqaro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('paypal')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentGateway === 'paypal'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>PayPal</span>
                  <span className="text-[10px] text-indigo-400">Global</span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Crown className="w-5 h-5 fill-slate-950" />
              <span>{isProcessing ? 'Ishlanmoqda...' : `${plans[selectedPlan].priceUZS} — ${t('vip.subscribe_now')}`}</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};

