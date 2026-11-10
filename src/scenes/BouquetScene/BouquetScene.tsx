import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Sparkles, Wind, RotateCcw, ArrowRight, Orbit } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerGiftSparkles } from '@/components/effects/ConfettiBurst';
import { birthdayConfig } from '@/config/birthday.config';

export function BouquetScene() {
  const bouquetBloomed = useExperienceStore((state) => state.bouquetBloomed);
  const setBouquetBloomed = useExperienceStore((state) => state.setBouquetBloomed);
  const triggerPetalBurst = useExperienceStore((state) => state.triggerPetalBurst);
  const nextScene = useExperienceStore((state) => state.nextScene);

  // Automatically bloom the bouquet gracefully shortly after entering the scene
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!useExperienceStore.getState().bouquetBloomed) {
        setBouquetBloomed(true);
        audioManager.playChimeCelebration();
      }
    }, 550);
    return () => clearTimeout(timer);
  }, [setBouquetBloomed]);

  const handleToggleBloom = () => {
    const nextState = !bouquetBloomed;
    setBouquetBloomed(nextState);
    if (nextState) {
      audioManager.playChimeCelebration();
      triggerGiftSparkles();
      triggerPetalBurst();
    } else {
      audioManager.playButtonSfx();
    }
  };

  const handlePetalBurst = () => {
    audioManager.playGiftOpenSfx();
    triggerGiftSparkles();
    if (!bouquetBloomed) {
      setBouquetBloomed(true);
    }
    triggerPetalBurst();
  };

  const handleContinue = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-12 pb-26 z-10 select-none pointer-events-none">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-1.5 pointer-events-auto"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-200 border border-pink-400/35 shadow-lg">
          <Flower2 className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: '8s' }} />
          {birthdayConfig.bouquet.badge}
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
          {birthdayConfig.bouquet.title}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {birthdayConfig.bouquet.subtitle}
        </p>
      </motion.div>

      {/* Center Interactive 360° Viewport Spacer (Pass-through pointer events to 3D Canvas) */}
      <div className="flex-1 w-full flex items-end justify-center pb-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 text-[11px] text-pink-200/90 bg-slate-950/55 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-pink-400/25 shadow-lg">
          <Orbit className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>
            {bouquetBloomed
              ? '✨ Kéo chuột hoặc vuốt để xoay 360° • Chạm vào hoa để tung cánh hoa bay'
              : '🌸 Nhấn vào bó hoa 3D hoặc nút bên dưới để đánh thức hoa nở'}
          </span>
        </div>
      </div>

      {/* Bottom Interactive Control Dock */}
      <div className="w-full max-w-lg mx-auto pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel-glow rounded-3xl p-4 sm:p-5 text-center space-y-3.5 border-pink-400/30"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={bouquetBloomed ? 'bloomed-msg' : 'bud-msg'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs sm:text-sm text-pink-100 font-medium italic leading-relaxed"
            >
              {bouquetBloomed
                ? birthdayConfig.bouquet.bloomMessage
                : 'Những nụ hồng tinh tú đang e ấp chờ chú đánh thức...'}
            </motion.p>
          </AnimatePresence>

          {/* Interactive 3D Action Buttons: Bloom Animation & Flying Petals */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleToggleBloom}
              className={`py-2.5 px-3.5 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-lg ${
                bouquetBloomed
                  ? 'glass-panel text-pink-200 hover:text-white border border-pink-400/30'
                  : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold glow-gold'
              }`}
            >
              {bouquetBloomed ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
                  <span>{birthdayConfig.bouquet.foldBudButtonText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
                  <span>{birthdayConfig.bouquet.bloomButtonText}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePetalBurst}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-500/85 via-pink-500/85 to-purple-600/85 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg border border-pink-300/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Wind className="w-3.5 h-3.5 text-amber-200" />
              <span>{birthdayConfig.bouquet.petalBurstButtonText}</span>
            </button>
          </div>

          {/* Next Scene Button */}
          <button
            onClick={handleContinue}
            className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl glow-purple hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đọc Tâm Thư Vũ Trụ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
