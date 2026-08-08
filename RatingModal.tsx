import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAnime } from '../context/AnimeContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface RatingModalProps {
  animeId: string;
  animeTitle: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ animeId, animeTitle, onClose }) => {
  useLockBodyScroll();
  const { t } = useLanguage();
  const { rateAnime } = useAnime();

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (star: number) => {
    setSelectedStar(star);
    rateAnime(animeId, star);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white">{animeTitle}</h3>
        <p className="text-slate-400 text-xs">{t('anime.rate_this')} (1 - 5)</p>

        {submitted ? (
          <div className="py-6 space-y-2">
            <span className="text-3xl">🌟</span>
            <p className="font-bold text-purple-300 text-sm">{t('rating.thanks')}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleRate(star)}
                className="p-1 transition-transform hover:scale-125"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoveredStar || selectedStar) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
