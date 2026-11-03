import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Sparkles, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Check } from 'lucide-react';
import { birthdayConfig } from '@/config/birthday.config';
import { audioManager } from '@/utils/audioManager';

interface FriendshipPassCardProps {
  onContinue: () => void;
}

export function FriendshipPassCard({ onContinue }: FriendshipPassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      audioManager.playButtonSfx();

      // Small delay to ensure any fonts or styles settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // Crisp high-DPI export
        backgroundColor: '#070817',
      });

      const link = document.createElement('a');
      link.download = `VIP-Friendship-Pass-${birthdayConfig.recipientName.replace(/\s+/g, '-')}.png`;
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

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* The Physical VIP Pass Card to Export */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-400/60 transition-all duration-300"
        style={{
          background: 'radial-gradient(ellipse at top left, #2E1065 0%, #0F172A 50%, #070817 100%)',
          boxShadow: '0 0 35px rgba(250, 204, 21, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Holographic foil sheen overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(250,204,21,0.3) 60%, transparent 100%)',
          }}
        />

        {/* Ambient Corner Decors */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-amber-400/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* EMV Microchip graphic */}
              <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 p-1 flex flex-col justify-between shadow-md border border-amber-200">
                <div className="w-full h-1 bg-amber-700/40 rounded-sm" />
                <div className="flex justify-between">
                  <div className="w-2.5 h-1.5 bg-amber-700/40 rounded-sm" />
                  <div className="w-2.5 h-1.5 bg-amber-700/40 rounded-sm" />
                </div>
                <div className="w-full h-1 bg-amber-700/40 rounded-sm" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 block font-bold">
                  Galaxy Friendship Card
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Hội viên thân thiết độc quyền
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-yellow-300 border border-amber-400/50 shadow-sm">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              LIFETIME PASS
            </span>
          </div>
        </div>

        {/* Card Title & Holder */}
        <div className="relative z-10 my-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              CARD HOLDER / CHỦ THẺ
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-semibold">
              ✦ NO. 0212-2006-8888 ✦
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 tracking-wide drop-shadow-sm uppercase">
            {birthdayConfig.recipientName}
          </h2>
          <p className="text-[11px] text-purple-200 italic leading-relaxed pt-1">
            “{birthdayConfig.gift.message}”
          </p>
        </div>

        {/* Special Benefits List */}
        <div className="relative z-10 bg-slate-950/60 rounded-2xl p-4 border border-white/10 space-y-2.5 my-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-yellow-300 tracking-wider flex items-center gap-1.5 font-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              {birthdayConfig.gift.rewardTitle}
            </span>
            <span className="text-[9px] font-mono text-slate-400">HẠN: VÔ THỜI HẠN</span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-200">
            {birthdayConfig.gift.rewardDetails.map((detail: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer Bar */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
          <div className="space-y-0.5">
            <span className="font-mono text-cyan-400 block font-semibold">
              ISSUED: {birthdayConfig.birthdayDate}
            </span>
            <span className="text-slate-400">
              Ký tên: {birthdayConfig.senderName}
            </span>
          </div>

          {/* Barcode representation */}
          <div className="flex items-center gap-0.5 h-5 px-2 py-0.5 rounded bg-white/10">
            <span className="w-0.5 h-full bg-slate-300" />
            <span className="w-1 h-full bg-slate-300" />
            <span className="w-0.5 h-full bg-slate-300" />
            <span className="w-1.5 h-full bg-slate-300" />
            <span className="w-0.5 h-full bg-slate-300" />
            <span className="w-1 h-full bg-slate-300" />
            <span className="w-0.5 h-full bg-slate-300" />
            <span className="w-1 h-full bg-slate-300" />
          </div>
        </div>

        <p className="relative z-10 text-[9px] text-slate-500 italic text-center pt-2">
          {birthdayConfig.gift.ps}
        </p>
      </div>

      {/* Action Buttons: Download as Image + Continue */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          title="Lưu thẻ VIP dạng ảnh PNG vào máy"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Đang tạo ảnh chất lượng cao...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-900 font-bold" />
              <span>Đã lưu ảnh thẻ thành công!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Lưu thẻ VIP dạng ảnh</span>
            </>
          )}
        </button>

        <button
          onClick={onContinue}
          className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Mở thư chúc mừng</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
