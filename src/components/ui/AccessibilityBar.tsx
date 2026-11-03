import { useState } from 'react';
import { Settings, Zap, ZapOff, Sparkles, Check } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLowPerformance = useExperienceStore((state) => state.isLowPerformance);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const setLowPerformance = useExperienceStore((state) => state.setLowPerformance);
  const setReducedMotion = useExperienceStore((state) => state.setReducedMotion);

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-dock p-2.5 rounded-full text-slate-300 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer"
          title="Cài đặt trải nghiệm &amp; hiệu suất"
          aria-label="Cài đặt trải nghiệm"
        >
          <Settings className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute top-12 left-0 w-64 glass-panel-glow rounded-2xl p-4 shadow-2xl text-xs space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 font-heading">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Cài đặt hiển thị
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Low Performance Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Tiết kiệm pin &amp; RAM</p>
                <p className="text-[10px] text-slate-400">Giảm bớt hạt sao 3D</p>
              </div>
              <button
                onClick={() => setLowPerformance(!isLowPerformance)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  isLowPerformance ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    isLowPerformance ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Giảm chuyển động</p>
                <p className="text-[10px] text-slate-400">Dành cho ai dễ chóng mặt</p>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  reducedMotion ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>

            <div className="pt-1 border-t border-white/10 text-[10px] text-slate-400 text-center">
              Galaxy Birthday Universe v2.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

