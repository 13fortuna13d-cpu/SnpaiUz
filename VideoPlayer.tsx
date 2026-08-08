import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, 
  FastForward, SkipForward, PictureInPicture2, Repeat, ShieldAlert,
  Check, ListVideo, Sparkles, SlidersHorizontal, Lock, Crown
} from 'lucide-react';
import { Episode, Quality, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface VideoPlayerProps {
  episode: Episode;
  animeTitle: string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  onReportIssue?: () => void;
  animeId: string;
  onOpenVip?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  episode,
  animeTitle,
  onNextEpisode,
  onPrevEpisode,
  hasNext,
  hasPrev,
  onReportIssue,
  animeId,
  onOpenVip
}) => {
  const { t } = useLanguage();
  const { user, updateHistory } = useAuth();

  const isVipLocked = episode.number > 2 && !user?.isVip;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Settings
  const [quality, setQuality] = useState<Quality>('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoNext, setAutoNext] = useState(true);
  const [audioTrack, setAudioTrack] = useState<'uz_dub' | 'jp_orig'>('uz_dub');
  const [subtitleLang, setSubtitleLang] = useState<'off' | 'uz' | 'en' | 'ru'>('uz');

  // Menus
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Floating Mini Player State
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  // Watermark position for anti-screen recording
  const [watermarkPos, setWatermarkPos] = useState<{ top: string; left: string }>({ top: '15%', left: '15%' });

  // Controls auto-hide timeout
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Watermark position animation timer
  useEffect(() => {
    const positions = [
      { top: '15%', left: '15%' },
      { top: '20%', left: '60%' },
      { top: '65%', left: '20%' },
      { top: '70%', left: '65%' },
      { top: '45%', left: '40%' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % positions.length;
      setWatermarkPos(positions[idx]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard & anti-download protection listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText('');
      }
      // Block Ctrl+S / Cmd+S (Save page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      // Block Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    // Scroll observer for mini player
    const handleScroll = () => {
      if (!playerContainerRef.current) return;
      const rect = playerContainerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 && isPlaying) {
        setIsMiniPlayer(true);
      } else if (rect.bottom >= 0) {
        setIsMiniPlayer(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);

      // Save watch history every 10s
      if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
        updateHistory(
          animeId,
          episode.id,
          episode.number,
          Math.floor(videoRef.current.currentTime),
          Math.floor(videoRef.current.duration || 0)
        );
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (autoNext && onNextEpisode && hasNext) {
      onNextEpisode();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = episode.introEnd || currentTime + 90;
    }
  };

  const handleSkipOutro = () => {
    if (videoRef.current && episode.outroEnd) {
      videoRef.current.currentTime = episode.outroEnd;
    } else if (onNextEpisode && hasNext) {
      onNextEpisode();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const currentVideoSrc = (episode.qualityUrls && episode.qualityUrls[quality]) || episode.videoUrl;

  return (
    <div 
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative bg-slate-950 rounded-3xl overflow-hidden border border-purple-900/30 shadow-2xl group select-none transition-all ${
        isMiniPlayer
          ? 'fixed bottom-6 right-6 w-96 z-50 shadow-2xl border-purple-500 rounded-2xl'
          : 'w-full aspect-video'
      }`}
    >
      {/* Video Element with Anti-Download Controls */}
      <video
        ref={videoRef}
        src={currentVideoSrc}
        controlsList="nodownload noremoteplayback noPictureInPicture"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-full object-contain cursor-pointer"
        onClick={isVipLocked ? undefined : togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Dynamic Watermark for Anti-Screen-Recording */}
      <div 
        style={{ top: watermarkPos.top, left: watermarkPos.left }}
        className="absolute z-10 pointer-events-none transition-all duration-1000 ease-in-out px-2.5 py-1 rounded-md bg-slate-950/40 border border-white/10 text-slate-300/40 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-[1px]"
      >
        <span>AniSenpaiUz • {user?.name || 'Protected'} ({user?.id ? user.id.slice(0, 8) : 'guest'})</span>
      </div>

      {/* VIP Paywall Overlay for Episodes > 2 */}
      {isVipLocked && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 border border-amber-500/20">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-2xl shadow-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('player.vip_episode_badge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {episode.number}-qism va undan keyingilar VIP uchun!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              1 va 2-qismlar barcha uchun bepul. 3-qism va kelgusi barcha episodelarni tomosha qilish uchun VIP a'zolikka o'ting (oyiga 15,000 UZS).
            </p>
          </div>
          <button
            onClick={onOpenVip}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>{t('player.upgrade_vip_price')}</span>
          </button>
        </div>
      )}

      {/* Floating Header info */}
      <div className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-slate-950/90 to-transparent transition-opacity duration-300 z-20 flex items-center justify-between ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div>
          <h2 className="font-bold text-white text-sm sm:text-base">{animeTitle}</h2>
          <p className="text-purple-300 text-xs">{episode.title.uz}</p>
        </div>
        <button
          onClick={onReportIssue}
          className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('player.report_issue')}</span>
        </button>
      </div>

      {/* Skip Intro & Outro Overlay Buttons */}
      <div className="absolute top-16 left-6 z-20 flex items-center gap-2">
        {episode.introEnd && currentTime < episode.introEnd && (
          <button
            onClick={handleSkipIntro}
            className="px-4 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-500 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-transform active:scale-95"
          >
            <FastForward className="w-4 h-4" />
            {t('player.skip_intro')}
          </button>
        )}
      </div>

      {/* Big Play/Pause Center Indicator */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/30 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent transition-opacity duration-300 z-20 space-y-2 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* Timeline Progress Bar */}
        <div className="relative flex items-center group/timeline">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2.5 transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-slate-300 text-xs pt-1">
          
          {/* Left: Play, Prev/Next, Time, Volume */}
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-white transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {hasPrev && (
              <button onClick={onPrevEpisode} title={t('player.prev')} className="hover:text-white">
                <SkipForward className="w-4 h-4 rotate-180" />
              </button>
            )}

            {hasNext && (
              <button onClick={onNextEpisode} title={t('player.next')} className="hover:text-white">
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* Right: Audio track, Quality, Speed, Auto-next, PiP, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Dubbing Switch */}
            <button
              onClick={() => setAudioTrack(audioTrack === 'uz_dub' ? 'jp_orig' : 'uz_dub')}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                audioTrack === 'uz_dub'
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title={t('player.dub')}
            >
              🎙️ {audioTrack === 'uz_dub' ? 'UZ Dub' : 'JP Orig'}
            </button>

            {/* Quality Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-cyan-400 hover:border-cyan-500"
              >
                {quality}
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-slate-900/95 border border-slate-800 rounded-xl p-1 shadow-2xl z-50 text-xs w-24">
                  {(['1080p', '720p', '480p', 'Auto'] as Quality[]).map(q => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                        quality === q ? 'bg-purple-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{q}</span>
                      {quality === q && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Speed Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-slate-900/95 border border-slate-800 rounded-xl p-1 shadow-2xl z-50 text-xs w-24">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(sp => (
                    <button
                      key={sp}
                      onClick={() => {
                        setPlaybackSpeed(sp);
                        setShowSpeedMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                        playbackSpeed === sp ? 'bg-purple-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{sp}x</span>
                      {playbackSpeed === sp && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button onClick={togglePiP} title={t('player.pip')} className="hover:text-white">
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} title="Fullscreen" className="hover:text-white">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
