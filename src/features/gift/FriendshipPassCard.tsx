import { useRef, useState } from 'react';
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

export function FriendshipPassCard({ onContinue }: FriendshipPassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      audioManager.playButtonSfx();

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#070817',
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

  // 3D Tilt calculation
  const tiltX = isHovered ? (mousePos.y - 0.5) * -14 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 14 : 0;
  const glareX = mousePos.x * 100;
  const glareY = mousePos.y * 100;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* 3D Perspective Card Wrapper */}
      <div 
        className="perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={cardRef}
          style={{
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
            background: 'radial-gradient(circle at 85% 15%, rgba(217, 119, 6, 0.22) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(147, 51, 234, 0.25) 0%, transparent 45%), linear-gradient(135deg, #0e1122 0%, #060814 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(250, 204, 21, 0.3)',
          }}
          className="relative overflow-hidden rounded-[26px] p-6 sm:p-7 border-2 border-amber-300/80 select-none shadow-2xl"
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

          {/* CARD HEADER */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-amber-400/25">
            {/* Chip & NFC Contactless Icon */}
            <div className="flex items-center gap-3">
              {/* Ultra-realistic Metallic Gold EMV Chip */}
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 p-1.5 flex flex-col justify-between shadow-lg border border-amber-100/90 relative overflow-hidden">
                <div className="w-full h-1 bg-amber-800/40 rounded" />
                <div className="flex justify-between w-full">
                  <div className="w-3 h-2 bg-amber-800/40 rounded-sm" />
                  <div className="w-3 h-2 bg-amber-800/40 rounded-sm" />
                </div>
                <div className="w-full h-1 bg-amber-800/40 rounded" />
              </div>

              {/* NFC WiFi Wave Icon */}
              <div className="text-amber-300/70 rotate-90">
                <Wifi className="w-4 h-4" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/90 font-bold block">
                  Galaxy Titanium Pass
                </span>
                <span className="text-[11px] text-slate-300 font-medium tracking-wide">
                  Thẻ Đặc Quyền Vĩnh Viễn
                </span>
              </div>
            </div>

            {/* Top Right Luxury Brand Badge */}
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 text-yellow-300 border border-amber-400/50 shadow-sm font-heading tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                VIP PLATINUM
              </span>
            </div>
          </div>

          {/* EMBOSSED CARD NUMBER */}
          <div className="relative z-10 pt-4 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
              CARD NUMBER
            </span>
            <div 
              className="text-lg sm:text-2xl font-mono font-bold tracking-[0.22em] text-amber-200"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(250,204,21,0.4)',
              }}
            >
              0212 • 2006 • 8888 • 9999
            </div>
          </div>

          {/* CARDHOLDER & VALIDITY */}
          <div className="relative z-10 flex items-end justify-between py-2 border-b border-white/10">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                CARD HOLDER / CHỦ THẺ
              </span>
              <h2 
                className="text-xl sm:text-2xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 uppercase tracking-wider drop-shadow-md"
              >
                {birthdayConfig.recipientName}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                VALID THRU
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 tracking-wider">
                FOREVER ✦ VĨNH CỬU
              </span>
            </div>
          </div>

          {/* 4 LUXURY PRIVILEGE BADGES (2x2 Grid) */}
          <div className="relative z-10 my-3.5 space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold block">
              ĐẶC QUYỀN HỘI VIÊN:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Perk 1 */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-amber-400/20">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-yellow-200 block text-[11px]">Vé Lẩu/Nướng Trọn Gói</span>
                  <span className="text-[10px] text-slate-300 leading-tight block">Full topping bất cứ khi nào chú thèm</span>
                </div>
              </div>

              {/* Perk 2 */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-amber-400/20">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-purple-200 block text-[11px]">Kim Bài Miễn Càu Nhàu</span>
                  <span className="text-[10px] text-slate-300 leading-tight block">Miễn cằn nhằn 365 ngày (mọi hoàn cảnh)</span>
                </div>
              </div>

              {/* Perk 3 */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-amber-400/20">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-cyan-200 block text-[11px]">Tài Xế &amp; Tổng Đài 24/7</span>
                  <span className="text-[10px] text-slate-300 leading-tight block">Xe đưa đón kiêm tâm sự 0đ cước</span>
                </div>
              </div>

              {/* Perk 4 */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-amber-400/20">
                <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-pink-200 block text-[11px]">Quỹ Năng Lượng Vũ Trụ</span>
                  <span className="text-[10px] text-slate-300 leading-tight block">May mắn &amp; niềm vui gửi thẳng quỹ đạo</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD FOOTER */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
            <div className="space-y-0.5">
              <span className="font-mono text-slate-400 text-[9px] block">
                ISSUED BY: {birthdayConfig.senderName}
              </span>
              <span className="text-[9px] text-amber-300/80 font-mono">
                SERIES: GLX-MYLAM-02122006
              </span>
            </div>

            {/* Holographic Security Seal */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 border border-amber-300/40 text-[9px] text-yellow-300 font-mono font-bold shadow-inner">
                <Award className="w-3 h-3 text-amber-300" />
                <span>GENUINE FRIENDSHIP</span>
              </div>

              {/* Barcode */}
              <div className="flex items-center gap-0.5 h-6 px-1.5 py-0.5 rounded bg-white/10">
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
          <span>Mở thư chúc mừng</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
