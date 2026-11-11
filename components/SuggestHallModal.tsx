import React, { useState } from 'react';
import { CampusLocation } from '../data/squData';
import { PlusCircle, X, CheckCircle2, Sparkles, Navigation, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuggestHallModalProps {
  onClose: () => void;
  onAddLocation: (loc: CampusLocation) => void;
}

export const SuggestHallModal: React.FC<SuggestHallModalProps> = ({
  onClose,
  onAddLocation
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [parentBuilding, setParentBuilding] = useState('كلية الهندسة');
  const [floor, setFloor] = useState('الطابق الأول');
  const [wing, setWing] = useState('الجناح الأيمن بعد المصعد');
  const [entrance, setEntrance] = useState('المدخل الرئيسي للكلية');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [landmarks, setLandmarks] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pick approximate college coordinates as base
    let baseCoords: [number, number] = [23.5932, 58.1705]; // Engineering default
    if (parentBuilding.includes('العلوم')) baseCoords = [23.5918, 58.1695];
    if (parentBuilding.includes('الاقتصاد') || parentBuilding.includes('CEPS')) baseCoords = [23.5898, 58.1698];
    if (parentBuilding.includes('الآداب')) baseCoords = [23.5878, 58.1710];
    if (parentBuilding.includes('الطب')) baseCoords = [23.5945, 58.1748];

    const steps = [
      step1.trim() || `ادخل من ${entrance}.`,
      step2.trim() || `اصعد إلى ${floor} وتوجه باتجاه ${wing}.`,
      `ستجد القاعة (${name}) مع لوحتها الإرشادية.`
    ];

    const newLocation: CampusLocation = {
      id: `custom_hall_${Date.now()}`,
      name: name.trim(),
      nameEn: `Hall ${code || name}`,
      code: code.trim() || undefined,
      category: 'hall',
      parentBuildingName: parentBuilding,
      coordinates: [
        baseCoords[0] + (Math.random() - 0.5) * 0.0003,
        baseCoords[1] + (Math.random() - 0.5) * 0.0003
      ],
      floor: floor,
      wing: wing,
      description: `قاعة دراسية مضافة من قبل مجتمع طلبة جامعة السلطان قابوس في ${parentBuilding}.`,
      tags: [name, code, parentBuilding, floor, 'طالب'],
      badge: 'مضافة من الطلاب ⭐',
      indoorDirections: {
        entrance: entrance.trim() || 'المدخل الرئيسي',
        floorLevel: floor,
        steps: steps,
        landmarks: landmarks.trim() ? landmarks.split(',').map((s) => s.trim()) : ['بجوار السلم والمصعد'],
        hasElevator: true,
        wheelchairAccessible: true
      }
    };

    onAddLocation(newLocation);
    setIsSubmitted(true);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#082F49] via-[#0A3A5C] to-[#0D9488] text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-white/20">
              <PlusCircle className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              مساهمات مجتمع طلبة SQU
            </span>
          </div>
          <h2 className="text-xl font-black">إضافة أو توثيق وصف قاعة جديدة</h2>
          <p className="text-xs text-teal-100 mt-1">
            ساعد زملاءك في العثور على القاعة عبر توثيق الطابق والاتجاه والممر!
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">تمت إضافة القاعة بنجاح! 🎉</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              أصبحت القاعة متاحة الآن في دليل الحرم الجامعي والخريطة ونظام الباركود لجميع الطلبة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم أو رقم القاعة: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قاعة 105، قاعة ندوات 2..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الرمز الأكاديمي (إن وجد):
                </label>
                <input
                  type="text"
                  placeholder="مثال: ENG-105 أو SCI-201"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الكلية أو المبنى:
              </label>
              <select
                value={parentBuilding}
                onChange={(e) => setParentBuilding(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-semibold"
              >
                <option value="كلية الهندسة">كلية الهندسة</option>
                <option value="كلية العلوم">كلية العلوم</option>
                <option value="كلية الاقتصاد والعلوم السياسية (CEPS)">كلية الاقتصاد والعلوم السياسية (CEPS)</option>
                <option value="كلية الآداب والعلوم الاجتماعية">كلية الآداب والعلوم الاجتماعية</option>
                <option value="كلية الطب والعلوم الصحية">كلية الطب والعلوم الصحية</option>
                <option value="كلية التمريض">كلية التمريض</option>
                <option value="كلية التربية">كلية التربية</option>
                <option value="كلية الحقوق">كلية الحقوق</option>
                <option value="كلية العلوم الزراعية والبحرية">كلية العلوم الزراعية والبحرية</option>
                <option value="المكتبة الرئيسية">المكتبة الرئيسية</option>
                <option value="المركز الثقافي ومدرج الفهم">المركز الثقافي ومدرج الفهم</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الطابق:
                </label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value="الطابق الأرضي">الطابق الأرضي (G)</option>
                  <option value="الطابق الأول">الطابق الأول (1)</option>
                  <option value="الطابق الثاني">الطابق الثاني (2)</option>
                  <option value="الطابق الثالث">الطابق الثالث (3)</option>
                  <option value="طابق القبو / السرداب">طابق القبو / السرداب (B)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الجناح أو الممر:
                </label>
                <input
                  type="text"
                  placeholder="مثال: الجناح الشرقي، يمين المصعد..."
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المدخل الموصى به لدخول المبنى:
              </label>
              <input
                type="text"
                placeholder="مثال: المدخل الجنوبي المقابل للمواقف"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                وصف مسار الوصول الداخلي (الخطوة 1):
              </label>
              <input
                type="text"
                placeholder="مثال: ادخل من البوابة واصعد السلم إلى الطابق الأول..."
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                وصف مسار الوصول الداخلي (الخطوة 2):
              </label>
              <input
                type="text"
                placeholder="مثال: اتجه يميناً بعد المصعد، ثاني باب على اليسار..."
                value={step2}
                onChange={(e) => setStep2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                معالم قريبة بجانب القاعة (مفصولة بفواصل):
              </label>
              <input
                type="text"
                placeholder="مثال: بجانب معمل الحاسب 2, مقابل مكتب منسق القسم"
                value={landmarks}
                onChange={(e) => setLandmarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>حفظ وإضافة القاعة</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
