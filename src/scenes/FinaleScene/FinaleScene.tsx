import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Heart, Stars, Share2 } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { triggerStarShower } from '@/components/effects/ConfettiBurst';
import { audioManager } from '@/utils/audioManager';
import { birthdayConfig } from '@/config/birthday.config';

export function FinaleScene() {
  const resetExperience = useExperienceStore((state) => state.resetExperience);

  useEffect(() => {
    // Trigger celebratory star shower on mounting
    triggerStarShower();
  }, []);

  const handleRestart = () => {
    audioManager.playPortalSfx();
    resetExperience();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết vũ trụ sinh nhật!');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-16 pb-28 z-10 select-none text-center">
      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto space-y-2"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-pink-500/20 text-yellow-300 border border-yellow-400/40 glow-gold">
          <Stars className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '5s' }} />
          KHÉP LẠI HÀNH TRÌNH VŨ TRỤ
        </span>
      </motion.div>

      {/* Center Grand Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="max-w-2xl mx-auto my-auto glass-panel-glow p-8 sm:p-12 rounded-3xl border-yellow-400/40 shadow-2xl space-y-6"
      >
        <p className="text-sm sm:text-base md:text-lg text-yellow-200 font-light italic leading-relaxed">
          {birthdayConfig.finale.quote}
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent text-glow-gold">
          {birthdayConfig.finale.heading}
        </h1>

        <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          {birthdayConfig.finale.subheading}
        </p>

        {/* Highlight Card for Recipient */}
        <div className="pt-2">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-xl">
            <div className="bg-slate-950 px-6 py-3 rounded-[14px] flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500 fill-current animate-pulse" />
              <span className="font-heading font-bold text-sm sm:text-base text-white tracking-wider">
                MÃI LÀ NHỮNG NGƯỜI BẠN TỐT NHẤT!
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <button
          onClick={handleRestart}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs sm:text-sm tracking-widest uppercase shadow-xl glow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{birthdayConfig.finale.replayButtonText}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="px-6 py-3.5 rounded-full glass-panel text-slate-300 hover:text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>Chia sẻ món quà</span>
        </button>
      </div>
    </div>
  );
}
