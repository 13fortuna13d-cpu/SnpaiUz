import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAnime } from '../context/AnimeContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface VoiceSearchModalProps {
  onClose: () => void;
  onNavigateCatalog: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose, onNavigateCatalog }) => {
  useLockBodyScroll();
  const { t, language } = useLanguage();
  const { setSearchQuery } = useAnime();

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'uz-UZ';

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    } else {
      // Simulation for unsupported browsers
      const phrases = ['Solo Leveling', 'Demon Slayer', 'Naruto', 'One Piece'];
      const random = phrases[Math.floor(Math.random() * phrases.length)];
      const timer = setTimeout(() => {
        setTranscript(random);
        setIsListening(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleApply = () => {
    if (transcript) {
      setSearchQuery(transcript);
      onNavigateCatalog();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white">{t('search.voice')}</h3>

        <div className="relative flex items-center justify-center py-6">
          <div className={`w-24 h-24 rounded-full border-2 border-purple-500/40 flex items-center justify-center ${
            isListening ? 'animate-ping bg-purple-600/20' : 'bg-slate-950'
          }`}>
            <Mic className={`w-10 h-10 ${isListening ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-purple-300 font-semibold">
            {isListening ? t('search.listening') : (language === 'uz' ? 'Eshitildi:' : language === 'ru' ? 'Распознано:' : 'Heard:')}
          </p>
          <p className="text-lg font-black text-white min-h-[32px]">
            {transcript || '...'}
          </p>
        </div>

        {!isListening && transcript && (
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all"
          >
            {language === 'uz' ? 'Natijalarni izlash' : language === 'ru' ? 'Искать результаты' : 'Search results'}
          </button>
        )}

      </div>
    </div>
  );
};
