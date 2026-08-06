import React, { useState } from 'react';
import { ShieldCheck, Mail, HelpCircle, FileText, Send, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SeoHead } from '../components/SeoHead';

interface LegalPageProps {
  tab?: 'dmca' | 'privacy' | 'terms' | 'faq' | 'about' | 'contact';
}

export const LegalPage: React.FC<LegalPageProps> = ({ tab = 'dmca' }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(tab);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SeoHead title="SnpaiUz - Hujjatlar va Qo'llab-quvvatlash" />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {(['dmca', 'privacy', 'terms', 'faq', 'about', 'contact'] as const).map((tKey) => (
          <button
            key={tKey}
            onClick={() => setActiveTab(tKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              activeTab === tKey ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tKey}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed">
        
        {activeTab === 'dmca' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              DMCA Copyright Policy
            </h2>
            <p>
              SnpaiUz digital copyright qonunchiligiga to'liq rioya qiladi. Agar platformadagi biron-bir kontent mualliflik huquqingizni buzayotgan bo'lsa, legal@snpaiuz.com manziliga DMCA ariza yuborishingiz mumkin.
            </p>
            <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-cyan-300">
              Email: dmca@snpaiuz.com | Response Time: 24-48 hours.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Maxfiylik Siyosati (Privacy Policy)</h2>
            <p>
              SnpaiUz foydalanuvchilarning shaxsiy ma'lumotlari xavfsizligini ta'minlaydi. Biz parollarni shifrlangan holda saqlaymiz va uchinchi shaxslarga bermaymiz.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Foydalanish Shartlari (Terms of Service)</h2>
            <p>
              SnpaiUz xizmatlaridan foydalanish orqali siz platforma qoidalariga rozi bo'lasiz. Nojo'ya fikrlar bildirish va botlardan foydalanish taqiqlanadi.
            </p>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Ko'p beriladigan savollar (FAQ)</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white">VIP obuna qanday afzalliklarga ega?</p>
                <p className="text-slate-400 mt-1">Reklamasiz tomosha, 1080p sifat va eksklyuziv O'zbekcha dublyajlar.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white">Anime qanday yuklab olinadi?</p>
                <p className="text-slate-400 mt-1">SnpaiUz VIP a'zolari uchun oflayn yuklab olish tugmasi pleyer ostida mavjud.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Biz bilan bog'lanish</h2>
            {sent ? (
              <div className="p-4 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Ismingiz"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
                <input
                  type="email"
                  placeholder="Email pochtangiz"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
                <textarea
                  placeholder="Xabaringiz..."
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Yuborish
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
