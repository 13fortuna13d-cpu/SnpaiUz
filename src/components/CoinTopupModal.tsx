import React, { useState, useEffect } from 'react';
import { X, Coins, Check, CreditCard, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useManga } from '../context/MangaContext';
import { CoinPackage } from '../types';

interface CoinTopupModalProps {
  onClose: () => void;
}

export const CoinTopupModal: React.FC<CoinTopupModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { coinPackages, buyCoinsPackage } = useManga();

  const [selectedPackage, setSelectedPackage] = useState<CoinPackage>(coinPackages[3] || coinPackages[0]);
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'payme' | 'card' | 'paynet'>('click');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      buyCoinsPackage(selectedPackage, paymentMethod);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-950/80 backdrop-blur-md flex items-center justify-center min-h-screen animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh] my-auto">
        
        {/* Glow decorative effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Coin Sotib Olish
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                  Hozirgi Balans: {user?.coins || 0} Coin
                </span>
              </h2>
              <p className="text-xs text-slate-400">Manga va premiumi boblarni blokdan chiqarish uchun tangalar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Xarid Muvaffaqiyatli Amalga Oshirildi!</h3>
              <p className="text-xs text-emerald-400 mt-1">
                +{selectedPackage.coins + (selectedPackage.bonusCoins || 0)} Coin hisobingizga qo'shildi.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Packages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {coinPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
                        Ommabop
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-base">
                      <Coins className="w-4 h-4" />
                      <span>{pkg.coins} Coin</span>
                    </div>

                    {pkg.bonusCoins ? (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-400">
                        +{pkg.bonusCoins} Bonus
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 text-[10px] text-slate-500">Standart</span>
                    )}

                    <div className="mt-2 text-xs font-bold text-white">
                      {pkg.priceUZS.toLocaleString()} so'm
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2.5">To'lov Tizimini Tanlang:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'click', label: 'Click', icon: Zap, color: 'text-sky-400 border-sky-500/30' },
                  { id: 'payme', label: 'Payme', icon: ShieldCheck, color: 'text-emerald-400 border-emerald-500/30' },
                  { id: 'paynet', label: 'Paynet', icon: CreditCard, color: 'text-red-400 border-red-500/30' },
                  { id: 'card', label: 'Uzcard / Humo', icon: Sparkles, color: 'text-purple-400 border-purple-500/30' }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold ${
                        active
                          ? 'bg-slate-800 border-amber-500 text-white ring-2 ring-amber-500/30 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${pm.color}`} />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Summary & Pay Button */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">Jami Olinadigan Coin:</p>
                <p className="text-sm font-black text-amber-400 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {selectedPackage.coins + (selectedPackage.bonusCoins || 0)} Tangalar
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={handlePurchase}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>To'lov Amalga Oshirilmoqda...</span>
                ) : (
                  <>
                    <span>{selectedPackage.priceUZS.toLocaleString()} so'm to'lash</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
