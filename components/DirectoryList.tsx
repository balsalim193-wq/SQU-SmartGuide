import React, { useState } from 'react';
import { CampusLocation, LocationCategory } from '../data/squData';
import { 
  Search, 
  MapPin, 
  Navigation, 
  DoorClosed, 
  Building2, 
  Star, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  Compass, 
  QrCode,
  Filter
} from 'lucide-react';

interface DirectoryListProps {
  locations: CampusLocation[];
  onSelectLocation: (location: CampusLocation) => void;
  onSetStart: (location: CampusLocation) => void;
  onSetDestination: (location: CampusLocation) => void;
  onOpenIndoorGuide: (location: CampusLocation) => void;
  onOpenQrGenerator: (location: CampusLocation) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const DirectoryList: React.FC<DirectoryListProps> = ({
  locations,
  onSelectLocation,
  onSetStart,
  onSetDestination,
  onOpenIndoorGuide,
  onOpenQrGenerator,
  favorites,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<CampusLocation | null>(null);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'hall', label: '🚪 القاعات والمدرجات', highlight: true },
    { id: 'dining', label: '☕ الكوفيهات المعتمدة (Steps, Ratio, Dune...)', highlight: true },
    { id: 'store', label: '🛒 استهلاكيات الكليات (وصف داخلي)', highlight: true },
    { id: 'lounge', label: '🛋️ الاستراحات والمصليات' },
    { id: 'college', label: '🎓 الكليات' },
    { id: 'library', label: '📚 المكتبات والمراكز' },
    { id: 'hospital', label: '🏥 المستشفى والعيادات' },
    { id: 'sports', label: '⚽ الرياضة' },
    { id: 'service', label: '🏛️ الخدمات والمساجد' }
  ];

