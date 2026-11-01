import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerGiftSparkles } from '@/components/effects/ConfettiBurst';
import { birthdayConfig } from '@/config/birthday.config';

export function GiftScene() {
  const giftOpened = useExperienceStore((state) => state.giftOpened);
  const setGiftOpened = useExperienceStore((state) => state.setGiftOpened);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const handleOpenGift = () => {
    audioManager.playGiftOpenSfx();
    triggerGiftSparkles();
    setGiftOpened(true);
  };

  const handleNext = () => {
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
          <Gift className="w-3.5 h-3.5 text-yellow-300" />
          MÓN QUÀ ĐẶC BIỆT
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
          {birthdayConfig.gift.title}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          {birthdayConfig.gift.subtitle}
        </p>
      </motion.div>

      {/* Center 3D Space Hint */}
      <div className="flex-1 w-full flex items-center justify-center my-4 pointer-events-none">
        <p className="text-[11px] text-slate-400 bg-black/40 px-3.5 py-1 rounded-full backdrop-blur-sm border border-white/5">
          {giftOpened ? "✨ Hộp quà đã được mở!" : "🎁 Nhấn trực tiếp vào hộp quà 3D hoặc nút bên dưới"}
        </p>
      </div>

      {/* Bottom Interactive Content */}
      <div className="w-full max-w-lg mx-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          {!giftOpened ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel-glow rounded-3xl p-5 text-center space-y-3"
            >
              <p className="text-xs sm:text-sm text-yellow-200 font-medium">
                {birthdayConfig.gift.closedHint}
              </p>

              <button
                onClick={handleOpenGift}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Mở Nắp Hộp Quà Bí Mật</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel-glow rounded-3xl p-6 text-left space-y-4 border-yellow-400/40 shadow-2xl"
            >
              {/* Gift Badge & Title */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                  {birthdayConfig.gift.badge}
                </span>
                <span className="text-xs text-cyan-300 font-mono font-medium">
                  ✦ SPECIAL REWARD ✦
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                {birthdayConfig.gift.openTitle}
              </h3>

              <p className="text-xs sm:text-sm text-purple-200 italic leading-relaxed">
                “{birthdayConfig.gift.message}”
              </p>

              {/* Reward Details List */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-yellow-300 tracking-wider">
                  {birthdayConfig.gift.rewardTitle}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {birthdayConfig.gift.rewardDetails.map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                {birthdayConfig.gift.ps}
              </p>

              {/* Actions */}
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mở và đọc thư chúc mừng</span>
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
