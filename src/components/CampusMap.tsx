import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  CampusLocation, 
  SQU_CENTER, 
  calculateDistanceMeters, 
  estimateWalkMinutes 
} from '../data/squData';
import { 
  Compass, 
  Layers, 
  Navigation, 
  MapPin, 
  Footprints, 
  Sparkles,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Crosshair
} from 'lucide-react';

interface CampusMapProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (location: CampusLocation) => void;
  startLocation: CampusLocation | null;
  endLocation: CampusLocation | null;
  onSetStartLocation: (loc: CampusLocation | null) => void;
  onSetEndLocation: (loc: CampusLocation | null) => void;
  onOpenIndoorGuide: (loc: CampusLocation) => void;
  activeFilter: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  startLocation,
  endLocation,
  onSetStartLocation,
  onSetEndLocation,
  onOpenIndoorGuide,
  activeFilter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Default to Google Hybrid (Satellite + Buildings & Roads) for crystal-clear building details
  const [googleMapType, setGoogleMapType] = useState<'hybrid' | 'roadmap' | 'satellite'>('hybrid');
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Initialize Map with Google Maps Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map centered on SQU with deep zoom capacity
    const map = L.map(mapContainerRef.current, {
      center: SQU_CENTER,
      zoom: 16.5,
      minZoom: 14,
      maxZoom: 20,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Initial Google Hybrid Tiles (High-resolution satellite + detailed building and street labels)
    const googleHybridTiles = L.tileLayer(
      'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        attribution: '&copy; Google Maps Platform, Sultan Qaboos University',
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );
    googleHybridTiles.addTo(map);
    tileLayerRef.current = googleHybridTiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Google Maps Tile Layer when googleMapType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Google Maps Tile URL codes:
    // y = hybrid (satellite + road/building labels)
    // m = roadmap (Google Maps standard streets and 3D buildings)
    // s = satellite (pure high-res satellite photos)
    let lyrCode = 'y';
    if (googleMapType === 'roadmap') lyrCode = 'm';
    if (googleMapType === 'satellite') lyrCode = 's';

    const newTileLayer = L.tileLayer(
      `https://mt1.google.com/vt/lyrs=${lyrCode}&x={x}&y={y}&z={z}`,
      {
        attribution: '&copy; Google Maps Platform, Sultan Qaboos University',
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [googleMapType]);

  // Update Markers based on locations, filter, and selections
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = locations.filter((loc) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'popular') return loc.isPopular;
      return loc.category === activeFilter;
    });

    filtered.forEach((loc) => {
      // Do not render map markers for locations marked as descriptive-only (no false pins!)
      if (loc.hasMapPin === false || !loc.coordinates) return;

      const isSelected = selectedLocation?.id === loc.id;
      const isStart = startLocation?.id === loc.id;
      const isEnd = endLocation?.id === loc.id;

      let badgeColor = '#082F49'; // Logo Navy
      let iconSymbol = '🏛️';

      if (loc.category === 'college') {
        badgeColor = '#082F49'; // Deep Navy
        iconSymbol = '🎓';
      } else if (loc.category === 'hall') {
        badgeColor = '#0D9488'; // Ocean Teal
        iconSymbol = '🚪';
      } else if (loc.category === 'library') {
        badgeColor = '#0369a1';
        iconSymbol = '📚';
      } else if (loc.category === 'dining') {
        badgeColor = '#d97706'; // Gold/Amber
        iconSymbol = '☕';
      } else if (loc.category === 'hospital') {
        badgeColor = '#e11d48';
        iconSymbol = '🏥';
      } else if (loc.category === 'sports') {
        badgeColor = '#059669';
        iconSymbol = '⚽';
      } else if (loc.category === 'bus') {
        badgeColor = '#0284c7';
        iconSymbol = '🚌';
      } else if (loc.category === 'service') {
        badgeColor = '#0f766e';
        iconSymbol = 'ℹ️';
      } else if (loc.category === 'lounge') {
        badgeColor = '#0D9488';
        iconSymbol = '🛋️';
      } else if (loc.category === 'store') {
        badgeColor = '#059669';
        iconSymbol = '🛒';
      }

      if (isStart) {
        badgeColor = '#059669';
        iconSymbol = '🚩';
      } else if (isEnd) {
        badgeColor = '#dc2626';
        iconSymbol = '🎯';
      }

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${isStart || isEnd ? '<div class="absolute -inset-1 rounded-full bg-amber-400 opacity-80 animate-ping"></div>' : ''}
          <div style="background-color: ${badgeColor};" class="relative flex items-center justify-center w-9 h-9 rounded-2xl shadow-xl border-2 border-white text-white text-base font-bold transition-all">
            <span>${iconSymbol}</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style="background-color: ${badgeColor};"></div>
          
          <div class="hidden group-hover:block absolute bottom-11 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-xl whitespace-nowrap shadow-xl pointer-events-none z-50 border border-white/20 font-bold">
            ${loc.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-squ-marker',
        html: markerHtml,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38]
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon });

      const googleMapsAppUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates[0]},${loc.coordinates[1]}&travelmode=walking`;

      const popupHtml = `
        <div class="font-['Cairo'] text-right">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="inline-block px-2 py-0.5 text-[10px] rounded-lg font-bold bg-teal-100 text-[#082F49]">
              ${loc.badge || loc.category}
            </span>
            ${loc.floor ? `<span class="inline-block px-1.5 py-0.5 text-[10px] rounded-lg bg-amber-100 text-amber-900 font-bold">${loc.floor}</span>` : ''}
          </div>
          <h4 class="font-bold text-slate-900 text-sm mb-1">${loc.name}</h4>
          <p class="text-xs text-slate-600 mb-3 leading-relaxed">${loc.description.slice(0, 110)}...</p>
          
          <div class="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
            <div class="flex gap-1.5">
              <button id="btn-pop-details-${loc.id}" class="flex-1 bg-[#082F49] hover:bg-[#0c3c5c] text-white text-xs py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1 shadow-sm border border-teal-600/30">
                <span>التوجيه الداخلي للقاعة</span>
              </button>
              <button id="btn-pop-start-${loc.id}" class="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs py-2 px-2.5 rounded-xl font-bold transition border border-emerald-200">
                🚩 انطلق
              </button>
              <button id="btn-pop-end-${loc.id}" class="bg-teal-50 text-[#082F49] hover:bg-teal-100 text-xs py-2 px-2.5 rounded-xl font-bold transition border border-teal-200">
                🎯 وجهتي
              </button>
            </div>

            <a 
              href="${googleMapsAppUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-1.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border border-blue-200"
            >
              <span>فتح الملاحة في تطبيق Google Maps ↗️</span>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        onSelectLocation(loc);

        setTimeout(() => {
          const detailBtn = document.getElementById(`btn-pop-details-${loc.id}`);
          const startBtn = document.getElementById(`btn-pop-start-${loc.id}`);
          const endBtn = document.getElementById(`btn-pop-end-${loc.id}`);

          if (detailBtn) {
            detailBtn.onclick = (e) => {
              e.stopPropagation();
              onOpenIndoorGuide(loc);
            };
          }
          if (startBtn) {
            startBtn.onclick = (e) => {
              e.stopPropagation();
              onSetStartLocation(loc);
            };
          }
          if (endBtn) {
            endBtn.onclick = (e) => {
              e.stopPropagation();
              onSetEndLocation(loc);
            };
          }
        }, 50);
      });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersGroup.addLayer(marker);
    });
  }, [locations, activeFilter, selectedLocation, startLocation, endLocation]);

  // Pan to selected location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocation) return;

    if (selectedLocation.hasMapPin === false || !selectedLocation.coordinates) {
      if (selectedLocation.parentBuildingId) {
        const parent = locations.find((l) => l.id === selectedLocation.parentBuildingId);
        if (parent && parent.coordinates) {
          map.flyTo(parent.coordinates, 17.5, { duration: 1.2 });
        }
      }
      return;
    }

    map.flyTo(selectedLocation.coordinates, 17.5, {
      duration: 1.2
    });
  }, [selectedLocation, locations]);

  // Helper to find effective coordinates for walking route
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

  // Draw walking route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (startCoords && endCoords) {
      const start = startCoords;
      const end = endCoords;

      const midLat = (start[0] + end[0]) / 2;
      const midLng = (start[1] + end[1]) / 2;
      const spineLng = 58.1720;
      const wayPoint: [number, number] = [
        midLat,
        (midLng + spineLng) / 2
      ];

      const routePoints: [number, number][] = [start, wayPoint, end];

      const polyline = L.polyline(routePoints, {
        color: '#dc2626',
        weight: 6,
        opacity: 0.95,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;

      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
    }
  }, [startCoords, endCoords]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGpsError('خاصية تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setGpsError(null);

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo(coords, 18);

          const gpsIcon = L.divIcon({
            className: 'user-gps-marker',
            html: `
              <div class="relative flex items-center justify-center w-7 h-7">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-xl"></span>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          L.marker(coords, { icon: gpsIcon })
            .addTo(map)
            .bindPopup('<div class="font-[\'Cairo\'] text-right font-bold text-xs p-1">أنت هنا حالياً (GPS) 📍</div>')
            .openPopup();
        }
      },
      (err) => {
        console.warn(err);
        setGpsError('تعذر تحديد موقعك الحالي بدقة عبر GPS. يمكنك تحديد أقرب مبنى من القائمة.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleResetCampusView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(SQU_CENTER, 16.5);
    }
  };

  const distance = (startCoords && endCoords) 
    ? calculateDistanceMeters(startCoords, endCoords)
    : null;
  const walkTime = distance ? estimateWalkMinutes(distance) : null;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-300">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Google Maps Mode Switcher */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-1 shadow-2xl border border-white/20 flex items-center gap-1 text-xs font-bold text-white">
          <button
            onClick={() => setGoogleMapType('hybrid')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              googleMapType === 'hybrid'
                ? 'bg-red-600 text-white shadow-md'
                : 'hover:bg-white/10 text-slate-300'
            }`}
            title="صور الأقمار الصناعية عالية الدقة مع أسماء وتفاصيل المباني"
          >
            <span>🛰️ قمر صناعي وتفاصيل المباني</span>
          </button>

          <button
            onClick={() => setGoogleMapType('roadmap')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              googleMapType === 'roadmap'
                ? 'bg-red-600 text-white shadow-md'
                : 'hover:bg-white/10 text-slate-300'
            }`}
            title="مخطط جوجل للشوارع والمباني 3D"
          >
            <span>🗺️ شوارع ومباني Google</span>
          </button>
        </div>

        {/* Google Maps Authenticity Badge */}
        <div className="self-end bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-800 shadow-md border border-slate-200 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Google Maps Platform 🌐</span>
        </div>
      </div>

      {/* Descriptive indoor location banner when selected */}
      {selectedLocation && (selectedLocation.hasMapPin === false || !selectedLocation.coordinates) && (
        <div className="absolute top-16 right-4 left-4 md:right-4 md:left-auto md:max-w-md z-20 bg-amber-50/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-amber-300 text-amber-950 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
          <div className="p-1.5 rounded-xl bg-amber-200 text-amber-900 mt-0.5">
            📝
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold mb-0.5 flex items-center justify-between">
              <span>{selectedLocation.name}</span>
              <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-lg text-amber-900 font-bold">وصف داخلي بالكلية</span>
            </div>
            <p className="text-amber-800 leading-relaxed mb-2 font-medium">{selectedLocation.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenIndoorGuide(selectedLocation)}
                className="bg-[#082F49] hover:bg-[#0c3c5c] text-white text-[11px] font-bold py-1.5 px-3 rounded-xl transition shadow-sm inline-flex items-center gap-1 border border-teal-600/30"
              >
                <span>شرح خطوات الوصول بالتفصيل 🚪</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons (Left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          title="أين أنا الآن؟ (GPS)"
          className="bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl shadow-xl border border-slate-200 transition active:scale-95 flex items-center justify-center text-blue-600"
        >
          <Navigation className="w-5 h-5 fill-blue-50" />
        </button>

        <button
          onClick={handleResetCampusView}
          title="إعادة ضبط مركز حرم الجامعة"
          className="bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl shadow-xl border border-slate-200 transition active:scale-95 flex items-center justify-center"
        >
          <Compass className="w-5 h-5 text-[#0D9488]" />
        </button>
      </div>

      {/* Active Route Floating Card */}
      {startLocation && endLocation && distance && (
        <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-teal-200 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 text-[#082F49]">
                <Footprints className="w-5 h-5 text-[#0D9488]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">مسار المشي في حرم الجامعة</h4>
                <p className="text-xs text-slate-500">ممر المشاة المباشر بين المباني</p>
              </div>
            </div>
            <div className="text-left">
              <span className="text-base font-black text-[#082F49]">{walkTime} دقيقة</span>
              <span className="text-xs text-slate-500 block">({distance} متر)</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="font-semibold text-slate-900">من:</span>
              <span className="truncate">{startLocation.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-teal-600 flex-shrink-0"></span>
              <span className="font-semibold text-slate-900">إلى:</span>
              <span className="truncate">{endLocation.name}</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex gap-2">
            {endLocation.indoorDirections && (
              <button
                onClick={() => onOpenIndoorGuide(endLocation)}
                className="flex-1 bg-[#082F49] hover:bg-[#0c3c5c] text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm border border-teal-600/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>التوجيه الداخلي للطابق</span>
              </button>
            )}
            {startCoords && endCoords && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${startCoords[0]},${startCoords[1]}&destination=${endCoords[0]},${endCoords[1]}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-xl transition font-bold border border-blue-200 flex items-center gap-1"
                title="فتح المسار في تطبيق Google Maps الرسمي"
              >
                <span>Google Maps ↗️</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="absolute top-20 left-4 right-4 md:right-auto md:max-w-sm z-20 bg-amber-50/95 border border-amber-200 text-amber-900 text-xs p-3 rounded-2xl shadow-xl flex items-center justify-between">
          <span>{gpsError}</span>
          <button onClick={() => setGpsError(null)} className="font-bold text-amber-700 mr-2 text-sm">✕</button>
        </div>
      )}
    </div>
  );
};