  const normalizeSearch = (value: string) => value.toLocaleLowerCase('ar').normalize('NFD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();

  // Filtering
  const filtered = locations.filter((loc) => {
    if (onlyFavorites && !favorites.includes(loc.id)) return false;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'service') {
        if (!['service', 'bus', 'gate'].includes(loc.category)) return false;
      } else if (loc.category !== selectedCategory) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = normalizeSearch(searchQuery);
      const matchName = normalizeSearch(loc.name).includes(q);
      const matchEn = normalizeSearch(loc.nameEn).includes(q);
      const matchCode = normalizeSearch(loc.code || '').includes(q);
      const matchDesc = normalizeSearch(loc.description).includes(q);
      const matchTags = (loc.tags || []).some((t) => normalizeSearch(t).includes(q));
      const matchFloor = normalizeSearch(loc.floor || '').includes(q);
      const matchBuilding = normalizeSearch(loc.parentBuildingName || '').includes(q);

      return matchName || matchEn || matchCode || matchDesc || matchTags || matchFloor || matchBuilding;
    }

    return true;
  });

  if (selectedCollege) {
    const collegeItems = locations.filter((loc) => loc.id !== selectedCollege.id && (loc.parentBuildingId === selectedCollege.id || loc.parentBuildingName === selectedCollege.name));
    const categoryNames: Record<string, string> = { hall: 'قاعات ومدرجات', dining: 'مقاهٍ ومطاعم', store: 'استهلاكيات', lounge: 'استراحات', service: 'خدمات ومصليات', library: 'مكتبات', sports: 'مرافق رياضية', hospital: 'مرافق صحية', bus: 'محطات حافلات' };
    return (
      <div className="space-y-6" dir="rtl">
        <section className="rounded-3xl bg-gradient-to-l from-[#082F49] to-[#0D6470] text-white p-6 md:p-8 shadow-xl">
          <button onClick={() => setSelectedCollege(null)} className="mb-5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2 text-sm font-bold">← العودة إلى دليل الكليات</button>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl"><span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold mb-3">استكشاف الكلية</span><h2 className="text-2xl md:text-3xl font-black">{selectedCollege.name}</h2><p className="mt-1 text-sm text-teal-100" dir="ltr">{selectedCollege.nameEn}</p><p className="mt-4 text-sm leading-7 text-white/90">{selectedCollege.description}</p></div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center min-w-28"><div className="text-3xl font-black">{collegeItems.length}</div><div className="text-xs text-teal-100">مرافق مسجلة</div></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">{selectedCollege.code && <span className="rounded-lg bg-white/10 px-3 py-2">رمز الكلية: {selectedCollege.code}</span>}{selectedCollege.workingHours && <span className="rounded-lg bg-white/10 px-3 py-2">ساعات العمل: {selectedCollege.workingHours}</span>}{selectedCollege.phone && <span className="rounded-lg bg-white/10 px-3 py-2">هاتف: {selectedCollege.phone}</span>}</div>
        </section>
        <div className="flex items-center justify-between gap-3 px-1"><div><h3 className="text-lg font-black text-slate-900">الأماكن والمرافق داخل الكلية</h3><p className="text-xs text-slate-500 mt-1">المعلومات المعروضة هي المواقع المسجلة حاليًا في دليل الجامعة الذكية.</p></div><span className="rounded-xl bg-teal-50 text-teal-800 px-3 py-2 text-xs font-bold">{collegeItems.length} موقع</span></div>
        {collegeItems.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{collegeItems.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"><div className="flex items-start justify-between gap-2"><div><span className="text-[11px] font-bold text-teal-800 bg-teal-50 rounded-lg px-2 py-1">{item.badge || categoryNames[item.category] || 'مرافق أخرى'}</span><h4 className="mt-2 font-black text-slate-900">{item.name}</h4><p className="text-xs text-slate-400 mt-1" dir="ltr">{item.nameEn}</p></div>{item.floor && <span className="shrink-0 rounded-lg bg-amber-50 text-amber-800 px-2 py-1 text-[11px] font-bold">{item.floor}</span>}</div><p className="text-sm text-slate-600 leading-6">{item.description}</p>{item.indoorDirections && <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-slate-700 mb-2">طريقة الوصول</p><ol className="list-decimal pr-5 space-y-1 text-xs leading-5 text-slate-600">{item.indoorDirections.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>{item.indoorDirections.landmarks.length > 0 && <p className="mt-2 text-[11px] text-slate-500">علامات قريبة: {item.indoorDirections.landmarks.join(' • ')}</p>}</div>}<div className="flex flex-wrap gap-2 pt-1"><button onClick={() => onSelectLocation(item)} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700">عرض على الخريطة</button>{item.indoorDirections && <button onClick={() => onOpenIndoorGuide(item)} className="rounded-xl bg-[#082F49] hover:bg-[#0D6470] px-3 py-2 text-xs font-bold text-white">التوجيه الداخلي</button>}</div></article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><div className="text-3xl mb-3">🏫</div><h4 className="font-black text-slate-800">لا توجد مرافق داخلية موثقة لهذه الكلية حتى الآن</h4><p className="mt-2 text-sm text-slate-500 leading-6">يمكن إضافة القاعات والمصليات والاستراحات والاستهلاكيات بعد التحقق من مواقعها ومعلومات الوصول إليها.</p></div>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، رقم القاعة (مثل 101)، الكلية، الطابق، أو الخدمة..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-[#0D9488] transition placeholder:text-slate-400 font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200/80 rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOnlyFavorites(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                selectedCategory === cat.id && !onlyFavorites
                  ? 'bg-[#082F49] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } ${cat.highlight ? 'ring-1 ring-amber-300' : ''}`}
            >
              <span>{cat.label}</span>
            </button>
          ))}

          {/* Starred / Favorites button */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              onlyFavorites
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'fill-amber-400 text-amber-500'}`} />
            <span>قاعاتي المحفوظة ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* Results Count & Quick Status */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <span>تم العثور على <strong>{filtered.length}</strong> موقع أو قاعة في الحرم الجامعي</span>
        {searchQuery && (
          <span className="text-[#082F49] font-bold">نتائج البحث عن: "{searchQuery}"</span>
        )}
      </div>

      {/* Directory Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 text-[#082F49] flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">لم يتم العثور على نتائج تطابق بحثك</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو ابحث باسم الكلية أو رقم القاعة أو تصفح الأقسام أعلاه.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            إعادة تعيين البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((loc) => {
            const isFav = favorites.includes(loc.id);
            const hasIndoor = Boolean(loc.indoorDirections);

            return (
              <div
                key={loc.id}
                className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100/80 hover:border-rose-200 transition-all hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges and Star */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-rose-50 text-[#8A1538]">
                        {loc.badge || loc.category}
                      </span>
                      {loc.hasMapPin === false && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          📝 وصف داخلي بالكلية
                        </span>
                      )}
                      {loc.code && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-slate-100 text-slate-700">
                          {loc.code}
                        </span>
                      )}
                      {loc.floor && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                          {loc.floor}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleFavorite(loc.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition"
                      title={isFav ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
                    >
                      <Star
                        className={`w-4 h-4 transition ${
                          isFav ? 'fill-amber-400 text-amber-500 scale-110' : 'hover:text-amber-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & English name */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0D9488] transition mb-0.5">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mb-2">{loc.nameEn}</p>

                  {/* Parent Building / Wing */}
                  {loc.parentBuildingName && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{loc.parentBuildingName} {loc.wing ? `• ${loc.wing}` : ''}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {loc.description}
                  </p>

                  {/* Indoor Guidance Teaser */}
                  {hasIndoor && (
                    <div className="p-2.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-[11px] text-[#082F49] flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="truncate">
                        <strong>التوجيه الداخلي:</strong> {loc.indoorDirections?.entrance}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {loc.category === 'college' && (
                      <button onClick={() => setSelectedCollege(loc)} className="bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:opacity-95 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm">استكشاف الكلية</button>
                    )}
                    {hasIndoor && (
                      <button
                        onClick={() => onOpenIndoorGuide(loc)}
                        className="bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1 shadow-sm"
                        title="شرح الوصول للطابق والقاعة خطوة بخطوة"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-300" />
                        <span>التوجيه الداخلي</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectLocation(loc)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1"
                      title={loc.hasMapPin === false ? "عرض مبنى الكلية على الخريطة واتباع الوصف الداخلي" : "عرض الموقع على الخريطة"}
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                      <span>{loc.hasMapPin === false ? "مبنى الكلية" : "الخريطة"}</span>
                    </button>

                    <button
                      onClick={() => onOpenQrGenerator(loc)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="توليد ملصق باركود QR"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSetStart(loc)}
                      className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-2.5 rounded-xl transition"
                      title="ابدأ المسار من هنا"
                    >
                      🚩 انطلق
                    </button>
                    <button
                      onClick={() => onSetDestination(loc)}
                      className="text-[11px] font-bold text-[#082F49] bg-teal-50 hover:bg-teal-100 border border-teal-200 py-1.5 px-2.5 rounded-xl transition"
                      title="اجعل هذا المكان وجهتي"
                    >
                      🎯 وجهتي
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
