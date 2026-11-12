import React, { useState } from 'react';
import { SQU_BUS_ROUTES, BusRoute } from '../data/squData';
import { 
  Bus, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Eye, 
  X, 
  ChevronRight, 
  ArrowLeftRight, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export const BusScheduleView: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<'route_red' | 'route_green'>('route_red');
  const [genderTab, setGenderTab] = useState<'female' | 'male'>('female');
  const [femaleDirection, setFemaleDirection] = useState<'direct' | 'reverse'>('direct');
  const [showOriginalImage, setShowOriginalImage] = useState(false);

  const currentRoute = SQU_BUS_ROUTES.find((r) => r.id === selectedRouteId) || SQU_BUS_ROUTES[0];

  // Active stops determination
  let activeStops: string[] = [];
  let activeTitle = '';
  let commercialNote = '';

  if (genderTab === 'female') {
    if (femaleDirection === 'reverse' && currentRoute.femaleRoute.reverse) {
      activeStops = currentRoute.femaleRoute.reverse.stops;
      activeTitle = currentRoute.femaleRoute.reverse.title;
    } else {
      activeStops = currentRoute.femaleRoute.direct.stops;
      activeTitle = currentRoute.femaleRoute.direct.title;
    }
    commercialNote = currentRoute.femaleRoute.commercialNote || '';
  } else {
    activeStops = currentRoute.maleRoute.direct.stops;
    activeTitle = currentRoute.maleRoute.direct.title;
    commercialNote = currentRoute.maleRoute.commercialNote || '';
  }

  const isRed = currentRoute.id === 'route_red';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Super Prominent Action Bar to View the Original Schedule Sheet */}
      <div 
        onClick={() => setShowOriginalImage(true)}
        className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-4 sm:p-5 rounded-3xl shadow-xl border-2 border-amber-300/60 cursor-pointer transition-all active:scale-[0.99] flex flex-wrap items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition shadow-inner">
            📷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full text-amber-100">
                مستند رسمي معتمد
              </span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              اضغط هنا لمشاهدة صورة جدول المسارات المعتمدة 📄
            </h3>
            <p className="text-xs text-amber-100">
              صورة الورقة الأصلية للمسار الأحمر والأخضر (طالبات F وطلبة M)
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOriginalImage(true);
          }}
          className="bg-white hover:bg-amber-50 text-amber-950 font-black text-xs sm:text-sm py-2.5 px-5 rounded-2xl shadow-md transition flex items-center gap-2 group-hover:scale-105"
        >
          <Eye className="w-4 h-4 text-amber-700" />
          <span>فتح وتكبير الصورة الآن 🔍</span>
        </button>
      </div>

      {/* Header Banner */}
      <div 
        className={`text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden transition-colors duration-300 ${
          isRed 
            ? 'bg-gradient-to-r from-red-800 via-rose-900 to-red-950' 
            : 'bg-gradient-to-r from-emerald-800 via-green-900 to-teal-950'
        }`}
      >
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              <Bus className="w-4 h-4" />
              <span>حافلات النقل الداخلي لجامعة السلطان قابوس</span>
            </div>

            {/* Additional Direct Button */}
            <button
              onClick={() => setShowOriginalImage(true)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/40 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-2 backdrop-blur-sm shadow-sm"
              title="عرض صورة جدول المسارات المعتمد من الحافلة"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>مشاهدة الصورة الأصلية 📄</span>
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-black">
            جدول المسارات: {currentRoute.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>أوقات الانطلاق: <strong>07:14 ص - 04:35 م</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>مساران رسميان فقط: المسار الأحمر والمسار الأخضر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Route Selectors (Red and Green Only!) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Red Route Card */}
        <button
          onClick={() => {
            setSelectedRouteId('route_red');
            setFemaleDirection('direct');
          }}
          className={`p-5 rounded-3xl border text-right transition-all shadow-md relative overflow-hidden flex flex-col justify-between ${
            selectedRouteId === 'route_red'
              ? 'bg-rose-50/90 border-2 border-red-600 ring-4 ring-red-500/10'
              : 'bg-white hover:bg-rose-50/40 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></span>
              <span className="font-bold text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-lg">
                المسار 1
              </span>
            </div>
            {selectedRouteId === 'route_red' && (
              <span className="text-xs font-bold text-red-600">نشط الآن ✓</span>
            )}
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1">المسار الأحمر</h3>
          <p className="text-xs text-slate-500 font-sans mb-3">Red Route</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            مجمعات السكنات 1، 2، 3 • الحقوق • الطب • الزراعة • التربية • محطة الآداب
          </p>
        </button>

        {/* Green Route Card */}
        <button
          onClick={() => {
            setSelectedRouteId('route_green');
            setFemaleDirection('direct');
          }}
          className={`p-5 rounded-3xl border text-right transition-all shadow-md relative overflow-hidden flex flex-col justify-between ${
            selectedRouteId === 'route_green'
              ? 'bg-emerald-50/90 border-2 border-emerald-600 ring-4 ring-emerald-500/10'
              : 'bg-white hover:bg-emerald-50/40 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-600 shadow-sm"></span>
              <span className="font-bold text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                المسار 2
              </span>
            </div>
            {selectedRouteId === 'route_green' && (
              <span className="text-xs font-bold text-emerald-600">نشط الآن ✓</span>
            )}
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1">المسار الأخضر</h3>
          <p className="text-xs text-slate-500 font-sans mb-3">Green Route</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            مجمعات السكنات 4، 5 • العلوم • الهندسة • التحضيرية • الإدارة • الحقوق
          </p>
        </button>
      </div>

      {/* Gender (F / M) and Direction Switchers */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Gender Selector: طالبات (F) vs طلبة (M) */}
          <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold text-slate-700">
            <button
              onClick={() => setGenderTab('female')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                genderTab === 'female'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>👩‍🎓 طالبات (F)</span>
            </button>
            <button
              onClick={() => setGenderTab('male')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                genderTab === 'male'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>👨‍🎓 طلبة (M)</span>
            </button>
          </div>

          {/* If Female, Show Direct vs Reverse toggle */}
          {genderTab === 'female' && currentRoute.femaleRoute.reverse && (
            <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold text-slate-700">
              <button
                onClick={() => setFemaleDirection('direct')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  femaleDirection === 'direct'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                المسار المباشر
              </button>
              <button
                onClick={() => setFemaleDirection('reverse')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  femaleDirection === 'reverse'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>عكس المسار</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Active Title Banner */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentRoute.color }}
            ></span>
            <span className="text-sm font-bold text-slate-900">{activeTitle}</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            عدد المحطات: {activeStops.length}
          </span>
        </div>

        {/* Sequential Stops Roadmap */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            تسلسل محطات التوقف على المسار:
          </h4>

          <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:right-5 before:w-1 before:rounded-full before:bg-slate-200">
            {activeStops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === activeStops.length - 1;

              return (
                <div key={idx} className="relative flex items-center gap-4 group">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 z-10 shadow-md transition group-hover:scale-105"
                    style={{
                      backgroundColor: isFirst ? '#059669' : isLast ? '#dc2626' : currentRoute.color
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1 bg-slate-50 group-hover:bg-slate-100/90 p-3.5 rounded-2xl border border-slate-200/80 transition flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                      <span className="text-xs md:text-sm font-bold text-slate-800">
                        {stop}
                      </span>
                    </div>

                    {isFirst && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        نقطة الانطلاق (يبدأ من)
                      </span>
                    )}

                    {isLast && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        محطة الوصول الأخيرة
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commercial Center Special Notice from Paper */}
        {commercialNote && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-900">
                ملاحظة رسمية خاصة بالمركز التجاري:
              </span>
              <p className="leading-relaxed font-semibold">
                {commercialNote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Direct In-Page Photo Preview of the Laminated Sheet */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-base">📷</span>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                المستند الأصلي المعتمد (المعلق داخل الحافلة)
              </h4>
              <p className="text-xs text-slate-500">
                يمكنك الضغط على الصورة لتكبيرها ملء الشاشة
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOriginalImage(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>تكبير الصورة 🔍</span>
          </button>
        </div>

        <div 
          onClick={() => setShowOriginalImage(true)}
          className="cursor-pointer group relative rounded-2xl overflow-hidden border-2 border-dashed border-amber-200 bg-amber-50/30 flex justify-center items-center p-3 hover:bg-amber-50/60 transition"
        >
                   <img
            src="/assets/aistudio/bus_routes.jpeg"
            alt="جدول حافلات جامعة السلطان قابوس الأصلي - المسار الأحمر والمسار الأخضر"
            className="max-h-[460px] w-auto rounded-xl shadow-md group-hover:scale-[1.01] transition object-contain"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-2 backdrop-blur-[2px]">
            <Eye className="w-5 h-5 text-amber-300" />
            <span>اضغط هنا لتكبير وعرض الصورة بدقة عالية 🔍</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Original Laminated Schedule Sheet */}
      {showOriginalImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowOriginalImage(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">📄 الورقة الأصلية المعتمدة للحافلات</span>
                <span className="text-xs text-slate-400">• جامعة السلطان قابوس</span>
              </div>
              <button
                onClick={() => setShowOriginalImage(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-100 overflow-y-auto flex-1 flex justify-center items-center">
              <img
                src="/assets/aistudio/0978b639-016d-48eb-8504-7c10c782c240_dffa5bc5.jpeg"
                alt="ورقة مسارات حافلات جامعة السلطان قابوس - المسار الأحمر والمسار الأخضر"
                className="max-h-[75vh] w-auto rounded-2xl shadow-lg border border-slate-300 object-contain"
              />
            </div>

            <div className="p-3.5 bg-white border-t border-slate-200 text-center text-xs text-slate-600">
              الجدول الرسمي المعتمد للمسار الأحمر والأخضر (طالبات F / طلبة M) مع الملاحظة الميدانية
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
