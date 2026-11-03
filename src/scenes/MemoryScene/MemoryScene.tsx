import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { birthdayConfig, MemoryItem } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

export function MemoryScene() {
  const setActiveMemoryId = useExperienceStore((state) => state.setActiveMemoryId);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const handleCardClick = (id: string) => {
    audioManager.playButtonSfx();
    setActiveMemoryId(id);
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
        className="text-center max-w-xl mx-auto space-y-2 mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-400/30">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          KHO BÁU KỶ NIỆM
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
          VŨ TRỤ KÝ ỨC
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          Chạm vào ảnh bất kỳ để xem trọn vẹn ở kích thước lớn
        </p>
      </motion.div>

      {/* Masonry Columns of Photo Frames - Natural Aspect Ratio & No Text */}
      <div className="w-full max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 px-3">
        {birthdayConfig.memories.map((item: MemoryItem, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
            whileHover={{ y: -6, scale: 1.015 }}
            onClick={() => handleCardClick(item.id)}
            className="break-inside-avoid mb-5 group cursor-pointer"
          >
            {/* Clean Photo Frame: fits each photo naturally without cropping */}
            <div className="bg-slate-900/80 border border-white/15 hover:border-purple-400/60 rounded-2xl p-2.5 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-md">
              <img
                src={item.image}
                alt="Kỷ niệm"
                className="w-full h-auto rounded-xl object-contain block transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="pt-10">
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Khám phá Hành trình tình bạn</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
