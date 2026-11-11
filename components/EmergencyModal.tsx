import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/squData';
import { PhoneCall, ShieldAlert, X, HeartPulse, LifeBuoy, MapPin } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
              خدمة 24/7 طوال الأسبوع
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">أرقام طوارئ ومساعدة الحرم الجامعي</h2>
          <p className="text-xs text-rose-100 mt-1">
            جامعة السلطان قابوس • أمن الجامعة • الإسعاف الطبي • الدعم التقني
          </p>
        </div>

        {/* Contacts List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-rose-200 transition flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.color}`}>
                    {item.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-500">{item.description}</p>
                <span className="text-sm font-mono font-bold text-slate-800 block" dir="ltr">
                  📞 {item.number}
                </span>
              </div>

              <a
                href={`tel:${item.number.replace(/\s+/g, '')}`}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 shadow-md active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>اتصال فوري</span>
              </a>
            </div>
          ))}

          {/* Quick campus tip */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <HeartPulse className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              في الحالات الطارئة الحرجة داخل القاعات أو المختبرات، قم بإبلاغ أقرب أستاذ أو مشرف أمن في المبنى، أو اتصل مباشرة على رقم أمن الحرم الجامعي <strong>2414 7777</strong> وسيتم توجيه الدورية فوراً.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
