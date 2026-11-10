import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Utensils, 
  ShieldAlert, 
  PhoneCall, 
  Zap, 
  Wifi,
  Award
} from 'lucide-react';
import { birthdayConfig } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

interface FriendshipPassCardProps {
  onContinue: () => void;
}

// Standard ISO/IEC 7810 ID-1 credit card fixed aspect ratio (~1.58 : 1)
const CARD_BASE_WIDTH = 560;
const CARD_BASE_HEIGHT = 356;

export function FriendshipPassCard({ onContinue }: FriendshipPassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const available = Math.min(window.innerWidth - 32, CARD_BASE_WIDTH);
      return Math.max(0.5, Math.min(1, available / CARD_BASE_WIDTH));
    }
    return 1;
  });

  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Auto-calculate scale so the fixed-format card shrinks proportionally on smaller screens
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          const newScale = Math.min(1, containerWidth / CARD_BASE_WIDTH);
          setScale(newScale);
        }
      }
    };

    updateScale();

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
      setMousePos({ x, y });
      setIsHovered(true);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      setIsHovered(false);
      audioManager.playButtonSfx();

      await new Promise((resolve) => setTimeout(resolve, 150));

      // Export always captures the exact fixed 560x356 luxury card at 2.5x retina resolution
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#060814',
        width: CARD_BASE_WIDTH,
        height: CARD_BASE_HEIGHT,
        style: {
          transform: 'none',
          boxShadow: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `The-VIP-Friendship-Pass-${birthdayConfig.recipientName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      audioManager.playChimeCelebration();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('Không thể xuất ảnh tự động. Bạn có thể chụp màn hình chiếc thẻ này nhé!');
    } finally {
      setIsExporting(false);
    }
  };

  const tiltX = (isHovered && !isExporting) ? (mousePos.y - 0.5) * -12 : 0;
  const tiltY = (isHovered && !isExporting) ? (mousePos.x - 0.5) * 12 : 0;
  const glareX = mousePos.x * 100;
  const glareY = mousePos.y * 100;

  return (
    <div className="w-full max-w-[560px] mx-auto space-y-4">
      {/* Outer Scale Wrapper: Reserves exact scaled height to prevent layout shift */}
      <div 
        ref={containerRef}
        className="w-full flex justify-center items-start overflow-visible"
        style={{
          height: `${CARD_BASE_HEIGHT * scale}px`,
        }}
      >
        {/* Scaling Viewport: Scales the card uniformly while locking its format 100% */}
        <div
          style={{
            width: `${CARD_BASE_WIDTH}px`,
            height: `${CARD_BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
          className="shrink-0"
        >
          {/* 3D Perspective Wrapper */}
          <div 
            className="perspective-1000 w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {/* FIXED-FORMAT VIP FRIENDSHIP PASS CARD */}
            <div
              ref={cardRef}
              style={{
                width: `${CARD_BASE_WIDTH}px`,
                height: `${CARD_BASE_HEIGHT}px`,
                transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                background: 'radial-gradient(circle at 85% 15%, rgba(217, 119, 6, 0.22) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(147, 51, 234, 0.25) 0%, transparent 45%), linear-gradient(135deg, #0e1122 0%, #060814 100%)',
                boxShadow: isExporting ? 'none' : '0 0 35px rgba(250, 204, 21, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.9)',
              }}
              className="relative overflow-hidden rounded-[26px] p-6 border border-amber-300/70 select-none shadow-2xl flex flex-col justify-between box-border"
            >
              {/* Dynamic Light Sheen Glare */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: isHovered ? 0.35 : 0.15,
                  background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.8) 0%, rgba(250, 204, 21, 0.2) 30%, transparent 65%)`,
                }}
              />

              {/* Top Decorative Metallic Edge */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />

              {/* 1. CARD HEADER */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-amber-400/25">
                {/* Chip & NFC Contactless Icon */}
                <div className="flex items-center gap-3">
                  {/* Metallic Gold EMV Chip */}
                  <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 p-1.5 flex flex-col justify-between shadow-lg border border-amber-100/90 relative overflow-hidden shrink-0">
                    <div className="w-full h-1 bg-amber-800/40 rounded" />
                    <div className="flex justify-between w-full">
                      <div className="w-3 h-2 bg-amber-800/40 rounded-sm" />
                      <div className="w-3 h-2 bg-amber-800/40 rounded-sm" />
                    </div>
                    <div className="w-full h-1 bg-amber-800/40 rounded" />
                  </div>

                  {/* NFC Wave Icon */}
                  <div className="text-amber-300/70 rotate-90 shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/90 font-bold block leading-tight">
                      Galaxy Titanium Pass
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium tracking-wide block leading-tight">
                      Thẻ Đặc Quyền Vĩnh Viễn
                    </span>
                  </div>
                </div>

                {/* VIP Brand Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 text-yellow-300 border border-amber-400/50 shadow-sm font-heading tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    VIP PLATINUM
                  </span>
                </div>
              </div>

              {/* 2. EMBOSSED CARD NUMBER */}
              <div className="relative z-10 pt-2 pb-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block mb-0.5">
                  CARD NUMBER
                </span>
                <div 
                  className="text-2xl font-mono font-bold tracking-[0.22em] text-amber-200"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(250,204,21,0.4)',
                  }}
                >
                  0212 • 2006 • 8888 • 9999
                </div>
              </div>

              {/* 3. CARDHOLDER & VALID THRU */}
              <div className="relative z-10 flex items-end justify-between py-1.5 border-b border-white/10">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block leading-tight">
                    CARD HOLDER / CHỦ THẺ
                  </span>
                  <h2 
                    className="text-2xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 uppercase tracking-wider drop-shadow-md leading-tight"
                  >
                    {birthdayConfig.recipientName}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block leading-tight">
                    VALID THRU
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-300 tracking-wider block leading-tight">
                    FOREVER ✦ VĨNH CỬU
                  </span>
                </div>
              </div>

              {/* 4. FOUR PRIVILEGE BADGES (LOCKED 2x2 GRID ALWAYS) */}
              <div className="relative z-10 my-2 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold block leading-none">
                  ĐẶC QUYỀN HỘI VIÊN:
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Perk 1 */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-amber-400/20 min-w-0">
                    <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-yellow-200 block text-[11px] truncate">Vé Lẩu/Nướng Trọn Gói</span>
                      <span className="text-[9.5px] text-slate-300 leading-tight block truncate">Full topping bất cứ khi nào chú thèm</span>
                    </div>
                  </div>

                  {/* Perk 2 */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-amber-400/20 min-w-0">
                    <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-purple-200 block text-[11px] truncate">Kim Bài Miễn Càu Nhàu</span>
                      <span className="text-[9.5px] text-slate-300 leading-tight block truncate">Miễn cằn nhằn 365 ngày (mọi hoàn cảnh)</span>
                    </div>
                  </div>

                  {/* Perk 3 */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-amber-400/20 min-w-0">
                    <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-cyan-200 block text-[11px] truncate">Tổng Đài Tâm Sự 24/7</span>
                      <span className="text-[9.5px] text-slate-300 leading-tight block truncate">Lắng nghe &amp; chia sẻ 0đ cước phí</span>
                    </div>
                  </div>

                  {/* Perk 4 */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-amber-400/20 min-w-0">
                    <div className="p-1 rounded-lg bg-pink-500/20 text-pink-300 shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-pink-200 block text-[11px] truncate">Quỹ Năng Lượng Vũ Trụ</span>
                      <span className="text-[9.5px] text-slate-300 leading-tight block truncate">May mắn &amp; niềm vui gửi thẳng quỹ đạo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. CARD FOOTER */}
              <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
                <div className="space-y-0.5">
                  <span className="font-mono text-slate-400 text-[9px] block leading-none">
                    ISSUED BY: {birthdayConfig.senderName}
                  </span>
                  <span className="text-[8.5px] text-amber-300/80 font-mono block leading-none">
                    SERIES: GLX-MYLAM-02122006
                  </span>
                </div>

                {/* Holographic Security Seal & Barcode */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 border border-amber-300/40 text-[9px] text-yellow-300 font-mono font-bold shadow-inner">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>GENUINE FRIENDSHIP</span>
                  </div>

                  {/* Barcode */}
                  <div className="flex items-center gap-0.5 h-5 px-1.5 py-0.5 rounded bg-white/10">
                    <span className="w-0.5 h-full bg-slate-300" />
                    <span className="w-1 h-full bg-slate-300" />
                    <span className="w-0.5 h-full bg-slate-300" />
                    <span className="w-1.5 h-full bg-slate-300" />
                    <span className="w-0.5 h-full bg-slate-300" />
                    <span className="w-1 h-full bg-slate-300" />
                    <span className="w-0.5 h-full bg-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-xl glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          title="Lưu thẻ VIP dạng ảnh PNG chất lượng cao vào máy"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Đang xuất ảnh thẻ chất lượng cao...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-950 font-bold" />
              <span>Đã lưu ảnh thẻ VIP thành công!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Lưu thẻ quà tặng dạng ảnh</span>
            </>
          )}
        </button>

        <button
          onClick={onContinue}
          className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Đón nhận bó hoa 3D 🌸</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
