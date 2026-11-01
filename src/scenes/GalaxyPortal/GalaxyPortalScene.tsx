import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Stars } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { birthdayConfig } from '@/config/birthday.config';

export function GalaxyPortalScene() {
  const enterPortal = useExperienceStore((state) => state.enterPortal);
  const setMusicPlaying = useExperienceStore((state) => state.setMusicPlaying);
  const [isWarping, setIsWarping] = useState(false);

  const handleEnter = () => {
    setIsWarping(true);
    audioManager.playPortalSfx();
    setMusicPlaying(true);

    setTimeout(() => {
      enterPortal();
    }, 1100);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-10 text-center select-none overflow-hidden">
      {/* Warp Speed Zoom Overlay */}
      {isWarping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 2.5 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(109,74,255,0.7)_40%,_rgba(7,8,23,1)_100%)]"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-purple-500/40 text-purple-300 text-xs sm:text-sm font-medium tracking-wide">
          <Stars className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{birthdayConfig.hero.badge}</span>
        </div>

        {/* Cinematic Pre-title */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light italic tracking-wider">
          “{birthdayConfig.hero.preTitle}”
        </p>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
          {birthdayConfig.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {birthdayConfig.hero.subtitle}
        </p>

        {/* Recipient highlight tag */}
        <div className="pt-2">
          <span className="inline-block px-5 py-2 rounded-2xl glass-panel-glow text-yellow-300 font-semibold text-base sm:text-lg tracking-wider border-yellow-400/30 text-glow-gold">
            ✦ Dành tặng: {birthdayConfig.recipientName} {birthdayConfig.recipientNickname ? `(${birthdayConfig.recipientNickname})` : ''} ✦
          </span>
        </div>

        {/* Enter Universe Button */}
        <div className="pt-8 flex flex-col items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            disabled={isWarping}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-sm sm:text-base tracking-widest uppercase shadow-xl glow-purple hover:glow-pink transition-all duration-300 flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>{birthdayConfig.hero.ctaText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>

          <p className="text-[11px] text-slate-400 tracking-wider">
            {birthdayConfig.music.autoPlayPrompt}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
