import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, ArrowRight, BookOpen } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { birthdayConfig } from '@/config/birthday.config';

export function LetterScene() {
  const [isOpen, setIsOpen] = useState(false);
  const letterRead = useExperienceStore((state) => state.letterRead);
  const setLetterRead = useExperienceStore((state) => state.setLetterRead);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const handleOpenEnvelope = () => {
    audioManager.playGiftOpenSfx();
    setIsOpen(true);
    setLetterRead(true);
  };

  const handleNext = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-16 pb-28 z-10 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-2 mb-6"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
          <Mail className="w-3.5 h-3.5 text-pink-300" />
          TÂM THƯ TỪ TRÁI ĐẤT
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent">
          {birthdayConfig.letter.title}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          {birthdayConfig.letter.subtitle}
        </p>
      </motion.div>

      {/* Main Letter / Envelope Area */}
      <div className="w-full max-w-2xl mx-auto my-auto">
        <AnimatePresence mode="wait">
          {!isOpen && !letterRead ? (
            /* Envelope Sealed View */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              onClick={handleOpenEnvelope}
              className="group cursor-pointer mx-auto max-w-md"
            >
              <div className="glass-panel-glow p-8 rounded-3xl text-center space-y-5 border-purple-400/40 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl">
                {/* Envelope Graphic */}
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-purple-700 to-pink-500 flex items-center justify-center text-white shadow-xl glow-purple group-hover:rotate-6 transition-transform">
                  <Mail className="w-12 h-12" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">
                    Chuyển phát qua vệ tinh
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">
                    Gửi: {birthdayConfig.recipientName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Bấm để mở phong thư và đọc toàn bộ tâm sự
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg glow-pink">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Mở phong thư</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Unfolded Letter Sheet */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative space-y-6 text-slate-100"
            >
              {/* Decorative Top Stamp */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-handwriting text-2xl sm:text-3xl text-yellow-300">
                  {birthdayConfig.letter.salutation}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono glass-dock text-purple-300 border border-purple-400/30">
                  ✦ CONFIDENTIAL ✦
                </span>
              </div>

              {/* Letter Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-200 font-body">
                {birthdayConfig.letter.paragraphs.map((p: string, idx: number) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-handwriting text-2xl sm:text-3xl text-pink-300">
                    {birthdayConfig.senderName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {birthdayConfig.letter.footerNote}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium">
                  <Heart className="w-4 h-4 fill-current text-pink-500 animate-pulse" />
                  <span>Tình bạn bền vững xuyên không gian</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="pt-8">
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Màn pháo hoa chúc mừng đặc biệt</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
