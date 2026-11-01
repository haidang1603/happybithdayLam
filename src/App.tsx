import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { CanvasContainer } from '@/components3d/CanvasContainer';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { MusicPlayer } from '@/features/music-player/MusicPlayer';
import { AccessibilityBar } from '@/components/ui/AccessibilityBar';
import { MemoryLightbox } from '@/features/memories/MemoryLightbox';

// Scenes
import { GalaxyPortalScene } from '@/scenes/GalaxyPortal/GalaxyPortalScene';
import { BirthdayScene } from '@/scenes/BirthdayScene/BirthdayScene';
import { MemoryScene } from '@/scenes/MemoryScene/MemoryScene';
import { TimelineScene } from '@/scenes/TimelineScene/TimelineScene';
import { GiftScene } from '@/scenes/GiftScene/GiftScene';
import { LetterScene } from '@/scenes/LetterScene/LetterScene';
import { FinaleScene } from '@/scenes/FinaleScene/FinaleScene';

// Utilities
import { detectWebGLSupport, detectIsMobile } from '@/utils/webglDetect';

export default function App() {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const setWebGLSupported = useExperienceStore((state) => state.setWebGLSupported);
  const setLowPerformance = useExperienceStore((state) => state.setLowPerformance);

  useEffect(() => {
    // 1. Check WebGL support
    const hasWebGL = detectWebGLSupport();
    setWebGLSupported(hasWebGL);

    // 2. Auto-optimize for mobile devices
    if (detectIsMobile()) {
      setLowPerformance(true);
    }
  }, [setWebGLSupported, setLowPerformance]);

  return (
    <div className="relative min-h-screen w-full bg-[#070817] text-[#F8FAFC] overflow-x-hidden">
      {/* 3D WebGL Canvas Layer */}
      <CanvasContainer />

      {/* Floating System Controllers */}
      <MusicPlayer />
      <AccessibilityBar />
      <FloatingNav />

      {/* Fullscreen Photo Lightbox Modal */}
      <MemoryLightbox />

      {/* Scene Content Transitions */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentScene === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full min-h-screen"
            >
              <GalaxyPortalScene />
            </motion.div>
          )}

          {currentScene === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className="w-full min-h-screen"
            >
              <BirthdayScene />
            </motion.div>
          )}

          {currentScene === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-screen"
            >
              <MemoryScene />
            </motion.div>
          )}

          {currentScene === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-screen"
            >
              <TimelineScene />
            </motion.div>
          )}

          {currentScene === 'gift' && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-screen"
            >
              <GiftScene />
            </motion.div>
          )}

          {currentScene === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-screen"
            >
              <LetterScene />
            </motion.div>
          )}

          {currentScene === 'finale' && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full min-h-screen"
            >
              <FinaleScene />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
