import React, { useState } from 'react';
import { 
  CampusLocation, 
  calculateDistanceMeters, 
  estimateWalkMinutes 
} from '../data/squData';
import { 
  Navigation, 
  ArrowLeftRight, 
  MapPin, 
  Footprints, 
  Sparkles, 
  CornerDownRight, 
  Accessibility, 
  Building2,
  Clock,
  Compass,
  X
} from 'lucide-react';

interface RoutePlannerProps {
  locations: CampusLocation[];
  startLocation: CampusLocation | null;
  endLocation: CampusLocation | null;
  onSetStart: (loc: CampusLocation | null) => void;
  onSetEnd: (loc: CampusLocation | null) => void;
  onOpenIndoorGuide: (loc: CampusLocation) => void;
  onFocusMap: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  locations,
  startLocation,
  endLocation,
  onSetStart,
  onSetEnd,
  onOpenIndoorGuide,
  onFocusMap
}) => {
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const handleSwap = () => {
    const temp = startLocation;
    onSetStart(endLocation);
    onSetEnd(temp);
  };

  const getEffectiveCoords = (loc: CampusLocation | null): [number, number] | null => {
    if (!loc) return null;
    if (loc.coordinates && loc.hasMapPin !== false) return loc.coordinates;
    if (loc.parentBuildingId) {
      const parent = locations.find((l) => l.id === loc.parentBuildingId);
      if (parent && parent.coordinates) return parent.coordinates;
    }
    return loc.coordinates || null;
  };

  const startCoords = getEffectiveCoords(startLocation);
  const endCoords = getEffectiveCoords(endLocation);

  const distance = (startCoords && endCoords)
    ? calculateDistanceMeters(startCoords, endCoords)
    : null;
  const walkMinutes = distance ? estimateWalkMinutes(distance) : null;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-100 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-[#8A1538]">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">مخطط المسار والملاحة في الحرم</h3>
            <p className="text-xs text-slate-500">من مكانك الحالي إلى أي قاعة أو مبنى</p>
          </div>
        </div>

        {(startLocation || endLocation) && (
          <button
            onClick={() => {
              onSetStart(null);
              onSetEnd(null);
            }}
            className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>مسح التحديد</span>
          </button>
        )}
      </div>

      {/* Origin and Destination Pickers */}
      <div className="space-y-3 relative">
        {/* Origin (Start) */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/90 focus-within:border-[#8A1538] transition">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            A
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
              نقطة الانطلاق (أين أنت الآن؟):
            </label>
            <select
              value={startLocation?.id || ''}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value) || null;
                onSetStart(loc);
              }}
              className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">-- اختر نقطة انطلاقك (أو امسح الباركود) --</option>
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
                      🚪 {l.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="المرافق والمكتبات">
                {locations
                  .filter((l) => ['library', 'service', 'hospital', 'dining', 'sports', 'bus'].includes(l.category))
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      📍 {l.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <button
            onClick={handleSwap}
            disabled={!startLocation && !endLocation}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#8A1538] hover:border-rose-200 shadow-sm transition active:scale-95 disabled:opacity-40"
            title="تبديل نقطتي الانطلاق والوجهة"
          >
            <ArrowLeftRight className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* Destination (End) */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/90 focus-within:border-[#8A1538] transition">
          <div className="w-7 h-7 rounded-full bg-rose-100 text-[#8A1538] flex items-center justify-center font-bold text-xs flex-shrink-0">
            B
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
              الوجهة (إلى أين تريد الذهاب؟):
            </label>
            <select
              value={endLocation?.id || ''}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value) || null;
                onSetEnd(loc);
              }}
              className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">-- اختر القاعة أو المبنى المطلوب --</option>
              <optgroup label="القاعات والمدرجات الشائعة">
                {locations
                  .filter((l) => l.category === 'hall')
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      🚪 {l.name} ({l.parentBuildingName || ''})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="الكليات">
                {locations
                  .filter((l) => l.category === 'college')
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      🎓 {l.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="المكتبة والمستشفى والمطاعم">
                {locations
                  .filter((l) => ['library', 'service', 'hospital', 'dining', 'sports', 'bus'].includes(l.category))
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      📍 {l.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Accessible Route Option */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => setAccessibleOnly(e.target.checked)}
            className="rounded text-[#0D9488] focus:ring-[#0D9488] w-4 h-4 cursor-pointer"
          />
          <span className="flex items-center gap-1 font-medium">
            <Accessibility className="w-3.5 h-3.5 text-teal-600" />
            <span>مسار سهل (تفضيل المصاعد وتجنب السلالم)</span>
          </span>
        </label>
      </div>

      {/* Route Summary */}
      {startLocation && endLocation && distance && (
        <div className="bg-gradient-to-br from-teal-50/70 to-cyan-50/50 border border-teal-100 rounded-2xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-[#082F49]" />
              <span className="text-xs font-bold text-slate-800">تقدير وقت ومسافة المشي:</span>
            </div>
            <div className="text-left font-black text-[#082F49] text-base">
              {walkMinutes} دقيقة <span className="text-xs text-slate-500 font-normal">({distance} متر)</span>
            </div>
          </div>

          {/* Quick Step Summary */}
          <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-teal-100">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">1. المسار الخارجي:</span>
              <span>اسلك الممر المشجر المباشر باتجاه {endLocation.name}.</span>
            </div>
            {endLocation.indoorDirections && (
              <div className="flex items-start gap-2">
                <span className="text-[#0D9488] font-bold">2. الدخول والتوجيه الداخلي:</span>
                <span>{endLocation.indoorDirections.entrance} - {endLocation.floor || 'الطابق الأرضي'}.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={onFocusMap}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#0D9488]" />
              <span>مشاهدة على الخريطة</span>
            </button>

            {endLocation.indoorDirections && (
              <button
                onClick={() => onOpenIndoorGuide(endLocation)}
                className="flex-1 bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>دليل القاعة الداخلي</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
