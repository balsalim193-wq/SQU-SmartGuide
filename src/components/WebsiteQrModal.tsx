import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WebsiteQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebsiteQrModal: React.FC<WebsiteQrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  // The actual live URL of the application
  const siteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}` 
    : 'https://squ-guide.app';

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(siteUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#082F49', // Deep navy/petrol from the logo
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => console.error('Failed to generate website QR:', err));
  }, [isOpen, siteUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(siteUrl).catch(() => {});
      }
    } catch (e) {
      // fallback
    }
    setCopied(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `دليل_SQU_الذكي_باركود_الموقع.png`;
    link.href = qrDataUrl;
    link.click();
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo Theme (Petrol Navy + Teal + Gold) */}
        <div className="relative bg-gradient-to-r from-[#082F49] via-[#0E4F63] to-[#0A3A4A] text-white p-6 pb-5 border-b-2 border-[#D4AF37]">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-lg border border-teal-200/60 flex items-center justify-center flex-shrink-0">
              <img 
                src="/assets/aistudio/squ_emblem.png" 
                alt="شعار دليل SQU الذكي" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-300">📱 باركود الوصول السريع</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                دليل <span className="text-amber-300">SQU</span> الذكي
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Printable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-center flex-1">
          {/* Official Sticker Preview Card */}
          <div 
            ref={printAreaRef}
            className="bg-gradient-to-b from-slate-50 via-white to-teal-50/30 p-6 rounded-3xl border-2 border-teal-600/30 shadow-lg relative space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <img 
                src="/assets/aistudio/squ_emblem.png" 
                alt="شعار دليل SQU الذكي" 
                className="w-14 h-14 object-contain"
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#082F49] tracking-tight">
                دَليل <span className="text-[#0D9488]">SQU</span> الذكي 🎓
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                الدليل والخريطة التفاعلية لجامعة السلطان قابوس
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative inline-block p-4 bg-white rounded-3xl shadow-md border-2 border-[#D4AF37]/40 my-2">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="باركود موقع دليل SQU الذكي"
                  className="w-56 h-56 mx-auto rounded-2xl" 
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                  جاري توليد الباركود...
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-teal-200 flex items-center justify-center">
                  <img src="/assets/aistudio/squ_emblem.png" alt="icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="bg-[#082F49] text-white py-2 px-4 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>امسح بكاميرا الهاتف للدخول فوراً للموقع</span>
            </div>

            <div className="text-[11px] text-slate-500 pt-1">
              الكليات • القاعات والمدرجات • الاستراحات • حافلات الجامعة • الكوفيهات
            </div>
          </div>

          {/* URL Box & Copy */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between gap-2 text-right">
            <span className="text-xs font-mono text-slate-600 truncate dir-ltr select-all">
              {siteUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="bg-white hover:bg-teal-50 text-[#082F49] hover:text-[#0D9488] border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 flex-shrink-0 shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadQr}
              className="bg-[#082F49] hover:bg-[#0c3c5c] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>تنزيل الباركود (PNG)</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
              title="طباعة ملصق بحجم ورقة كاملة A4 للتعليق في الكليات والمواقف"
            >
              <Printer className="w-4 h-4 text-[#0D9488]" />
              <span>طباعة ملصق رسمي</span>
            </button>
          </div>

          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0D9488] hover:text-[#082F49] font-bold inline-flex items-center gap-1"
          >
            <span>فتح الرابط</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
