import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Wind, RotateCcw, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerBirthdayConfetti } from '@/components/effects/ConfettiBurst';
import { birthdayConfig } from '@/config/birthday.config';

export function BirthdayScene() {
  const candleBlown = useExperienceStore((state) => state.candleBlown);
  const setCandleBlown = useExperienceStore((state) => state.setCandleBlown);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const handleBlowCandle = () => {
    audioManager.playBlowCandleSfx();
    triggerBirthdayConfetti();
    setCandleBlown(true);
  };

  const handleRelight = () => {
    audioManager.playButtonSfx();
    setCandleBlown(false);
  };

  const handleContinue = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-16 pb-28 z-10 select-none pointer-events-none">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-2 pointer-events-auto"
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
          ✦ VŨ TRỤ SINH NHẬT ✦
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
          {birthdayConfig.cake.heading}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          {birthdayConfig.cake.subtitle}
        </p>
      </motion.div>

      {/* Middle Spacer for 3D Cake (Interactive Canvas in background) */}
      <div className="flex-1 w-full flex items-center justify-center my-4 pointer-events-none">
        <p className="text-[11px] text-slate-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
          {candleBlown ? "✨ Nến đã được thổi tắt trọn vẹn!" : "💡 Chạm trực tiếp vào bánh kem hoặc nến để tương tác xoay 3D"}
        </p>
      </div>

      {/* Bottom Interactive Control Panel */}
      <div className="w-full max-w-lg mx-auto pointer-events-auto space-y-4">
        <AnimatePresence mode="wait">
          {!candleBlown ? (
            <motion.div
              key="unblown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel-glow rounded-3xl p-5 text-center space-y-3"
            >
              <p className="text-xs sm:text-sm text-yellow-200 font-medium italic">
                {birthdayConfig.cake.candleWish}
              </p>

              <button
                onClick={handleBlowCandle}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wind className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span>{birthdayConfig.cake.blowButtonText}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="blown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel-glow rounded-3xl p-5 text-center space-y-4 border-yellow-400/40"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold text-base font-heading">
                <Sparkles className="w-5 h-5" />
                <span>ĐIỀU ƯỚC ĐÃ ĐƯỢC GỬI ĐI!</span>
                <Sparkles className="w-5 h-5" />
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {birthdayConfig.cake.afterBlowMessage}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleRelight}
                  className="flex-1 py-2.5 px-4 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{birthdayConfig.cake.relightButtonText}</span>
                </button>

                <button
                  onClick={handleContinue}
                  className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg glow-blue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Khám phá album ảnh</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
