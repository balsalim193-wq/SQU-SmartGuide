import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CampusLocation } from '../data/squData';
import { 
  QrCode, 
  Printer, 
  Download, 
  Sparkles, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRCodeHubProps {
  locations: CampusLocation[];
  initialLocation?: CampusLocation | null;
  onSimulateScan: (location: CampusLocation) => void;
  onClose?: () => void;
}

export const QRCodeHub: React.FC<QRCodeHubProps> = ({
  locations,
  initialLocation,
  onSimulateScan,
  onClose
}) => {
  const [activeMode, setActiveMode] = useState<'generate' | 'scan'>('generate');
  const [selectedLocId, setSelectedLocId] = useState<string>(
    initialLocation?.id || locations[0]?.id || ''
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [stickerNote, setStickerNote] = useState<string>('امسح الباركود بهاتفك لفتح الدليل والتوجيه الداخلي فوراً');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const selectedLocation = locations.find((l) => l.id === selectedLocId) || locations[0];

  // Generate QR Code data URL whenever selected location changes
  useEffect(() => {
    if (!selectedLocation) return;

    // Generate link that includes location ID
    const currentUrl = window.location.origin + window.location.pathname;
    const targetLink = `${currentUrl}?spot=${selectedLocation.id}&start=true`;

    QRCode.toDataURL(targetLink, {
      width: 320,
      margin: 2,
      color: {
        dark: '#082F49', // SQU Smart Guide Navy
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR', err));
  }, [selectedLocation]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `SQU-QR-${selectedLocation.name.replace(/\s+/g, '-')}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleTestScanSpot = (loc: CampusLocation) => {
    setScanMessage(`تم مسح الباركود بنجاح: أنت الآن في "${loc.name}"!`);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      onSimulateScan(loc);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-50 text-[#082F49]">
              <QrCode className="w-5 h-5 text-[#0D9488]" />
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              نظام الباركود الذكي (QR Code) للحرم الجامعي
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            توليد ملصقات باركود رسمية لتعليقها في ممرات وكليات جامعة السلطان قابوس، أو مسح الباركود لبدء الملاحة.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveMode('generate')}
            className={`px-4 py-2 rounded-xl transition ${
              activeMode === 'generate'
                ? 'bg-[#082F49] text-white shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            مولّد وملصقات الباركود
          </button>
          <button
            onClick={() => setActiveMode('scan')}
            className={`px-4 py-2 rounded-xl transition ${
              activeMode === 'scan'
                ? 'bg-[#082F49] text-white shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            تجربة ومسح الباركود
          </button>
        </div>
      </div>

      {activeMode === 'generate' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
          {/* Controls Form (Left Column on RTL) */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر موقعاً في الجامعة لتوليد الباركود له:
              </label>
              <select
                value={selectedLocId}
                onChange={(e) => setSelectedLocId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-[#0D9488]"
              >
                <optgroup label="الكليات">
                  {locations
                    .filter((l) => l.category === 'college')
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        🎓 {l.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="القاعات والمدرجات">
                  {locations
                    .filter((l) => l.category === 'hall')
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        🚪 {l.name} ({l.parentBuildingName || ''})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="المكتبات والمراكز والمستشفى">
                  {locations
                    .filter((l) => ['library', 'service', 'hospital', 'dining', 'sports'].includes(l.category))
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        📍 {l.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                عبارة التوجيه على الملصق:
              </label>
              <input
                type="text"
                value={stickerNote}
                onChange={(e) => setStickerNote(e.target.value)}
                placeholder="امسح الباركود بهاتفك..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-[#0D9488]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-[#082F49] space-y-1">
              <span className="font-bold block">💡 فكرة الاستخدام الميداني:</span>
              <p className="leading-relaxed">
                يتم طباعة هذا الملصق ولصقه عند مداخل الكليات والأعمدة والقاعات. عندما يوجه الطالب كاميرا هاتفه نحوه، يفتح الموقع تلقائياً محدداً نقطة تواجده الحالية مع عرض أقرب القاعات والممرات!
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold py-2.5 px-4 rounded-2xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الملصق (A4 / ملصق)</span>
              </button>

              <button
                onClick={handleDownload}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-2xl transition flex items-center gap-1"
                title="تنزيل الباركود كصورة"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Poster Mockup (Right Column on RTL) */}
          <div className="md:col-span-7 flex justify-center items-center">
            <div 
              id="squ-printable-poster"
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#082F49] text-center relative overflow-hidden"
            >
              {/* Gold Top Banner */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#082F49] via-[#0D9488] to-[#D4AF37]"></div>

              {/* Header SQU Emblem Title */}
              <div className="pt-2 mb-3">
                <img 
                  src="/assets/aistudio/squ_emblem.png" 
                  alt="شعار دليل SQU الذكي" 
                  className="w-12 h-12 mx-auto mb-1 object-contain drop-shadow"
                />
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                  سلطنة عُمان • جامعة السلطان قابوس
                </span>
                <h3 className="text-lg font-black text-[#082F49] tracking-tight">
                  دَليل SQU الذكي 🎓
                </h3>
              </div>

              {/* Location Badge */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl py-2 px-3 mb-4">
                <span className="text-[10px] font-bold text-[#082F49] uppercase block">
                  📍 أنت الآن في:
                </span>
                <span className="text-base font-black text-slate-900 block mt-0.5">
                  {selectedLocation.name}
                </span>
                {selectedLocation.parentBuildingName && (
                  <span className="text-xs text-slate-500 block">
                    {selectedLocation.parentBuildingName}
                  </span>
                )}
                {selectedLocation.floor && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {selectedLocation.floor}
                  </span>
                )}
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200 inline-block mb-3">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="SQU Location QR"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400">
                    جاري توليد الباركود...
                  </div>
                )}
              </div>

              {/* Instructions */}
              <p className="text-xs font-bold text-slate-800 leading-relaxed max-w-xs mx-auto mb-2">
                {stickerNote}
              </p>

              <div className="text-[10px] text-slate-600 font-medium border-t border-slate-100 pt-2 flex items-center justify-center gap-1">
                <span>مسارات المشي • القاعات والمدرجات • التوجيه الداخلي</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scan / Test Simulation View */
        <div className="mt-6 space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-3xl border border-teal-100">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0D9488]" />
              <span>محاكاة مسح الباركودات الميدانية بالحرم الجامعي</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
              اضغط على أي من المواقع أدناه لمحاكاة قيامك بمسح ملصق الباركود المعلق في ذلك المكان بالجامعة:
            </p>

            {scanMessage && (
              <div className="mb-4 p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{scanMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'col_engineering', label: 'باركود مدخل كلية الهندسة', icon: '🎓', note: 'الممر الغربي' },
                { id: 'lib_main', label: 'باركود بهو المكتبة الرئيسية', icon: '📚', note: 'بجانب مقهى Steps' },
                { id: 'hall_alfaham', label: 'باركود مدرج الفهم', icon: '🏛️', note: 'المركز الثقافي - قرب Dune' },
                { id: 'col_science', label: 'باركود بهو كلية العلوم', icon: '🔬', note: 'أمام مدرج الفراهيدي وميراس' },
                { id: 'col_ceps', label: 'باركود كلية الاقتصاد CEPS', icon: '📊', note: 'المدخل الرئيسي' },
                { id: 'dine_student_center', label: 'باركود مجمع المطاعم والخدمات', icon: '☕', note: 'صالة الطلاب' }
              ].map((spot) => {
                const loc = locations.find((l) => l.id === spot.id);
                if (!loc) return null;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleTestScanSpot(loc)}
                    className="p-3.5 bg-white hover:bg-teal-50/60 rounded-2xl border border-slate-200/90 hover:border-[#0D9488] text-right transition shadow-sm hover:shadow-md group flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 rounded-xl bg-slate-50 group-hover:bg-teal-100 transition">
                      {spot.icon}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#082F49] transition">
                        {spot.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{spot.note}</p>
                      <span className="text-[10px] text-teal-700 font-bold block mt-1">
                        اضغط لمحاكاة المسح 📲
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>كاميرا الهاتف العادية قادرة على قراءة الرمز وفتح الموقع مباشرة بدون الحاجة لتثبيت أي تطبيق خاص!</span>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition"
              >
                العودة للخريطة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
