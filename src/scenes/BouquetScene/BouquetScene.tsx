import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Sparkles, Wind, RotateCcw, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerGiftSparkles } from '@/components/effects/ConfettiBurst';
import { birthdayConfig } from '@/config/birthday.config';

export function BouquetScene() {
  const [showControls, setShowControls] = useState(true);
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
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-8 sm:pt-10 pb-24 z-10 select-none pointer-events-none">
      {/* Compact Top Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-lg mx-auto space-y-1 pointer-events-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-pink-500/20 text-pink-200 border border-pink-400/35 shadow-lg">
              <Flower2 className="w-3 h-3 text-pink-300 animate-spin" style={{ animationDuration: '8s' }} />
              {birthdayConfig.bouquet.badge}
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
              {birthdayConfig.bouquet.title}
            </h2>
            <p className="text-slate-300/90 text-[11px] sm:text-xs max-w-md mx-auto">
              Kéo để xoay 360° • Chạm vào hoa để tung cánh hoa bay
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Interactive 360° Viewport Spacer */}
      <div className="flex-1 w-full pointer-events-none" />

      {/* Compact Bottom Control Bar + Show/Hide Toggle */}
      <div className="w-full flex flex-col items-center gap-2 pointer-events-auto">
        <AnimatePresence mode="wait">
          {showControls ? (
            <motion.div
              key="controls-bar"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass-panel-glow rounded-full px-2.5 py-2 border border-pink-400/30 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full"
            >
              <button
                onClick={handleToggleBloom}
                title={bouquetBloomed ? birthdayConfig.bouquet.foldBudButtonText : birthdayConfig.bouquet.bloomButtonText}
                className={`py-1.5 px-3 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  bouquetBloomed
                    ? 'bg-white/10 text-pink-100 hover:bg-white/20 border border-pink-400/30'
                    : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold shadow-md'
                }`}
              >
                {bouquetBloomed ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
                    <span>Thu nụ</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                    <span>Nở hoa</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePetalBurst}
                title={birthdayConfig.bouquet.petalBurstButtonText}
                className="py-1.5 px-3 rounded-full bg-gradient-to-r from-rose-500/85 via-pink-500/85 to-purple-600/85 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs border border-pink-300/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Wind className="w-3.5 h-3.5 text-amber-200" />
                <span>Cánh hoa bay</span>
              </button>

              <button
                onClick={handleContinue}
                className="py-1.5 px-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Đọc thư</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowControls(false)}
                title="Ẩn các nút thao tác để xem trọn bó hoa"
                aria-label="Ẩn nút thao tác"
                className="py-1.5 px-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/15 text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ẩn</span>
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="controls-toggle"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowControls(true)}
              className="glass-panel rounded-full px-3.5 py-1.5 text-xs font-semibold text-pink-200 hover:text-white border border-pink-400/35 shadow-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-pink-300" />
              <span>Thao tác</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

