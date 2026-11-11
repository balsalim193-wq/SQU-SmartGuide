import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Download, 
  Smartphone, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowDown, 
  PlusSquare,
  ShieldCheck,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import confetti from 'canvas-confetti';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Primary shareable app link
  const appUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://ais-pre-qy7ccuwdzlkwlyi6j3ahxz-721724458141.europe-west1.run.app';

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(appUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#082F49',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate install QR:', err));
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(appUrl).catch(() => {});
      }
    } catch (e) {}
    setCopied(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      onClose();
    }
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `🎓 تطبيق ودليل SQU الذكي لجامعة السلطان قابوس:\nاستكشف كليات وقاعات الجامعة والمسارات والكوفيهات مع التوجيه الداخلي الدقيق!\n\nرابط الدخول والتنزيل:\n${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#082F49] via-[#0A3A5C] to-[#0D9488] text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/assets/aistudio/squ_emblem.png" 
              alt="شعار دليل SQU الذكي" 
              className="w-8 h-8 object-contain drop-shadow" 
            />
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              تطبيق الويب التفاعلي PWA 📲
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black mb-1">
            رابط وتنزيل «دليل SQU الذكي»
          </h2>
          <p className="text-xs md:text-sm text-teal-100/90 font-sans tracking-wide">
            تثبيت التطبيق مباشرة على هاتفك أو مشاركة الرابط مع طلبة ومنتسبي الجامعة
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Main Direct Web Link Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              🔗 الرابط المباشر للموقع:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#082F49] hover:bg-[#062438] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Install Banner (Android / PC) */}
          {isInstallable && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Download className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">جاهز للتنزيل الفوري!</h4>
                  <p className="text-xs text-slate-600">تثبيت التطبيق على جهازك ليعمل بدون متصفح</p>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md flex items-center gap-1.5 flex-shrink-0"
              >
                <span>تثبيت التطبيق الآن 📥</span>
              </button>
            </div>
          )}

          {/* Already Installed state */}
          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>التطبيق مثبت ويعمل حالياً بنجاح كتطبيق أصلي على جهازك!</span>
            </div>
          )}

          {/* Installation Steps for iPhone / iOS Safari */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-slate-200 text-slate-700">
                <Smartphone className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                طريقة تنزيل وتثبيت التطبيق على الآيفون (iOS Safari):
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                  1
                </div>
                <p className="font-semibold text-slate-900">افتح الرابط في Safari</p>
                <p className="text-[11px] text-slate-500">ثم اضغط زر المشاركة (Share ⎋) في الشريط السفلي.</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                  2
                </div>
                <p className="font-semibold text-slate-900">إضافة للشاشة الرئيسية</p>
                <p className="text-[11px] text-slate-500">انزل لأسفل القائمة واختر (Add to Home Screen ➕).</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white font-bold text-[11px] flex items-center justify-center">
                  3
                </div>
                <p className="font-semibold text-[#082F49]">أصبح لديك تطبيق جاهز!</p>
                <p className="text-[11px] text-slate-500">سيظهر شعار دليل SQU الذكي على شاشة هاتفك الرئيسية.</p>
              </div>
            </div>
          </div>

          {/* QR Code Quick Scan for Mobile Camera */}
          <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="رابط تنزيل الموقع" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 bg-slate-100 animate-pulse rounded-xl" />
              )}
            </div>
            <div className="space-y-1.5 text-center sm:text-right">
              <span className="text-[11px] font-bold text-[#0D9488] block">📲 افتح بالكاميرا فوراً</span>
              <h4 className="text-sm font-bold text-slate-900">مسح الباركود بهاتف آخر</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                وجه كاميرا هاتفك العادية نحو الرمز لفتح الموقع وتثبيته مباشرة دون الحاجة لكتابة الرابط.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handleShareWhatsapp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة الرابط في الواتساب 💬</span>
          </button>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>فتح في نافذة كاملة</span>
          </a>
        </div>
      </div>
    </div>
  );
};
