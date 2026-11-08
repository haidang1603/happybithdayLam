import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  Check, 
  RotateCcw, 
  Feather,
  Send,
  Star
} from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { birthdayConfig } from '@/config/birthday.config';

// Exact proportional base dimensions of vintage-letter-paper.jpg (682 x 1024)
const LETTER_BASE_WIDTH = 540;
const LETTER_BASE_HEIGHT = 810;

// Exact vertical positions (%) of the 28 ruled lines from top to bottom
const LINE_PERCENTAGES = [
  4.59, 8.11, 11.52, 14.84, 18.26, 21.58, 25.00, 28.32, 
  31.74, 35.06, 38.48, 41.80, 45.21, 48.63, 51.95, 55.37, 
  58.69, 62.11, 65.43, 68.85, 72.17, 75.59, 79.00, 82.32, 
  85.74, 89.06, 92.48, 96.29
];

// Exact line-by-line distribution across the 28 ruled lines
const LETTER_ROWS = [
  { text: '', align: 'left' }, // Line 1
  { text: 'Vũ Trụ, ngày 02 tháng 12 năm 2026', align: 'right', isDate: true }, // Line 2
  { text: '', align: 'left' }, // Line 3
  { text: 'Gửi Lam thân mến,', align: 'left', isSalutation: true }, // Line 4
  { text: '', align: 'left' }, // Line 5
  { text: 'Chúc mừng sinh nhật nhé! 🎉', align: 'left', isBold: true }, // Line 6
  { text: 'Vậy là chú lại bước sang tuổi 20 rồi.', align: 'left' }, // Line 7
  { text: 'Nhìn lại chặng đường vừa qua, anh cảm thấy thật may mắn', align: 'left' }, // Line 8
  { text: 'khi luôn có sự đồng hành của một người bạn như chú.', align: 'left' }, // Line 9
  { text: '', align: 'left' }, // Line 10
  { text: 'Cảm ơn chú vì đã luôn là một người bạn lắng nghe kiên nhẫn,', align: 'left' }, // Line 11
  { text: 'luôn mang lại năng lượng tích cực và những trận cười sảng khoái.', align: 'left' }, // Line 12
  { text: 'Tình bạn của chúng mình không màu mè, không sến súa,', align: 'left' }, // Line 13
  { text: 'nhưng lúc nào cũng chân thật và ấm áp.', align: 'left' }, // Line 14
  { text: '', align: 'left' }, // Line 15
  { text: 'Bước sang tuổi 20 thật đẹp, chúc Lam luôn mạnh khỏe,', align: 'left' }, // Line 16
  { text: 'giữ vững nụ cười rạng rỡ và bản lĩnh kiên cường', align: 'left' }, // Line 17
  { text: 'để theo đuổi mọi ước mơ, mục tiêu mà chú đang ấp ủ.', align: 'left' }, // Line 18
  { text: 'Mong rằng cuộc sống sẽ đối xử thật dịu dàng với chú!', align: 'left' }, // Line 19
  { text: '', align: 'left' }, // Line 20
  { text: 'Cho dù vũ trụ có bao la và cuộc sống có bận rộn đến đâu,', align: 'left' }, // Line 21
  { text: 'hãy nhớ rằng chú luôn có một người bạn đồng hành ở đây.', align: 'left' }, // Line 22
  { text: '', align: 'left' }, // Line 23
  { text: 'Tuổi 20 thật rực rỡ và thành công nhé bạn của tôi!', align: 'left', isAccent: true }, // Line 24
  { text: '', align: 'left' }, // Line 25
  { text: 'Cốt của chú,', align: 'center' }, // Line 26
  { text: `${birthdayConfig.senderName} ❤️`, align: 'center', isSignature: true }, // Line 27
  { text: 'Trái Đất — Ngày 02/12 đặc biệt của Lam', align: 'center', isNote: true }, // Line 28
];

