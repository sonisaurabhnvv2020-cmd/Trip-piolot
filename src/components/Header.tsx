import React from 'react';
import { Compass, Clock, Navigation, Plus, MapPin, DollarSign, Monitor } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'radar' | 'dispatch' | 'revenue' | 'cockpit';
  setCurrentTab: (tab: 'dashboard' | 'radar' | 'dispatch' | 'revenue' | 'cockpit') => void;
  units: 'metric' | 'imperial';
  setUnits: (units: 'metric' | 'imperial') => void;
  onOpenNewTripModal: () => void;
  onOpenCockpitHUD: () => void;
  isLocatingGPS: boolean;
  onDetectGPS: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  units,
  setUnits,
  onOpenNewTripModal,
  onOpenCockpitHUD,
  isLocatingGPS,
  onDetectGPS,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap">
                DepartWise AI
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 rounded px-1.5 py-0.5">
                Global GPS Dispatch
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Pre-departure bottleneck intelligence & bypass routing
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Commutes & Trips</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'radar'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Bypass Radar</span>
          </button>

          <button
            onClick={() => setCurrentTab('dispatch')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'dispatch'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Message Dispatch</span>
          </button>

          <button
            onClick={() => setCurrentTab('revenue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'revenue'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Micro-Pricing ($0.99) & ROI</span>
          </button>
        </nav>

        {/* Zone 3: Actions (GPS, Unit toggle, HUD, and New Trip) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick GPS Locator */}
          <button
            onClick={onDetectGPS}
            disabled={isLocatingGPS}
            title="Auto-detect current GPS location"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-lg transition-colors"
          >
            <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${isLocatingGPS ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isLocatingGPS ? 'Locating...' : 'GPS Pin'}</span>
          </button>

          {/* Units toggle */}
          <button
            onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
            className="px-2 py-1.5 text-[11px] font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="Toggle between Metric (km) and Imperial (mi)"
          >
            {units === 'metric' ? 'KM / °C' : 'MI / °F'}
          </button>

          {/* Cockpit HUD Button */}
          <button
            onClick={onOpenCockpitHUD}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            title="Launch Fullscreen Departure Cockpit HUD"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Cockpit HUD</span>
          </button>

          {/* Primary Action: Add Trip */}
          <button
            onClick={onOpenNewTripModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-sm shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="whitespace-nowrap">Plan Visit</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden items-center justify-around gap-1 pt-3 mt-2 border-t border-slate-900 text-xs">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2 py-1 rounded ${currentTab === 'dashboard' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Trips
        </button>
        <button
          onClick={() => setCurrentTab('radar')}
          className={`px-2 py-1 rounded ${currentTab === 'radar' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Radar
        </button>
        <button
          onClick={() => setCurrentTab('dispatch')}
          className={`px-2 py-1 rounded ${currentTab === 'dispatch' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Dispatch
        </button>
        <button
          onClick={() => setCurrentTab('revenue')}
          className={`px-2 py-1 rounded ${currentTab === 'revenue' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          $0.99 Pricing & ROI
        </button>
        <button
          onClick={onOpenCockpitHUD}
          className="px-2 py-1 text-slate-400 hover:text-white"
        >
          HUD
        </button>
      </div>
    </header>
  );
};
