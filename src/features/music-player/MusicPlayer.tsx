import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { birthdayConfig } from '@/config/birthday.config';

export function MusicPlayer() {
  const musicPlaying = useExperienceStore((state) => state.musicPlaying);
  const musicVolume = useExperienceStore((state) => state.musicVolume);
  const musicMuted = useExperienceStore((state) => state.musicMuted);
  const toggleMusic = useExperienceStore((state) => state.toggleMusic);
  const setMusicVolume = useExperienceStore((state) => state.setMusicVolume);
  const toggleMute = useExperienceStore((state) => state.toggleMute);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (musicPlaying) {
      audioManager.startBackgroundMusic(birthdayConfig.music.source);
    } else {
      audioManager.pauseBackgroundMusic();
    }
  }, [musicPlaying]);

  useEffect(() => {
    audioManager.setVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    audioManager.setMuted(musicMuted);
  }, [musicMuted]);

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <div className={`glass-dock px-3 py-2 rounded-full flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'max-w-xs' : 'max-w-[190px]'}`}>
        {/* Play / Pause Toggle Button */}
        <button
          onClick={toggleMusic}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
          title={musicPlaying ? "Tạm dừng nhạc" : "Phát nhạc nền"}
          aria-label={musicPlaying ? "Tạm dừng nhạc" : "Phát nhạc nền"}
        >
          {musicPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Audio Equalizer Visualizer Bars */}
        <div className="flex items-end gap-0.5 h-4 w-6">
          <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-200 ${musicPlaying && !musicMuted ? 'h-4 animate-pulse' : 'h-1.5 opacity-40'}`} />
          <span className={`w-1 bg-pink-400 rounded-full transition-all duration-200 ${musicPlaying && !musicMuted ? 'h-3 animate-bounce' : 'h-2 opacity-40'}`} />
          <span className={`w-1 bg-purple-400 rounded-full transition-all duration-200 ${musicPlaying && !musicMuted ? 'h-4.5 animate-pulse' : 'h-1.5 opacity-40'}`} />
          <span className={`w-1 bg-yellow-400 rounded-full transition-all duration-200 ${musicPlaying && !musicMuted ? 'h-2.5 animate-bounce' : 'h-1 opacity-40'}`} />
        </div>

        {/* Track Title Info */}
        <div className="hidden sm:flex flex-col overflow-hidden max-w-[140px]">
          <span className="text-[10px] font-medium text-slate-200 truncate font-heading">
            {birthdayConfig.music.trackName}
          </span>
          <span className="text-[9px] text-slate-400 truncate">
            {musicPlaying ? "Đang phát" : "Tạm dừng"}
          </span>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="text-slate-300 hover:text-white transition-colors p-1"
          title={musicMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {musicMuted || musicVolume === 0 ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Expand / Volume Slider Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-200 text-xs hidden sm:block"
          title="Điều chỉnh âm lượng"
        >
          <Music className="w-3.5 h-3.5" />
        </button>

        {isExpanded && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicMuted ? 0 : musicVolume}
            onChange={(e) => {
              if (musicMuted) toggleMute();
              setMusicVolume(parseFloat(e.target.value));
            }}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            aria-label="Âm lượng nhạc"
          />
        )}
      </div>
    </div>
  );
}

