import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Compass, 
  HeartHandshake, 
  Crown, 
  Calendar, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { birthdayConfig, TimelineItem } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

const iconLookup: Record<string, React.ElementType> = {
  Sparkles,
  Terminal,
  Compass,
  HeartHandshake,
  Crown,
};

export function TimelineScene() {
  const nextScene = useExperienceStore((state) => state.nextScene);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(birthdayConfig.timeline[0]?.id || null);

  const handleSelectEvent = (id: string) => {
    audioManager.playButtonSfx();
    setSelectedEventId(id);
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
        className="text-center max-w-xl mx-auto space-y-2 mb-10"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
          <Compass className="w-3.5 h-3.5 text-cyan-300" />
          DÒNG THỜI GIAN
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          CHẶNG ĐƯỜNG KẾT NỐI
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          Từ những ngày đầu bỡ ngỡ tới những cột mốc đáng nhớ trong vũ trụ tình bạn!
        </p>
      </motion.div>

      {/* Timeline Interactive Spine Container */}
      <div className="w-full max-w-4xl mx-auto relative px-4">
        {/* Glowing vertical spine bar */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-60" />

        <div className="space-y-8 relative">
          {birthdayConfig.timeline.map((event: TimelineItem, index: number) => {
            const Icon = iconLookup[event.icon || 'Sparkles'] || Sparkles;
            const isSelected = selectedEventId === event.id;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className={`relative flex items-center ${
                  // On desktop, alternate left and right; on mobile, always align right of the left spine
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } flex-row`}
              >
                {/* Center / Left Node Star */}
                <div
                  onClick={() => handleSelectEvent(event.id)}
                  className={`absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-900 glow-gold scale-125'
                      : 'bg-slate-900 border-2 border-purple-400/50 text-purple-300 hover:border-yellow-400 hover:scale-110'
                  }`}
                  title={event.title}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Card Container */}
                <div
                  className={`w-full sm:w-[44%] pl-14 sm:pl-0 ${
                    isEven ? 'sm:pr-8' : 'sm:pl-8'
                  }`}
                >
                  <div
                    onClick={() => handleSelectEvent(event.id)}
                    className={`glass-panel p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-yellow-400/50 glow-gold scale-[1.02] bg-slate-900/90'
                        : 'border-white/10 hover:border-purple-400/40 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      {event.tag && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-400/20">
                          {event.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    {event.image && isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 rounded-xl overflow-hidden aspect-video max-h-48 bg-black/40 border border-white/10"
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-12">
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg glow-pink hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Khám phá Hộp quà bí mật</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

