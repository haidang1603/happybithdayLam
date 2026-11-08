import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { birthdayConfig, MemoryItem } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

interface TravelRowProps {
  items: MemoryItem[];
  direction: 'left' | 'right' | 'left-slow';
  onCardClick: (id: string) => void;
  floatClass: string;
}

function TravelRow({ items, direction, onCardClick, floatClass }: TravelRowProps) {
  // Duplicate items to ensure seamless infinite looping
  const duplicatedItems = useMemo(() => [...items, ...items, ...items], [items]);

  const animClass =
    direction === 'left'
      ? 'animate-travel-left'
      : direction === 'right'
      ? 'animate-travel-right'
      : 'animate-travel-left-slow';

  return (
    <div className="relative w-full overflow-hidden py-1.5">
      <div className={`flex items-center gap-4 sm:gap-6 w-max pause-on-hover ${animClass}`}>
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={() => onCardClick(item.id)}
            className={`group cursor-pointer select-none transition-transform duration-300 hover:scale-105 hover:z-30 shrink-0 ${
              idx % 2 === 0 ? floatClass : 'animate-float-b'
            }`}
            style={{
              animationDelay: `${(idx % 5) * 0.4}s`,
            }}
          >
            {/* Zero-gravity Floating Frame: Slender crystal frame with delicate ambient glow */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-white/35 via-purple-300/25 to-pink-300/30 shadow-[0_0_18px_rgba(216,180,254,0.32),0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_28px_rgba(232,121,249,0.7),0_6px_25px_rgba(0,0,0,0.7)] group-hover:from-pink-300/70 group-hover:to-purple-300/70 transition-all duration-300 backdrop-blur-md">
              <img
                src={item.image}
                alt="Kỷ niệm"
                className="h-32 sm:h-40 md:h-44 w-auto max-w-[280px] sm:max-w-[340px] rounded-[14px] object-contain block pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemoryScene() {
  const setActiveMemoryId = useExperienceStore((state) => state.setActiveMemoryId);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const memories = birthdayConfig.memories;

  // Split memories into 3 alternating rows
  const { row1, row2, row3 } = useMemo(() => {
    const r1: MemoryItem[] = [];
    const r2: MemoryItem[] = [];
    const r3: MemoryItem[] = [];

    memories.forEach((mem, idx) => {
      if (idx % 3 === 0) r1.push(mem);
      else if (idx % 3 === 1) r2.push(mem);
      else r3.push(mem);
    });

    return { row1: r1, row2: r2, row3: r3 };
  }, [memories]);

  const handleCardClick = (id: string) => {
    audioManager.playButtonSfx();
    setActiveMemoryId(id);
  };

  const handleNext = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center pt-14 pb-24 z-10 select-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-1.5 px-4 z-20"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-400/30">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          KHO BÁU KỶ NIỆM
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
          VŨ TRỤ KÝ ỨC LƠ LỬNG
        </h2>
        <p className="text-slate-300 text-xs">
          Các khoảnh khắc đang trôi lơ lửng đan xen trong không gian — Chạm vào ảnh để xem trọn vẹn
        </p>
      </motion.div>

      {/* Main Traveling Stream Area with Left/Right Shadow Gradients */}
      <div className="relative w-full my-auto py-2 overflow-hidden flex flex-col gap-2">
        {/* Left & Right Soft Vignette Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#070817] via-[#070817]/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#070817] via-[#070817]/70 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Leftward Travel */}
        <TravelRow
          items={row1}
          direction="left"
          onCardClick={handleCardClick}
          floatClass="animate-float-a"
        />

        {/* Row 2: Rightward Travel (Interlaced) */}
        <TravelRow
          items={row2}
          direction="right"
          onCardClick={handleCardClick}
          floatClass="animate-float-b"
        />

        {/* Row 3: Leftward Travel (Slow) */}
        <TravelRow
          items={row3}
          direction="left-slow"
          onCardClick={handleCardClick}
          floatClass="animate-float-a"
        />
      </div>

      {/* Bottom Action */}
      <div className="pt-3 z-20">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg glow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Khám phá Hộp quà bí mật</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
