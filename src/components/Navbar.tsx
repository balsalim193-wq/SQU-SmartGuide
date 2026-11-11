import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  QrCode, 
  Bus, 
  PhoneCall, 
  Menu, 
  X, 
  PlusCircle, 
  Sparkles,
  BookOpen,
  Download,
  Smartphone
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'directory' | 'qr' | 'bus' | 'emergency';
  setActiveTab: (tab: 'map' | 'directory' | 'qr' | 'bus' | 'emergency') => void;
  onOpenSuggestModal: () => void;
  onOpenWebsiteQrModal?: () => void;
  onOpenInstallModal?: () => void;
}

interface NavItem {
  id: 'map' | 'directory' | 'qr' | 'bus' | 'emergency';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  alert?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSuggestModal,
  onOpenWebsiteQrModal,
  onOpenInstallModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'map', label: 'الخريطة والملاحة', icon: Compass },
    { id: 'directory', label: 'دليل الكليات والقاعات', icon: BookOpen },
    { id: 'qr', label: 'ملصقات الباركود QR', icon: QrCode, highlight: true },
    { id: 'bus', label: 'حافلات الجامعة', icon: Bus },
    { id: 'emergency', label: 'طوارئ الجامعة', icon: PhoneCall, alert: true }
  ];

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title with User's Official Emblem */}
          <div 
            onClick={() => handleSelectTab('map')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-100 p-1 flex items-center justify-center shadow-md border-2 border-[#D4AF37]/50 group-hover:scale-105 transition">
              <img 
                src="/assets/aistudio/squ_emblem.png" 
                alt="شعار دليل SQU الذكي" 
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0D9488] rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg md:text-xl font-black text-[#082F49] tracking-tight">
                  دليل <span className="text-[#0D9488]">SQU</span> الذكي
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#082F49] text-[10px] font-bold border border-teal-200">
                  الحرم الذكي 🎓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                الدليل التفاعلي والخريطة الذكية لجامعة السلطان قابوس
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#082F49] to-[#0E4F63] text-white shadow-sm border-b-2 border-[#D4AF37]'
                      : item.alert
                      ? 'hover:bg-rose-50 text-rose-700'
                      : 'hover:bg-white text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : ''}`} />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Install / Download App Button */}
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition bg-gradient-to-r from-[#082F49] to-[#0D9488] hover:from-[#062438] hover:to-[#0b7a6f] text-white shadow-md border border-teal-500/30 active:scale-95"
                title="رابط وتنزيل الموقع وتثبيته كتطبيق على الهاتف"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">تنزيل التطبيق 📲</span>
                <span className="sm:hidden">تنزيل 📲</span>
              </button>
            )}

            {/* Website QR Code Button */}
            {onOpenWebsiteQrModal && (
              <button
                onClick={onOpenWebsiteQrModal}
                className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-md border border-amber-500/40 active:scale-95 animate-pulse"
                title="عرض وتنزيل باركود الموقع الرسمي"
              >
                <QrCode className="w-4 h-4 text-slate-900" />
                <span className="hidden md:inline">باركود الموقع 📱</span>
              </button>
            )}

            {/* Direct Quick Bus Button */}
            <button
              onClick={() => handleSelectTab('bus')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition border shadow-sm ${
                activeTab === 'bus'
                  ? 'bg-gradient-to-r from-red-600 to-emerald-600 text-white border-transparent'
                  : 'bg-teal-50 hover:bg-teal-100 text-[#082F49] border-teal-200'
              }`}
              title="مسارات حافلات الجامعة (أحمر وأخضر)"
            >
              <Bus className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold hidden sm:inline">حافلات الجامعة</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] mr-0.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {onOpenInstallModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInstallModal();
              }}
              className="w-full p-3.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#082F49] to-[#0D9488] text-white flex items-center justify-center gap-2 shadow-md border border-teal-500/40"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>رابط وتنزيل التطبيق على الهاتف 📲</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
                  isActive
                    ? 'bg-[#082F49] text-white border-r-4 border-[#D4AF37]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-bold">
                    جديد
                  </span>
                )}
              </button>
            );
          })}

          {onOpenWebsiteQrModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWebsiteQrModal();
              }}
              className="w-full p-3 rounded-2xl text-xs font-black bg-amber-400 text-slate-900 border border-amber-500 flex items-center justify-center gap-2 shadow-sm"
            >
              <QrCode className="w-4 h-4 text-slate-900" />
              <span>باركود الموقع الرسمي 📱</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSuggestModal();
            }}
            className="w-full p-3 rounded-2xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-700" />
            <span>اقترح إضافة أو تصحيح مسار قاعة</span>
          </button>
        </div>
      )}
    </header>
  );
};
