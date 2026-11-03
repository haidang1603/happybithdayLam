import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, ArrowRight } from 'lucide-react';
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
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-14 pb-24 z-10 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-1.5 mb-4 z-20"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
          <Mail className="w-3.5 h-3.5 text-pink-300" />
          TÂM THƯ TỪ TRÁI ĐẤT
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent">
          {birthdayConfig.letter.title}
        </h2>
        <p className="text-slate-300 text-xs">
          {birthdayConfig.letter.subtitle}
        </p>
      </motion.div>

      {/* Main Letter / Envelope Area */}
      <div className="w-full max-w-xl mx-auto my-auto z-20">
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
            /* Unfolded Authentic Floral Stationery Letter */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-100/60 max-h-[76vh] flex flex-col"
              style={{
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(250, 204, 21, 0.25)',
              }}
            >
              {/* Background Floral Stationery Paper */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{
                  backgroundImage: "url('/images/letter-paper.jpg')",
                }}
              />

              {/* Scrollable Letter Content */}
              <div className="relative z-10 overflow-y-auto px-6 sm:px-10 pt-16 sm:pt-20 pb-8 space-y-5 text-slate-900 select-text">
                {/* Salutation Header */}
                <div className="border-b border-amber-900/15 pb-2">
                  <h3 className="font-handwriting text-3xl sm:text-4xl text-slate-900 font-bold tracking-wide">
                    {birthdayConfig.letter.salutation}
                  </h3>
                </div>

                {/* Paragraphs in Warm Handwriting Font */}
                <div className="space-y-4 font-handwriting text-xl sm:text-2xl text-slate-800 leading-relaxed sm:leading-loose">
                  {birthdayConfig.letter.paragraphs.map((p: string, idx: number) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.12 }}
                      className="tracking-wide"
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                {/* Signature & Date Footer */}
                <div className="pt-4 border-t border-amber-900/20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-600 block">
                      Người gửi:
                    </span>
                    <p className="font-handwriting text-2xl sm:text-3xl text-purple-950 font-bold">
                      {birthdayConfig.senderName}
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono">
                      {birthdayConfig.letter.footerNote}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium bg-white/50 px-3 py-1 rounded-full border border-rose-300/40 w-fit">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-600 animate-pulse" />
                    <span className="font-sans">Mãi là bạn tốt</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="pt-4 z-20">
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
