import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { 
  Sparkles, 
  Heart, 
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

export function LetterScene() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const letterPaperRef = useRef<HTMLDivElement>(null);

  const setLetterRead = useExperienceStore((state) => state.setLetterRead);
  const nextScene = useExperienceStore((state) => state.nextScene);

  const handleOpenEnvelope = () => {
    if (isUnsealing || isOpen) return;
    setIsUnsealing(true);
    audioManager.playGiftOpenSfx();

    // Smooth unsealing transition: wax pops, flap flips, paper emerges
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
        backgroundColor: '#FAF8F5',
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
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-12 pb-24 z-10 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mx-auto space-y-1.5 mb-4 z-20"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
          <Feather className="w-3.5 h-3.5 text-pink-300" />
          TÂM THƯ TỪ TRÁI ĐẤT
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent">
          {birthdayConfig.letter.title}
        </h2>
        <p className="text-slate-300 text-xs">
          {birthdayConfig.letter.subtitle}
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto my-auto z-20">
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
            /* AUTHENTIC STATIONERY LETTER WITH INKED HANDWRITING & ACTIONS */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full space-y-3"
            >
              {/* Top Utility Toolbar */}
              <div className="flex items-center justify-between gap-2 px-2">
                <button
                  onClick={handleFoldBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-400/30 text-xs font-medium transition-all cursor-pointer backdrop-blur-sm active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Gấp thư lại</span>
                </button>

                <button
                  onClick={handleDownloadLetter}
                  disabled={isExporting}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                    downloadSuccess 
                      ? 'bg-emerald-600 text-white border border-emerald-400' 
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 border border-amber-300/60'
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu ảnh...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã lưu thư thành công!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Lưu thư dạng ảnh</span>
                    </>
                  )}
                </button>
              </div>

              {/* The Physical Stationery Paper Sheet */}
              <div
                ref={letterPaperRef}
                className="relative rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(251,191,36,0.25)] stationery-ruled-paper max-h-[74vh] overflow-y-auto"
                style={{
                  backgroundColor: '#FAF8F5',
                }}
              >
                {/* Top-Right Floral Bouquet (Exact Watercolor Artwork) */}
                <div className="absolute top-0 right-0 w-44 sm:w-60 md:w-72 pointer-events-none z-10 opacity-95">
                  <img
                    src="/images/letter-floral-corner.png"
                    alt="Floral stationery bouquet"
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Bottom Watercolor Wash */}
                <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10 opacity-80">
                  <img
                    src="/images/letter-watercolor-bottom.png"
                    alt="Watercolor wash"
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>

                {/* Subtle Fold Crease Line (Tactile physical paper look) */}
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-slate-400/10 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-slate-400/10 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />

                {/* Letter Content - Lines Strictly Synchronized to 38px Grid */}
                <div className="relative z-20 px-6 sm:px-12 pt-16 sm:pt-20 pb-12 text-slate-900 select-text">
                  {/* Letter Header */}
                  <div className="flex items-start justify-between mb-[38px]">
                    <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-500 border-b border-slate-300/60 pb-0.5">
                      <Feather className="w-3.5 h-3.5 text-purple-700" />
                      <span>FIRST CLASS AIRMAIL • 02/12/2006</span>
                    </div>

                    <div className="font-handwriting text-xl sm:text-2xl text-slate-700 text-right">
                      Vũ Trụ, 02 tháng 12
                    </div>
                  </div>

                  {/* Salutation Line */}
                  <div className="mb-[38px]">
                    <h3 className="font-handwriting text-3xl sm:text-4xl text-slate-900 font-bold tracking-wide leading-[38px]">
                      {birthdayConfig.letter.salutation}
                    </h3>
                  </div>

                  {/* Paragraphs - Each Wrapped Line Perfectly Resting On Ruled Dotted Line */}
                  <div className="font-handwriting text-2xl sm:text-[25px] text-slate-800 tracking-wide font-medium">
                    {birthdayConfig.letter.paragraphs.map((p: string, idx: number) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="leading-[38px] mb-[38px] indent-6 text-justify"
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  {/* Closing & Signature Block */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-handwriting text-2xl text-slate-700 block leading-[38px]">
                        {birthdayConfig.letter.signature}
                      </span>
                      <p className="font-handwriting text-4xl text-purple-950 font-black leading-[38px] tracking-wide flex items-center gap-2">
                        <span>{birthdayConfig.senderName}</span>
                        <Heart className="w-5 h-5 fill-rose-600 text-rose-600 inline-block" />
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono pt-1">
                        {birthdayConfig.letter.footerNote}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-rose-900 font-medium bg-amber-100/80 px-4 py-1.5 rounded-full border border-rose-300/60 w-fit backdrop-blur-sm shadow-sm">
                      <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
                      <span className="font-sans font-semibold">Tình bạn diệu kỳ tuổi 20</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action: Proceed to Grand Finale */}
      <div className="pt-4 z-20">
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Màn pháo hoa chúc mừng đặc biệt</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
