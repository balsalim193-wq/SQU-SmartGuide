import React, { useState } from 'react';
import { CampusLocation } from '../data/squData';
import { 
  X, 
  MapPin, 
  ArrowRight, 
  CornerDownRight, 
  Layers, 
  Compass, 
  Accessibility, 
  CheckCircle2, 
  Share2, 
  Copy, 
  QrCode, 
  PhoneCall, 
  Clock, 
  Coffee,
  Sparkles,
  Navigation,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IndoorNavigationModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onSetStart: (loc: CampusLocation) => void;
  onSetDestination: (loc: CampusLocation) => void;
  onGenerateQr: (loc: CampusLocation) => void;
}

export const IndoorNavigationModal: React.FC<IndoorNavigationModalProps> = ({
  location,
  onClose,
  onSetStart,
  onSetDestination,
  onGenerateQr
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'indoor' | 'details' | 'facilities'>('indoor');

  if (!location) return null;

  const indoor = location.indoorDirections;

  const handleCopyDirections = () => {
    let text = `📍 توجيهات الوصول إلى: ${location.name}\n`;
    if (location.parentBuildingName) text += `المبنى: ${location.parentBuildingName}\n`;
    if (location.floor) text += `الطابق: ${location.floor}\n`;
    if (location.wing) text += `الجناح: ${location.wing}\n\n`;

    if (indoor) {
      text += `🚪 المدخل الموصى به: ${indoor.entrance}\n`;
      text += `🗺️ خطوات الوصول الداخلية:\n`;
      indoor.steps.forEach((step, idx) => {
        text += `${idx + 1}. ${step}\n`;
      });
      if (indoor.landmarks.length > 0) {
        text += `\n🔍 معالم قريبة: ${indoor.landmarks.join(' - ')}\n`;
      }
    }

    text += `\nتمت المشاركة عبر (دليل SQU الذكي 🎓)`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (e) {
      // fallback
    }
    setCopied(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with SQU Smart Guide Navy & Teal Palette */}
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
              alt="دليل SQU الذكي" 
              className="w-7 h-7 object-contain drop-shadow"
            />
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              {location.badge || 'دليل الحرم'}
            </span>
            {location.code && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold font-mono">
                {location.code}
              </span>
            )}
            {location.floor && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-300/25 text-xs text-amber-200 font-medium">
                {location.floor}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-black mb-1">{location.name}</h2>
          <p className="text-xs md:text-sm text-teal-100/90 font-sans tracking-wide">
            {location.nameEn}
          </p>
          {location.parentBuildingName && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>المبنى الرئيسي: {location.parentBuildingName}</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-2 text-xs font-bold text-slate-600 gap-4">
          <button
            onClick={() => setActiveTab('indoor')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'indoor'
                ? 'border-[#0D9488] text-[#082F49]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#0D9488]" />
            <span>التوجيه الداخلي الدقيق (الطابق والممرات)</span>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'details'
                ? 'border-[#0D9488] text-[#082F49]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>معلومات المكان</span>
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'facilities'
                ? 'border-[#0D9488] text-[#082F49]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>المرافق القريبة وسهولة الوصول</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {activeTab === 'indoor' && (
            <>
              {indoor ? (
                <div className="space-y-6">
                  {/* Indoor Descriptive Banner if hasMapPin is false */}
                  {location.hasMapPin === false && (
                    <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-purple-900 font-medium animate-in fade-in">
                      <span className="p-1.5 rounded-xl bg-purple-200 text-purple-800 text-sm flex-shrink-0">📝</span>
                      <div>
                        <strong className="block text-purple-950 font-bold">موقع داخلي بالكلية (إرشاد وصفي دقيق)</strong>
                        <span>تم اعتماد الوصف والخطوات الداخلية الدقيقة لهذا المرفق داخل مبنى الكلية بدون دبوس خارجي لضمان دقة الإرشاد.</span>
                      </div>
                    </div>
                  )}

                  {/* Entrance Highlight */}
                  <div className="bg-teal-50/80 border border-teal-100 p-4 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#082F49] text-white flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        المدخل الموصى به لدخول المبنى
                      </h4>
                      <p className="text-sm font-bold text-[#082F49]">
                        {indoor.entrance}
                      </p>
                      <span className="text-xs text-slate-600 block mt-1">
                        مستوى الطابق: <strong className="text-slate-900">{indoor.floorLevel}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Floor Level Schematic Indicator */}
                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#0D9488]" />
                      <span>مخطط مستويات الطوابق والموقع النسبي</span>
                    </h4>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className={`p-3 rounded-xl border ${location.floor?.includes('أرضي') ? 'bg-amber-100 border-amber-300 font-bold text-amber-900 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <span>الطابق الأرضي (G)</span>
                        {location.floor?.includes('أرضي') && <div className="text-[11px] text-[#0D9488] font-bold mt-1">📍 هنا القاعة</div>}
                      </div>
                      <div className={`p-3 rounded-xl border ${location.floor?.includes('الأول') ? 'bg-amber-100 border-amber-300 font-bold text-amber-900 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <span>الطابق الأول (1)</span>
                        {location.floor?.includes('الأول') && <div className="text-[11px] text-[#0D9488] font-bold mt-1">📍 هنا القاعة</div>}
                      </div>
                      <div className={`p-3 rounded-xl border ${location.floor?.includes('الثاني') ? 'bg-amber-100 border-amber-300 font-bold text-amber-900 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <span>الطابق الثاني (2)</span>
                        {location.floor?.includes('الثاني') && <div className="text-[11px] text-[#0D9488] font-bold mt-1">📍 هنا القاعة</div>}
                      </div>
                    </div>

                    {location.wing && (
                      <div className="mt-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 flex items-center gap-2">
                        <span className="font-bold text-slate-900">الجناح / القسم:</span>
                        <span>{location.wing}</span>
                      </div>
                    )}
                  </div>

                  {/* Step-by-step guidance cards */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4 text-[#0D9488]" />
                      <span>خطوات الوصول خطوة بخطوة من البوابة:</span>
                    </h4>

                    <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:right-4 before:w-0.5 before:bg-slate-200">
                      {indoor.steps.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 group">
                          <div className="w-8 h-8 rounded-full bg-[#082F49] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:bg-[#0D9488] transition">
                            {idx + 1}
                          </div>
                          <div className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-700 group-hover:border-teal-200 transition">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Landmarks */}
                  {indoor.landmarks.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 mb-2">معالم وعلامات دلالية بجوار القاعة:</h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        {indoor.landmarks.map((lm, i) => (
                          <li key={i}>{lm}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">مبنى رئيسي مفتوح</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    هذا الموقع عبارة عن مبنى كامل في الحرم الجامعي، يمكنك التوجه إليه مباشرة عبر الخريطة والولوج من المدخل الخارجي.
                  </p>
                  <button
                    onClick={() => onSetDestination(location)}
                    className="bg-[#082F49] hover:bg-[#062438] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition inline-flex items-center gap-2 shadow-md border border-teal-600/30"
                  >
                    <span>وجهني إلى المبنى على الخريطة</span>
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 mb-1">عن هذا المكان</h4>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                  {location.description}
                </p>
              </div>

              {location.workingHours && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <Clock className="w-4 h-4 text-[#0D9488]" />
                  <div>
                    <span className="font-bold text-slate-900 block">أوقات العمل / الدوام:</span>
                    <span className="text-slate-600">{location.workingHours}</span>
                  </div>
                </div>
              )}

              {location.phone && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">هاتف الاستعلامات:</span>
                      <span className="text-slate-600 font-mono" dir="ltr">{location.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${location.phone.replace(/\s+/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    اتصال
                  </a>
                </div>
              )}

              {location.tags && location.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">الكلمات الدلالية</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {location.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Accessibility className="w-4 h-4 text-blue-600" />
                    <span>سهولة الوصول والمصاعد</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {indoor?.wheelchairAccessible
                      ? '✅ مهيأ بالكامل للكراسي المتحركة مع ممرات منحدرة ومصاعد واسعة.'
                      : 'ℹ️ يتطلب صعود درجات - يمكنك طلب المساعدة من حرس المبنى.'}
                  </p>
                  {indoor?.hasElevator && (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-semibold">
                      متوفر مصعد كهربائي
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>المصليات ودورات المياه</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {indoor?.nearestPrayerRoom || 'متوفر مصلى مجهز في الطابق الأرضي للمبنى.'}
                  </p>
                  <p className="text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                    {indoor?.nearestRestroom || 'دورات المياه متوفرة على جانبي كل طابق.'}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <p className="text-xs text-amber-900">
                  هل تحتاج استراحة؟ أقرب كافيه ومطعم يقعان على بعد دقيقتين سيراً على الأقدام في بهو الكلية أو مجمع المطاعم.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDirections}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">تم النسخ للواتساب!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#0D9488]" />
                  <span>نسخ التوجيهات للواتساب</span>
                </>
              )}
            </button>

            <button
              onClick={() => onGenerateQr(location)}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              title="طباعة أو تنزيل ملصق باركود لهذا المكان"
            >
              <QrCode className="w-4 h-4 text-[#0D9488]" />
              <span>ملصق الباركود QR</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSetStart(location);
                onClose();
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition"
            >
              🚩 اجعلها نقطة انطلاقي
            </button>

            <button
              onClick={() => {
                onSetDestination(location);
                onClose();
              }}
              className="bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>توجه إلى هنا</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
