import { useExperienceStore, SCENE_ORDER, SceneId } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { 
  Compass, 
  Cake, 
  Images, 
  Milestone, 
  Gift, 
  Mail, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Cake,
  Images,
  Milestone,
  Gift,
  Mail,
  Sparkles,
};

export function FloatingNav() {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const setScene = useExperienceStore((state) => state.setScene);
  const nextScene = useExperienceStore((state) => state.nextScene);
  const prevScene = useExperienceStore((state) => state.prevScene);
  const hasEntered = useExperienceStore((state) => state.hasEntered);

  // If user hasn't entered portal yet, don't show full navigation bar
  if (currentScene === 'portal' && !hasEntered) {
    return null;
  }

  const currentIndex = SCENE_ORDER.findIndex((s) => s.id === currentScene);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === SCENE_ORDER.length - 1;

  const handleNavClick = (id: SceneId) => {
    audioManager.playButtonSfx();
    setScene(id);
  };

  const handleNext = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  const handlePrev = () => {
    audioManager.playButtonSfx();
    prevScene();
  };

  return (
    <nav aria-label="Điều hướng các phân đoạn" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
      <div className="glass-dock px-3 py-2 rounded-full flex items-center gap-1 sm:gap-2 shadow-2xl">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className={`p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
            isFirst ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''
          }`}
          title="Phân đoạn trước"
          aria-label="Phân đoạn trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scene Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-1">
          {SCENE_ORDER.map((item, idx) => {
            const Icon = iconMap[item.iconName] || Sparkles;
            const isActive = currentScene === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md glow-purple scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-yellow-300' : ''}`} />
                <span className={`text-[11px] whitespace-nowrap hidden md:inline font-heading`}>
                  {item.label}
                </span>

                {/* Active indicator dot on mobile */}
                {isActive && (
                  <span className="md:hidden w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isLast}
          className={`p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
            isLast ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''
          }`}
          title="Phân đoạn kế tiếp"
          aria-label="Phân đoạn kế tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}

