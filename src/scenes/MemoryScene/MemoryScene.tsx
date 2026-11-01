import { motion } from 'framer-motion';
import { Sparkles, Calendar, Maximize2, ArrowRight } from 'lucide-react';
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
          Từng khoảnh khắc trôi qua đều là những mảnh ghép quý giá làm nên tình bạn tuyệt vời này!
        </p>
      </motion.div>

      {/* Grid of Polaroid Cards */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2">
        {birthdayConfig.memories.map((item: MemoryItem, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => handleCardClick(item.id)}
            className="group relative cursor-pointer"
          >
            {/* Polaroid Styling Container */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 shadow-xl hover:border-purple-500/50 hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-md flex flex-col">
              {/* Photo Area */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full glass-dock text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                {item.tag && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium glass-dock text-purple-200 border border-purple-400/20">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Caption & Date Area */}
              <div className="pt-3 pb-1 px-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400 font-mono">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold font-heading text-white truncate group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
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
