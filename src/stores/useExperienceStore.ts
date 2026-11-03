import { create } from 'zustand';

export type SceneId = 'portal' | 'cake' | 'memories' | 'gift' | 'letter' | 'finale';

export interface SceneMeta {
  id: SceneId;
  label: string;
  shortTitle: string;
  iconName: string;
}

export const SCENE_ORDER: SceneMeta[] = [
  { id: 'portal', label: 'Cổng Vũ Trụ', shortTitle: 'Cổng Khởi Đầu', iconName: 'Compass' },
  { id: 'cake', label: 'Bánh Sinh Nhật', shortTitle: 'Thổi Nến Ước Nguyện', iconName: 'Cake' },
  { id: 'memories', label: 'Album Kỷ Niệm', shortTitle: 'Khoảnh Khắc Đẹp', iconName: 'Images' },
  { id: 'gift', label: 'Hộp Quà Bí Mật', shortTitle: 'Quà Bất Ngờ', iconName: 'Gift' },
  { id: 'letter', label: 'Thư Chúc Mừng', shortTitle: 'Tâm Thư Chân Thành', iconName: 'Mail' },
  { id: 'finale', label: 'Pháo Hoa Rực Rỡ', shortTitle: 'Khép Lại Rạng Rỡ', iconName: 'Sparkles' },
];

interface ExperienceState {
  currentScene: SceneId;
  hasEntered: boolean;
  candleBlown: boolean;
  giftOpened: boolean;
  letterRead: boolean;
  
  // Audio state
  musicPlaying: boolean;
  musicVolume: number;
  musicMuted: boolean;
  audioInitialized: boolean;
  
  // Performance and Accessibility
  isLowPerformance: boolean;
  reducedMotion: boolean;
  webGLSupported: boolean;
  
  // Lightbox
  activeMemoryId: string | null;
  
  // Actions
  setScene: (scene: SceneId) => void;
  nextScene: () => void;
  prevScene: () => void;
  enterPortal: () => void;
  setCandleBlown: (blown: boolean) => void;
  setGiftOpened: (opened: boolean) => void;
  setLetterRead: (read: boolean) => void;
  toggleMusic: () => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicVolume: (volume: number) => void;
  toggleMute: () => void;
  setAudioInitialized: (init: boolean) => void;
  setLowPerformance: (low: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebGLSupported: (supported: boolean) => void;
  setActiveMemoryId: (id: string | null) => void;
  resetExperience: () => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  currentScene: 'portal',
  hasEntered: false,
  candleBlown: false,
  giftOpened: false,
  letterRead: false,
  
  musicPlaying: false,
  musicVolume: 0.6,
  musicMuted: false,
  audioInitialized: false,
  
  isLowPerformance: false,
  reducedMotion: false,
  webGLSupported: true,
  
  activeMemoryId: null,
  
  setScene: (scene) => set({ currentScene: scene }),
  
  nextScene: () => {
    const currentIndex = SCENE_ORDER.findIndex((s) => s.id === get().currentScene);
    if (currentIndex < SCENE_ORDER.length - 1) {
      set({ currentScene: SCENE_ORDER[currentIndex + 1].id });
    }
  },
  
  prevScene: () => {
    const currentIndex = SCENE_ORDER.findIndex((s) => s.id === get().currentScene);
    if (currentIndex > 0) {
      set({ currentScene: SCENE_ORDER[currentIndex - 1].id });
    }
  },
  
  enterPortal: () => set({ hasEntered: true, currentScene: 'cake' }),
  
  setCandleBlown: (blown) => set({ candleBlown: blown }),
  
  setGiftOpened: (opened) => set({ giftOpened: opened }),
  
  setLetterRead: (read) => set({ letterRead: read }),
  
  toggleMusic: () => set((state) => ({ musicPlaying: !state.musicPlaying })),
  
  setMusicPlaying: (playing) => set({ musicPlaying: playing }),
  
  setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
  
  toggleMute: () => set((state) => ({ musicMuted: !state.musicMuted })),
  
  setAudioInitialized: (init) => set({ audioInitialized: init }),
  
  setLowPerformance: (low) => set({ isLowPerformance: low }),
  
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  
  setWebGLSupported: (supported) => set({ webGLSupported: supported }),
  
  setActiveMemoryId: (id) => set({ activeMemoryId: id }),
  
  resetExperience: () => set({
    currentScene: 'portal',
    hasEntered: false,
    candleBlown: false,
    giftOpened: false,
    letterRead: false,
    activeMemoryId: null,
  }),
}));

