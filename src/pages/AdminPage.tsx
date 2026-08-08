import React, { useState } from 'react';
import { 
  Send, Globe, Check, Heart, Crown, Eye, Edit, Trash2 
} from 'lucide-react';

interface Supporter {
  id: string;
  nickname: string;
  avatarUrl?: string;
  isVip?: boolean;
  visible?: boolean;
  displayOrder?: number;
  date?: string;
}

export const AdminSettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'social' | 'supporters'>('social');

  // Social Links & Banner States
  const [showBanner, setShowBanner] = useState(true);
  const [bannerTitle, setBannerTitle] = useState('Telegram kanalimizga obuna bo\'ling!');
  const [bannerDesc, setBannerDesc] = useState('E\'lonlar va yangiliklardan xabardor bo\'ling.');
  const [tgUsername, setTgUsername] = useState('senpaiuz');
  const [tgUrl, setTgUrl] = useState('https://t.me/senpaiuz');
  const [supportEmail, setSupportEmail] = useState('support@senpai.uz');
  const [supportPhone, setSupportPhone] = useState('+998901234567');
  const [discordUrl, setDiscordUrl] = useState('');
  const [instaUrl, setInstaUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');

  // Supporters States
  const [supporters, setSupporters] = useState<Supporter[]>([
    {
      id: 'supp-1',
      nickname: 'NarutoUz',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVip: true,
      visible: true,
      displayOrder: 1,
      date: '2026-08-01'
    }
  ]);
  const [editingSuppId, setEditingSuppId] = useState<string | null>(null);
  const [suppNickname, setSuppNickname] = useState('');
  const [suppAvatar, setSuppAvatar] = useState('');
  const [suppIsVip, setSuppIsVip] = useState(false);
  const [suppVisible, setSuppVisible] = useState(true);
  const [suppDisplayOrder, setSuppDisplayOrder] = useState(1);
  const [suppDate, setSuppDate] = useState(new Date().toISOString().split('T')[0]);
  const [suppSearch, setSuppSearch] = useState('');
  const [suppSortBy, setSuppSortBy] = useState<'order' | 'nickname' | 'date'>('order');

  // Supporter Actions
  const addSupporter = (newSupp: Supporter) => {
    setSupporters((prev) => [...prev, newSupp]);
  };

  const updateSupporter = (updatedSupp: Supporter) => {
    setSupporters((prev) =>
      prev.map((s) => (s.id === updatedSupp.id ? updatedSupp : s))
    );
  };

  const deleteSupporter = (id: string) => {
    setSupporters((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sozlamalar muvaffaqiyatli saqlandi!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all ${
            activeTab === 'social'
              ? 'bg-slate-800 text-sky-400 border-t-2 border-sky-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ijtimoiy Tarmoqlar
        </button>
        <button
          onClick={() => setActiveTab('supporters')}
          className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all ${
            activeTab === 'supporters'
              ? 'bg-slate-800 text-pink-400 border-t-2 border-pink-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Homiylar (Supporters)
        </button>
      </div>

      {/* TAB 1: SOCIAL LINKS & BANNER SETTINGS */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <form onSubmit={handleSocialSubmit} className="space-y-6">
            {/* Banner Toggle & Banner Text Section */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-sky-400" />
                  <h4 className="font-bold text-white text-sm">Telegram Obuna Banneri Sozlamalari</h4>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-400 font-bold">{showBanner ? 'Banner Ko\'rinadi' : 'Banner Yashiringan'}</span>
                  <input
                    type="checkbox"
                    checked={showBanner}
                    onChange={(e) => setShowBanner(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Banner Sarlavhasi:</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Banner Matni (Tavsif):</label>
                  <textarea
                    rows={2}
                    value={bannerDesc}
                    onChange={(e) => setBannerDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Social Links & Support Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> Telegram & Murojaat
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Telegram Username</label>
                  <input
                    type="text"
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Telegram URL</label>
                  <input
                    type="url"
                    value={tgUrl}
                    onChange={(e) => setTgUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Qo'llab-quvvatlash E-mail</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Telefon Nomer</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-purple-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Boshqa Ijtimoiy Tarmoqlar
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Discord URL</label>
                  <input
                    type="url"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={instaUrl}
                    onChange={(e) => setInstaUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Veb-sayt URL</label>
                  <input
                    type="url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Sozlamalarni Saqlash
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: SUPPORTERS MANAGEMENT */}
      {activeTab === 'supporters' && (
        <div className="space-y-8">
          {/* Add / Edit Supporter Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!suppNickname.trim()) return;

              if (editingSuppId) {
                updateSupporter({
                  id: editingSuppId,
                  nickname: suppNickname,
                  avatarUrl: suppAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  isVip: suppIsVip,
                  visible: suppVisible,
                  displayOrder: Number(suppDisplayOrder),
                  date: suppDate
                });
                alert('Homiylik ma\'lumotlari yangilandi!');
                setEditingSuppId(null);
              } else {
                addSupporter({
                  id: 'supp-' + Date.now(),
                  nickname: suppNickname,
                  avatarUrl: suppAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  isVip: suppIsVip,
                  visible: suppVisible,
                  displayOrder: Number(suppDisplayOrder),
                  date: suppDate || new Date().toISOString().split('T')[0]
                });
                alert('Yangi homiy ro\'yxatga qo\'shildi!');
              }

              // Reset Form
              setSuppNickname('');
              setSuppAvatar('');
              setSuppIsVip(false);
              setSuppVisible(true);
              setSuppDisplayOrder(supporters.length + 1);
            }}
            className="bg-slate-900/80 p-6 rounded-3xl border border-pink-500/30 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400/20" />
                {editingSuppId ? "Homiy Ma'lumotlarini Tahrirlash" : "Yangi Homiy / Supporter Qo'shish"}
              </h3>
              {editingSuppId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSuppId(null);
                    setSuppNickname('');
                    setSuppAvatar('');
                    setSuppIsVip(false);
                    setSuppVisible(true);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nikneym / Ismi"
                required
                value={suppNickname}
                onChange={(e) => setSuppNickname(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="url"
                placeholder="Avatar URL"
                value={suppAvatar}
                onChange={(e) => setSuppAvatar(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="date"
                value={suppDate}
                onChange={(e) => setSuppDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <input
                type="number"
                placeholder="Tartib raqami"
                value={suppDisplayOrder}
                onChange={(e) => setSuppDisplayOrder(Number(e.target.value))}
                className="w-32 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
              />

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-300">
                <input
                  type="checkbox"
                  checked={suppIsVip}
                  onChange={(e) => setSuppIsVip(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                />
                <Crown className="w-4 h-4 text-amber-400" />
                <span>VIP Homiy Status</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400">
                <input
                  type="checkbox"
                  checked={suppVisible}
                  onChange={(e) => setSuppVisible(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                />
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Saytda Ko'rinsin</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30"
            >
              {editingSuppId ? "Saqlash va Yangilash" : "Homiyni Saqlash"}
            </button>
          </form>

          {/* Supporters Search & Filter Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span>Homiylar Ro'yxati ({supporters.length})</span>
              </h3>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={suppSearch}
                  onChange={(e) => setSuppSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <select
                  value={suppSortBy}
                  onChange={(e) => setSuppSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                >
                  <option value="order">Tartib bo'yicha</option>
                  <option value="nickname">Ism bo'yicha</option>
                  <option value="date">Sana bo'yicha</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3"># Tartib</th>
                    <th className="p-3">Avatar & Nikneym</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Sana</th>
                    <th className="p-3">Ko'rinishi</th>
                    <th className="p-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {supporters
                    .filter(s => s.nickname.toLowerCase().includes(suppSearch.toLowerCase()))
                    .sort((a, b) => {
                      if (suppSortBy === 'nickname') return a.nickname.localeCompare(b.nickname);
                      if (suppSortBy === 'date') return (b.date || '').localeCompare(a.date || '');
                      return (a.displayOrder || 0) - (b.displayOrder || 0);
                    })
                    .map((supp) => (
                      <tr key={supp.id} className="hover:bg-slate-950/40">
                        <td className="p-3 font-mono font-bold text-slate-400">#{supp.displayOrder || 1}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={supp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={supp.nickname}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <span className="font-bold text-white">{supp.nickname}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {supp.isVip ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] flex items-center gap-1 w-max">
                              <Crown className="w-3 h-3" /> VIP Homiy
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">Oddiy</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{supp.date || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            supp.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {supp.visible ? 'Faol' : 'Yashirin'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSuppId(supp.id);
                              setSuppNickname(supp.nickname);
                              setSuppAvatar(supp.avatarUrl || '');
                              setSuppIsVip(!!supp.isVip);
                              setSuppVisible(supp.visible ?? true);
                              setSuppDisplayOrder(supp.displayOrder || 1);
                              setSuppDate(supp.date || new Date().toISOString().split('T')[0]);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                            title="Tahrirlash"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`"${supp.nickname}" homiysini o'chirmoqchimisiz?`)) {
                                deleteSupporter(supp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPanel;
