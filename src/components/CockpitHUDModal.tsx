import React, { useState, useEffect } from 'react';
import { PreplannedTrip, TrafficBriefing } from '../types';
import { X, Volume2, Maximize2, Minimize2, Navigation, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { audioAlert } from '../utils/audioAlert';

interface CockpitHUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: PreplannedTrip;
  briefing: TrafficBriefing | null;
}

export const CockpitHUDModal: React.FC<CockpitHUDModalProps> = ({
  isOpen,
  onClose,
  trip,
  briefing,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen || !trip?.scheduledDeparture) return;

    const tick = () => {
      const [hh, mm] = trip.scheduledDeparture.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, 0, 0);

      let diff = target.getTime() - now.getTime();
      if (diff < 0) {
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime();
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      setTimeLeft({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isOpen, trip?.scheduledDeparture]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePlaySound = () => {
    audioAlert.playByType(trip.alertChime || 'executive');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 sm:p-12 animate-fade-in font-display select-none">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              DepartWise AI · Active Departure HUD
            </div>
            <div className="text-sm font-semibold text-slate-300 font-sans">
              {trip.title} ({trip.city || 'Global Metro'})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlaySound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 font-sans transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chime Sound</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Massive Countdown Display */}
      <div className="text-center my-auto space-y-4">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-mono">
          Time Remaining Until Departure
        </div>

        <div className="font-mono tabular-nums text-7xl sm:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-16 sm:gap-24 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span>Hours</span>
          <span>Minutes</span>
          <span>Seconds</span>
        </div>

        {/* Dynamic AI Corridor Advice Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-sans mt-4">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {briefing
              ? briefing.departureWindowRecommendation?.advice
              : `Scheduled departure at ${trip.scheduledDeparture}. Corridor scan active.`}
          </span>
        </div>
      </div>

      {/* HUD Footer Status Corridor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900 pt-6 text-xs font-sans text-slate-400">
        <div>
          <div className="uppercase tracking-wider text-[10px] text-slate-500 font-semibold">Origin Location</div>
          <div className="text-slate-200 font-medium truncate mt-0.5">{trip.origin}</div>
        </div>

        <div className="sm:text-center">
          <div className="uppercase tracking-wider text-[10px] text-slate-500 font-semibold">Bypass Corridors</div>
          <div className="text-cyan-400 font-medium mt-0.5">
            {briefing?.alternateBypasses?.[0]?.name || 'Secondary bypasses monitored'}
          </div>
        </div>

        <div className="sm:text-right">
          <div className="uppercase tracking-wider text-[10px] text-slate-500 font-semibold">Target Destination</div>
          <div className="text-slate-200 font-medium truncate mt-0.5">{trip.destination}</div>
        </div>
      </div>
    </div>
  );
};
