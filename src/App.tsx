import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  SQU_LOCATIONS, 
  CampusLocation, 
  SQU_CENTER 
} from './data/squData';
import { Navbar } from './components/Navbar';
const CampusMap = lazy(() => import('./components/CampusMap').then((module) => ({ default: module.CampusMap })));
import { RoutePlanner } from './components/RoutePlanner';
import { DirectoryList } from './components/DirectoryList';
import { IndoorNavigationModal } from './components/IndoorNavigationModal';
import { QRCodeHub } from './components/QRCodeHub';
import { BusScheduleView } from './components/BusScheduleView';
import { EmergencyModal } from './components/EmergencyModal';
import { SuggestHallModal } from './components/SuggestHallModal';
import { WebsiteQrModal } from './components/WebsiteQrModal';
import { InstallAppModal } from './components/InstallAppModal';
import { 
  Compass, 
  Search, 
  MapPin, 
  Navigation, 
  QrCode, 
  BookOpen, 
  Footprints, 
  Sparkles, 
  Layers, 
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Bus,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Safe storage helpers that never throw in restrictive iframe environments
const safeStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage is unavailable in this environment:', e);
    }
    return null;
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('localStorage is unavailable in this environment:', e);
    }
  }
};

export default function App() {
  const [locations, setLocations] = useState<CampusLocation[]>(() => {
    const saved = safeStorage.get('squ_custom_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...SQU_LOCATIONS, ...parsed];
      } catch (e) {
        return SQU_LOCATIONS;
      }
    }
    return SQU_LOCATIONS;
  });

  const [activeTab, setActiveTab] = useState<'map' | 'directory' | 'qr' | 'bus' | 'emergency'>('map');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [startLocation, setStartLocation] = useState<CampusLocation | null>(null);
  const [endLocation, setEndLocation] = useState<CampusLocation | null>(null);
  
  // Modals
  const [indoorModalLoc, setIndoorModalLoc] = useState<CampusLocation | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showWebsiteQrModal, setShowWebsiteQrModal] = useState(false);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [qrModalLoc, setQrModalLoc] = useState<CampusLocation | null>(null);

  // Favorites in safeStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = safeStorage.get('squ_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['hall_eng_101', 'lib_main', 'hall_alfaham'];
      }
    }
    return ['hall_eng_101', 'lib_main', 'hall_alfaham'];
  });

  // Category filter for map
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>('all');
  const [qrBannerNotice, setQrBannerNotice] = useState<string | null>(null);

  // Check URL parameters for QR scan deep link on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('spot');
    const isStart = urlParams.get('start');

    if (spotId) {
      const found = locations.find((l) => l.id === spotId);
      if (found) {
        setSelectedLocation(found);
        if (isStart === 'true') {
          setStartLocation(found);
          setQrBannerNotice(`أهلاً بك في جامعة السلطان قابوس! تم تحديد موقع انطلاقك الحالي عبر الباركود: "${found.name}"`);
        } else {
          setEndLocation(found);
          setQrBannerNotice(`تم تحديد وجهتك عبر الباركود: "${found.name}"`);
        }
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
      }
    }
  }, [locations]);

  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  // Google Maps Platform Quota Defense Listener
  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Handle adding custom suggested hall
  const handleAddLocation = (newLoc: CampusLocation) => {
    const updated = [newLoc, ...locations];
    setLocations(updated);

    // Save custom locations to safeStorage
    const saved = safeStorage.get('squ_custom_locations');
    let customArr = [];
    if (saved) {
      try {
        customArr = JSON.parse(saved);
      } catch (e) {}
    }
    customArr.push(newLoc);
    safeStorage.set('squ_custom_locations', JSON.stringify(customArr));

    setSelectedLocation(newLoc);
    setIndoorModalLoc(newLoc);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const exists = favorites.includes(id);
    let next: string[];
    if (exists) {
      next = favorites.filter((f) => f !== id);
    } else {
      next = [...favorites, id];
    }
    setFavorites(next);
    safeStorage.set('squ_favorites', JSON.stringify(next));
  };

  // Handle simulate scan from QR Hub
  const handleSimulateScan = (loc: CampusLocation) => {
    setStartLocation(loc);
    setSelectedLocation(loc);
    setActiveTab('map');
    setQrBannerNotice(`تم مسح الباركود بنجاح: أنت الآن عند "${loc.name}". اختر وجهتك لبدء التوجيه!`);
  };

  const mapCategoryPills = [
    { id: 'all', label: 'جميع الأماكن' },
    { id: 'popular', label: '⭐ الأكثر طلباً' },
    { id: 'dining', label: '☕ الكوفيهات المعتمدة (Steps, Ratio, Dune...)' },
    { id: 'store', label: '🛒 استهلاكيات الكليات (وصف داخلي)' },
    { id: 'lounge', label: '🛋️ الاستراحات والمصليات' },
    { id: 'hall', label: '🚪 القاعات والمدرجات' },
    { id: 'college', label: '🎓 الكليات' },
    { id: 'library', label: '📚 المكتبة' },
    { id: 'hospital', label: '🏥 المستشفى والعيادات' },
    { id: 'sports', label: '⚽ المجمع الرياضي' },
    { id: 'bus', label: '🚌 محطات الحافلات' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] text-slate-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t === 'emergency') {
            setShowEmergencyModal(true);
          } else {
            setActiveTab(t);
          }
        }}
        onOpenSuggestModal={() => setShowSuggestModal(true)}
        onOpenWebsiteQrModal={() => setShowWebsiteQrModal(true)}
        onOpenInstallModal={() => setShowInstallAppModal(true)}
      />

      {/* Google Maps Platform Quota Notice */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* QR Banner Notice if student arrived via QR code */}
      {qrBannerNotice && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 shadow-md animate-in slide-in-from-top-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <span>{qrBannerNotice}</span>
            </div>
            <button
              onClick={() => setQrBannerNotice(null)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl text-xs transition"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: Campus Map & Pathfinder View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Quick Hero Introduction Header with Brand Emblem & Colors */}
            <div className="bg-gradient-to-r from-[#082F49] via-[#0E4F63] to-[#0A3A4A] text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-[#D4AF37]/40 relative overflow-hidden">
              {/* Subtle background ornamentation */}
              <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-[#14B8A6]/10 blur-2xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4 max-w-2xl">
                  {/* Official Emblem Logo */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white p-1.5 shadow-2xl border-2 border-[#D4AF37] flex-shrink-0 flex items-center justify-center">
                    <img 
                      src="/assets/squ_emblem.jpeg" 
                      alt="شعار دليل SQU الذكي" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-sm border border-teal-200/20">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>خريطة الحرم الجامعي الذكية والتوجيه الداخلي</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      مرحباً بك في <span className="text-amber-300">دليل SQU الذكي</span> 🎓
                    </h2>
                    <p className="text-xs md:text-sm text-teal-100/90 leading-relaxed">
                      ابحث عن أي كلية، قاعة دراسية، استراحة، كوفي، أو مرفق داخل جامعة السلطان قابوس. احصل على مسار المشي بدقة مع تفاصيل الطابق والجناح!
                    </p>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Install / Download App Button */}
                  <button
                    onClick={() => setShowInstallAppModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs py-2.5 px-4 rounded-2xl shadow-xl transition flex items-center gap-2 active:scale-95 border-2 border-white/60 animate-pulse"
                    title="رابط وتنزيل الموقع وتثبيته كتطبيق على الهاتف"
                  >
                    <Download className="w-4 h-4 text-amber-200" />
                    <span>رابط وتنزيل التطبيق 📲</span>
                  </button>

                  {/* Website QR Code Button */}
                  <button
                    onClick={() => setShowWebsiteQrModal(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs py-2.5 px-4 rounded-2xl shadow-xl transition flex items-center gap-2 active:scale-95 border-2 border-white/60"
                    title="عرض وتنزيل باركود الموقع"
                  >
                    <QrCode className="w-4 h-4 text-slate-900" />
                    <span>باركود الموقع 📱</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bus')}
                    className="bg-gradient-to-r from-red-600 to-emerald-600 hover:opacity-95 text-white font-black text-xs py-2.5 px-4 rounded-2xl shadow-xl transition flex items-center gap-2 active:scale-95 border border-white/30"
                    title="استعراض المسار الأحمر والأخضر للحافلات"
                  >
                    <Bus className="w-4 h-4" />
                    <span>حافلات الجامعة (أحمر وأخضر) 🚌</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('qr')}
                    className="bg-white/95 hover:bg-white text-[#082F49] font-bold text-xs py-2.5 px-4 rounded-2xl shadow-lg transition flex items-center gap-2 active:scale-95 border border-white/40"
                  >
                    <QrCode className="w-4 h-4 text-[#0D9488]" />
                    <span>ملصقات القاعات QR</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('directory')}
                    className="bg-[#0A2540]/60 hover:bg-[#0A2540]/80 text-white font-bold text-xs py-2.5 px-4 rounded-2xl border border-white/20 transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>دليل القاعات الشامل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Chips for Map */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {mapCategoryPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setMapCategoryFilter(pill.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
                    mapCategoryFilter === pill.id
                      ? 'bg-[#082F49] text-white shadow-md border-b-2 border-[#D4AF37]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Split Screen Layout: Map & Route Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Map (Col 8) */}
              <div className="lg:col-span-8 h-[580px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-500 text-sm">جارٍ تحميل خريطة الحرم الجامعي...</div>}>
                  <CampusMap
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={(loc) => setSelectedLocation(loc)}
                    startLocation={startLocation}
                    endLocation={endLocation}
                    onSetStartLocation={(loc) => setStartLocation(loc)}
                    onSetEndLocation={(loc) => setEndLocation(loc)}
                    onOpenIndoorGuide={(loc) => setIndoorModalLoc(loc)}
                    activeFilter={mapCategoryFilter}
                  />
                </Suspense>
              </div>

              {/* Sidebar Route Planner & Active Destination Card (Col 4) */}
              <div className="lg:col-span-4 space-y-4">
                <RoutePlanner
                  locations={locations}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  onSetStart={setStartLocation}
                  onSetEnd={setEndLocation}
                  onOpenIndoorGuide={(loc) => setIndoorModalLoc(loc)}
                  onFocusMap={() => {}}
                />

                {/* Selected Location Card Preview */}
                {selectedLocation && (
                  <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-3 animate-in fade-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#082F49] border border-teal-200">
                            {selectedLocation.badge || selectedLocation.category}
                          </span>
                          {selectedLocation.hasMapPin === false && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                              📝 وصف داخلي بالكلية
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {selectedLocation.name}
                        </h4>
                        <span className="text-xs text-slate-500 font-sans block">
                          {selectedLocation.nameEn}
                        </span>
                      </div>
                      {selectedLocation.floor && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900">
                          {selectedLocation.floor}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {selectedLocation.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedLocation.indoorDirections && (
                        <button
                          onClick={() => setIndoorModalLoc(selectedLocation)}
                          className="flex-1 bg-[#082F49] hover:bg-[#0c3c5c] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm border border-teal-600/30"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>التوجيه الداخلي للطابق</span>
                        </button>
                      )}

                      <button
                        onClick={() => setEndLocation(selectedLocation)}
                        className="bg-teal-50 hover:bg-teal-100 text-[#082F49] border border-teal-200 text-xs font-bold py-2.5 px-3 rounded-xl transition"
                      >
                        🎯 وجهتي
                      </button>

                      <button
                        onClick={() => setStartLocation(selectedLocation)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl transition"
                      >
                        🚩 انطلق
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Full Directory & Search View */}
        {activeTab === 'directory' && (
          <DirectoryList
            locations={locations}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setActiveTab('map');
            }}
            onSetStart={(loc) => {
              setStartLocation(loc);
              setActiveTab('map');
            }}
            onSetDestination={(loc) => {
              setEndLocation(loc);
              setActiveTab('map');
            }}
            onOpenIndoorGuide={(loc) => setIndoorModalLoc(loc)}
            onOpenQrGenerator={(loc) => {
              setQrModalLoc(loc);
              setActiveTab('qr');
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* TAB 3: QR Code Hub & Generator */}
        {activeTab === 'qr' && (
          <QRCodeHub
            locations={locations}
            initialLocation={qrModalLoc || selectedLocation}
            onSimulateScan={handleSimulateScan}
            onClose={() => setActiveTab('map')}
          />
        )}

        {/* TAB 4: Internal Shuttle Buses Schedule */}
        {activeTab === 'bus' && <BusScheduleView />}
      </main>

      {/* Website Official QR Code Modal */}
      <WebsiteQrModal
        isOpen={showWebsiteQrModal}
        onClose={() => setShowWebsiteQrModal(false)}
      />

      {/* App Download & Install Modal */}
      <InstallAppModal
        isOpen={showInstallAppModal}
        onClose={() => setShowInstallAppModal(false)}
      />

      {/* Modals */}
      {indoorModalLoc && (
        <IndoorNavigationModal
          location={indoorModalLoc}
          onClose={() => setIndoorModalLoc(null)}
          onSetStart={(loc) => {
            setStartLocation(loc);
            setActiveTab('map');
          }}
          onSetDestination={(loc) => {
            setEndLocation(loc);
            setActiveTab('map');
          }}
          onGenerateQr={(loc) => {
            setQrModalLoc(loc);
            setIndoorModalLoc(null);
            setActiveTab('qr');
          }}
        />
      )}

      {showSuggestModal && (
        <SuggestHallModal
          onClose={() => setShowSuggestModal(false)}
          onAddLocation={handleAddLocation}
        />
      )}

      {showEmergencyModal && (
        <EmergencyModal onClose={() => setShowEmergencyModal(false)} />
      )}

      {/* Footer with New Branding */}
      <footer className="bg-white border-t border-teal-100 py-8 px-4 text-center text-xs text-slate-500 space-y-2 mt-12 mb-16 lg:mb-0">
        <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-[#082F49]">
            <img src="/assets/aistudio/squ_emblem.png" alt="logo" className="w-5 h-5 object-contain" />
            <span>دليل SQU الذكي 🎓</span>
          </span>
          <span>•</span>
          <span>جامعة السلطان قابوس - سلطنة عُمان</span>
          <span>•</span>
          <button
            onClick={() => setShowInstallAppModal(true)}
            className="text-[#082F49] hover:underline font-black flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>رابط وتنزيل التطبيق 📲</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setShowWebsiteQrModal(true)}
            className="text-[#0D9488] hover:underline font-black"
          >
            باركود الموقع 📱
          </button>
          <span>•</span>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="text-rose-700 hover:underline"
          >
            أرقام الطوارئ
          </button>
          <span>•</span>
          <button
            onClick={() => setShowSuggestModal(true)}
            className="text-[#082F49] hover:underline"
          >
            اقترح إضافة قاعة
          </button>
        </div>
        <p className="text-slate-400">
          مشروع الدليل الذكي لتسهيل وصول الطلاب والزوار إلى الكليات والمدرجات والمرافق والكوفيهات عبر نظام الباركود والتوجيه الداخلي
        </p>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-teal-100 px-3 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
            activeTab === 'map' ? 'text-[#082F49] font-black' : 'text-slate-500 font-medium'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">الخريطة</span>
        </button>

        <button
          onClick={() => setActiveTab('bus')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition relative ${
            activeTab === 'bus' ? 'text-red-600 font-black' : 'text-slate-700 font-bold'
          }`}
        >
          <span className="relative">
            <Bus className="w-5 h-5 text-red-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          </span>
          <span className="text-[10px]">الحافلات 🚌</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
            activeTab === 'directory' ? 'text-[#082F49] font-black' : 'text-slate-500 font-medium'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">القاعات</span>
        </button>

        <button
          onClick={() => setShowWebsiteQrModal(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition text-amber-600 font-black"
          title="باركود الموقع"
        >
          <QrCode className="w-5 h-5 text-amber-500" />
          <span className="text-[10px]">باركود الموقع</span>
        </button>
      </nav>
    </div>
  );
}
