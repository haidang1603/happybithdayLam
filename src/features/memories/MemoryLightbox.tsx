import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { birthdayConfig } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

export function MemoryLightbox() {
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const setActiveMemoryId = useExperienceStore((state) => state.setActiveMemoryId);

  const memories = birthdayConfig.memories;
  const currentIndex = memories.findIndex((m) => m.id === activeMemoryId);
  const currentMemory = memories[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMemoryId) return;
      if (e.key === 'Escape') {
        setActiveMemoryId(null);
      } else if (e.key === 'ArrowRight' && currentIndex < memories.length - 1) {
        audioManager.playButtonSfx();
        setActiveMemoryId(memories[currentIndex + 1].id);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        audioManager.playButtonSfx();
        setActiveMemoryId(memories[currentIndex - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMemoryId, currentIndex, memories, setActiveMemoryId]);

  if (!currentMemory) return null;

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      audioManager.playButtonSfx();
      setActiveMemoryId(memories[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      audioManager.playButtonSfx();
      setActiveMemoryId(memories[currentIndex - 1].id);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={() => setActiveMemoryId(null)}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full glass-dock text-slate-300 hover:text-white hover:scale-105 transition-all cursor-pointer"
          title="Đóng (Esc)"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full glass-dock text-white transition-all cursor-pointer ${
            currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
          }`}
          title="Ảnh trước"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex === memories.length - 1}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full glass-dock text-white transition-all cursor-pointer ${
            currentIndex === memories.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
          }`}
          title="Ảnh tiếp theo"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Polaroid Modal */}
        <motion.div
          key={currentMemory.id}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl w-full max-h-[90vh] bg-slate-900/95 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl glass-panel-glow flex flex-col p-3"
        >
          {/* Image Display - Natural Fit */}
          <div className="relative w-full flex-1 min-h-0 bg-black/40 rounded-2xl overflow-hidden flex items-center justify-center p-2">
            <img
              src={currentMemory.image}
              alt="Kỷ niệm"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
            />
            <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-mono glass-dock text-slate-300">
              {currentIndex + 1} / {memories.length}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

