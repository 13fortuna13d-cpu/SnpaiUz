import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, CornerDownRight, Flag, Trash2, Send, Smile, ShieldAlert } from 'lucide-react';
import { Comment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAnime } from '../context/AnimeContext';

interface CommentSectionProps {
  animeId: string;
  episodeId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ animeId, episodeId }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { comments, addComment, likeComment, reportComment, deleteCommentAdmin } = useAnime();

  const [inputContent, setInputContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [reportModalCommentId, setReportModalCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const animeComments = (comments[animeId] || []).filter(c => !episodeId || c.episodeId === episodeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;
    addComment(animeId, inputContent, episodeId);
    setInputContent('');
  };

  const handleSendReport = () => {
    if (!reportModalCommentId || !reportReason.trim()) return;
    reportComment(reportModalCommentId, animeId, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalCommentId(null);
      setReportReason('');
      setReportSubmitted(false);
    }, 1500);
  };

  const emojis = ['🔥', '❤️', '👏', '😮', '😂', '😭', '🤯', '💯'];

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          {t('comments.title')} ({animeComments.length})
        </h3>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder={t('comments.placeholder')}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-all resize-none"
          />
          {/* Quick Emoji Bar */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {emojis.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setInputContent(prev => prev + e)}
                className="hover:scale-125 transition-transform text-sm"
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {user ? `${user.name} sifatida yozilmoqda` : 'Izoh qoldirish uchun tizimga kiring'}
          </span>
          <button
            type="submit"
            disabled={!inputContent.trim()}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            {t('comments.send')}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        {animeComments.length === 0 ? (
          <p className="text-center py-8 text-slate-500 text-sm">{t('comments.no_comments')}</p>
        ) : (
          animeComments.map(comment => (
            <div key={comment.id} className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 space-y-3">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={comment.userAvatar} alt={comment.userName} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{comment.userName}</span>
                      {comment.userBadge === 'Admin' && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                          Admin
                        </span>
                      )}
                      {comment.userBadge === 'VIP' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          ✨ VIP
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500 text-[11px]">{comment.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <button
                    onClick={() => reportComment(comment.id, animeId, 'Inappropriate content')}
                    title={t('comments.report')}
                    className="p-1 hover:text-red-400 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => deleteCommentAdmin(comment.id, animeId)}
                      title={t('comments.delete')}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <button
                  onClick={() => likeComment(comment.id, animeId)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    comment.userLiked ? 'text-purple-400 font-bold' : 'hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>{t('comments.reply')}</span>
                </button>
              </div>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 pl-4 border-l-2 border-purple-900/40 space-y-3 pt-2">
                  {comment.replies.map(rep => (
                    <div key={rep.id} className="bg-slate-900/80 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{rep.userName}</span>
                        {rep.userBadge === 'Admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                            Admin
                          </span>
                        )}
                        <span className="text-slate-500 text-[10px]">{rep.createdAt}</span>
                      </div>
                      <p className="text-slate-300 text-xs">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
