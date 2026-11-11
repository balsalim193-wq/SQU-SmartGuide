import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import 'leaflet/dist/leaflet.css';
import './index.css';

// Google Maps Platform Quota Defense & Error Handling
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Captured in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center font-['Cairo',sans-serif]">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full p-8 rounded-3xl shadow-2xl space-y-4">
            <img 
              src="/assets/aistudio/squ_emblem.png" 
              alt="دليل SQU الذكي" 
              className="w-16 h-16 mx-auto object-contain drop-shadow" 
            />
            <h1 className="text-xl font-black text-white">دليل SQU الذكي 🎓</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              حدثت مشكلة طفيفة أثناء تحميل بعض البيانات المؤقتة. يمكنك إعادة تشغيل الصفحة فوراً بالضغط على الزر أدناه:
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch (e) {}
                window.location.reload();
              }}
              className="w-full bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold py-3 px-6 rounded-2xl transition shadow-lg text-sm"
            >
              🔄 إعادة تحميل الدليل والخريطة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