export function LetterScene() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto-scale to ensure the entire letter fits inside viewport without any vertical scrolling
  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const availH = Math.max(280, window.innerHeight - 210);
      const availW = Math.min(LETTER_BASE_WIDTH, window.innerWidth - 32);
      return Math.min(1, availH / LETTER_BASE_HEIGHT, availW / LETTER_BASE_WIDTH);
    }
    return 0.8;
  });

  const letterPaperRef = useRef<HTMLDivElement>(null);

  const setLetterRead = useExperienceStore((state) => state.setLetterRead);
  const nextScene = useExperienceStore((state) => state.nextScene);

  useEffect(() => {
    const updateScale = () => {
      if (typeof window !== 'undefined') {
        const availH = Math.max(280, window.innerHeight - 210);
        const availW = Math.min(LETTER_BASE_WIDTH, window.innerWidth - 32);
        const newScale = Math.min(1, availH / LETTER_BASE_HEIGHT, availW / LETTER_BASE_WIDTH);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleOpenEnvelope = () => {
    if (isUnsealing || isOpen) return;
    setIsUnsealing(true);
    audioManager.playGiftOpenSfx();

    setTimeout(() => {
      setIsOpen(true);
      setIsUnsealing(false);
      setLetterRead(true);
      audioManager.playChimeCelebration();
    }, 900);
  };

  const handleFoldBack = () => {
    audioManager.playButtonSfx();
    setIsOpen(false);
  };

  const handleDownloadLetter = async () => {
    if (!letterPaperRef.current) return;
    try {
      setIsExporting(true);
      audioManager.playButtonSfx();

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(letterPaperRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#f5eedc',
        width: LETTER_BASE_WIDTH,
        height: LETTER_BASE_HEIGHT,
        style: {
          transform: 'none',
          boxShadow: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `Tam-Thu-Sinh-Nhat-My-Lam-20-Tuoi.png`;
      link.href = dataUrl;
      link.click();

      audioManager.playChimeCelebration();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export letter image:', err);
      alert('Không thể lưu ảnh tự động. Bạn có thể chụp màn hình bức thư này nhé!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNext = () => {
    audioManager.playButtonSfx();
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-3 pt-4 sm:pt-6 pb-6 z-10 select-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-1 mb-2 z-20 shrink-0"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
          <Feather className="w-3.5 h-3.5 text-pink-300" />
          TÂM THƯ TỪ TRÁI ĐẤT
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent">
          {birthdayConfig.letter.title}
        </h2>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex items-center justify-center my-auto z-20 overflow-visible">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* REALISTIC 3D COSMIC POSTAL ENVELOPE WITH WAX SEAL */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.6 }}
              className="group cursor-pointer mx-auto max-w-md w-full perspective-1000"
              onClick={handleOpenEnvelope}
            >
              {/* Envelope Body */}
              <div 
                className={`relative rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
                  isUnsealing ? 'scale-105 shadow-[0_0_50px_rgba(250,204,21,0.5)]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1b1236 0%, #251648 45%, #130e26 100%)',
                }}
              >
                {/* Airmail Border Accent */}
                <div className="absolute inset-1.5 rounded-[22px] border border-amber-400/30 pointer-events-none" />
                <div className="absolute inset-3 rounded-[18px] border border-dashed border-amber-300/20 pointer-events-none" />

                {/* Postage Stamp & Cancellation Postmark (Top-Right) */}
                <div className="absolute top-4 right-4 z-10 flex flex-col items-center">
                  {/* Postage Stamp */}
                  <div className="relative w-16 h-20 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border-2 border-amber-300/70 rounded-md p-1.5 flex flex-col justify-between items-center shadow-lg">
                    <div className="flex items-center justify-between w-full text-[8px] text-amber-300 font-mono">
                      <span>GLX</span>
                      <span>20th</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-300/50">
                      <Star className="w-5 h-5 text-amber-300 fill-amber-300/40" />
                    </div>
                    <span className="text-[7px] font-mono text-purple-200 tracking-wider">02/12/2006</span>
                  </div>

                  {/* Wavy Ink Postmark */}
                  <div className="absolute -left-6 top-3 w-16 h-16 rounded-full border-2 border-amber-300/30 border-dashed pointer-events-none rotate-12 flex items-center justify-center">
                    <span className="text-[6px] font-mono uppercase tracking-widest text-amber-300/40 text-center leading-none">
                      ★ ORBIT MAIL ★<br />02.12.2026
                    </span>
                  </div>
                </div>

                {/* Envelope Sender Note (Top-Left) */}
                <div className="pt-6 px-6 sm:px-8 space-y-1 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                    <Send className="w-3 h-3 text-pink-400" />
                    <span>Special Galaxy Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Từ: <span className="text-amber-200 font-bold">{birthdayConfig.senderName}</span> (Trái Đất)
                  </p>
                </div>

                {/* Envelope Recipient Calligraphy (Center) */}
                <div className="pt-10 pb-16 px-6 sm:px-8 text-center space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-pink-300/80 font-mono block">
                    — Kính gửi người bạn đặc biệt —
                  </span>
                  <h3 className="font-handwriting text-3xl sm:text-4xl text-amber-200 font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]">
                    {birthdayConfig.recipientName} 🌸
                  </h3>
                  <p className="text-xs text-slate-300 font-sans">
                    Tinh cầu tuổi 20 rực rỡ • Quỹ đạo thanh xuân
                  </p>
                </div>

                {/* Triangular Flap (Folded Down) */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-32 pointer-events-none transition-transform duration-700 origin-top ${
                    isUnsealing ? 'rotate-x-180 opacity-0' : 'rotate-x-0 opacity-100'
                  }`}
                  style={{
                    background: 'linear-gradient(180deg, rgba(45, 25, 75, 0.95) 0%, rgba(20, 14, 40, 0.95) 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                  }}
                />

                {/* 3D ROYAL RED WAX SEAL */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div 
                    className={`relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isUnsealing ? 'scale-125 rotate-12 opacity-80' : 'group-hover:scale-110 shadow-2xl'
                    }`}
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #ef4444 0%, #b91c1c 45%, #7f1d1d 80%, #450a0a 100%)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    {/* Organic Wax Rim Texture */}
                    <div className="absolute inset-[-3px] rounded-full border-2 border-red-500/40 opacity-70 pointer-events-none" />
                    
                    {/* Inner Gold Seal Monogram */}
                    <div className="w-13 h-13 rounded-full border border-amber-300/60 bg-gradient-to-tr from-red-950 via-rose-900 to-red-800 flex flex-col items-center justify-center shadow-inner">
                      <span className="font-handwriting text-2xl font-black text-amber-200 drop-shadow">L</span>
                      <span className="text-[7px] font-mono tracking-widest text-amber-300/90 uppercase -mt-1">2006</span>
                    </div>

                    {/* Golden Sparkle Overlay */}
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>

                  {/* Pulsing Hint Badge */}
                  <motion.div 
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="mt-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[11px] text-amber-200 font-medium tracking-wide flex items-center gap-1.5 shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{isUnsealing ? 'Đang mở phong thư...' : 'Nhấn vào con dấu sáp để mở thư'}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* REDESIGNED VINTAGE STATIONERY LETTER — FITS 100% IN VIEWPORT WITHOUT SCROLLING */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              {/* Top Utility Toolbar - Compact Centered Bar */}
              <div className="flex items-center justify-center gap-2.5 z-30 mb-3">
                <button
                  onClick={handleFoldBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/15 text-xs font-medium transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gấp lại</span>
                </button>

                <button
                  onClick={handleDownloadLetter}
                  disabled={isExporting}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-md ${
                    downloadSuccess 
                      ? 'bg-emerald-600 text-white border border-emerald-400' 
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 hover:border-amber-300/60'
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>Đang lưu...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã lưu ảnh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                      <span>Lưu thư</span>
                    </>
                  )}
                </button>
              </div>

              {/* Responsive Scaling Wrapper: Zero scroll, 100% visible on screen */}
              <div 
                className="w-full flex justify-center items-start overflow-visible"
                style={{
                  height: `${LETTER_BASE_HEIGHT * scale}px`,
                }}
              >
                <div
                  style={{
                    width: `${LETTER_BASE_WIDTH}px`,
                    height: `${LETTER_BASE_HEIGHT}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                  }}
                  className="shrink-0"
                >
                  {/* The Vintage Stationery Paper Sheet */}
                  <div
                    ref={letterPaperRef}
                    style={{
                      width: `${LETTER_BASE_WIDTH}px`,
                      height: `${LETTER_BASE_HEIGHT}px`,
                      backgroundImage: `url('/images/vintage-letter-paper.jpg')`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    className="relative rounded-[20px] overflow-hidden select-text shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(217,119,6,0.2)] border border-amber-900/30"
                  >
                    {/* The 28 Ruled Lines: Inked Text Resting Exactly on Line Baselines */}
                    {LETTER_ROWS.map((row, idx) => {
                      if (!row.text) return null;
                      const lineTopPct = LINE_PERCENTAGES[idx];

                      return (
                        <div
                          key={idx}
                          style={{
                            position: 'absolute',
                            left: '8.4%',
                            right: '8.4%',
                            top: `${lineTopPct}%`,
                            transform: 'translateY(-86%)',
                          }}
                          className={`font-handwriting leading-none select-text ${
                            row.align === 'center' ? 'text-center' : row.align === 'right' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {row.isDate ? (
                            <span className="text-[17px] text-stone-700 italic font-semibold tracking-wide">
                              {row.text}
                            </span>
                          ) : row.isSalutation ? (
                            <span className="text-[23px] text-[#211a14] font-black tracking-wide">
                              {row.text}
                            </span>
                          ) : row.isBold ? (
                            <span className="text-[20px] text-[#1c1917] font-bold tracking-wide">
                              {row.text}
                            </span>
                          ) : row.isAccent ? (
                            <span className="text-[20px] text-purple-950 font-black tracking-wide">
                              {row.text}
                            </span>
                          ) : row.isSignature ? (
                            <span className="text-[23px] text-[#2c1810] font-black tracking-wide">
                              {row.text}
                            </span>
                          ) : row.isNote ? (
                            <span className="text-[12px] font-mono text-stone-600 tracking-wider">
                              {row.text}
                            </span>
                          ) : (
                            <span className="text-[19px] text-[#221c16] font-semibold tracking-wide">
                              {row.text}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action: Proceed to Grand Finale */}
      <div className="pt-2 z-20 shrink-0">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Màn pháo hoa chúc mừng đặc biệt</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
