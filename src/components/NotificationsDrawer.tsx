import React from 'react';
import { X, Bell, Check, Trash2, Film, Wallet, Crown, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NotificationsDrawerProps {
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onClose, onNavigate }) => {
  const { t } = useLanguage();
  const { user, markNotificationRead, clearAllNotifications } = useAuth();

  const { language } = useLanguage();

  if (!user) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'episode':
        return <Film className="w-4 h-4 text-purple-400" />;
      case 'balance':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'vip':
        return <Crown className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>{language === 'uz' ? 'Bildirishnomalar' : language === 'ru' ? 'Уведомления' : 'Notifications'}</span>
            </h3>
            <div className="flex items-center gap-2">
              {user.notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title={language === 'uz' ? 'Tozalash' : language === 'ru' ? 'Очистить' : 'Clear all'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="mt-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-1">
            {user.notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-700" />
                <p>{language === 'uz' ? 'Bildirishnomalar yo\'q' : language === 'ru' ? 'Уведомлений нет' : 'No notifications'}</p>
              </div>
            ) : (
              user.notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.link) {
                      onNavigate('anime', { slug: n.link });
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    n.read
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      : 'bg-slate-950 border-purple-500/40 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-white text-xs truncate">{n.title}</h4>
                        <span className="text-[9px] text-slate-500 shrink-0">{n.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
