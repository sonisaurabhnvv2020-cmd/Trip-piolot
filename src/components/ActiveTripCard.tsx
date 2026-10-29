import React, { useState, useEffect } from 'react';
import { PreplannedTrip, TrafficBriefing } from '../types';
import { Clock, MapPin, ArrowRight, Bell, Zap, Volume2, Car, Navigation, ShieldCheck, Sparkles } from 'lucide-react';
import { audioAlert } from '../utils/audioAlert';

interface ActiveTripCardProps {
  trip: PreplannedTrip;
  briefing: TrafficBriefing | null;
  isLoadingAnalysis: boolean;
  onTriggerScan: () => void;
  onTriggerAlertModal: () => void;
  onSelectTrip: (tripId: string) => void;
  allTrips: PreplannedTrip[];
  onOpenNewTripModal: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  briefing,
  isLoadingAnalysis,
  onTriggerScan,
  onTriggerAlertModal,
  onSelectTrip,
  allTrips,
  onOpenNewTripModal,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isPast: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!trip?.scheduledDeparture) return;
      const [depHours, depMins] = trip.scheduledDeparture.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(depHours, depMins, 0, 0);

      let diffMs = target.getTime() - now.getTime();
      let isPast = false;

      // If already past today, calculate for tomorrow
      if (diffMs < 0) {
        if (Math.abs(diffMs) < 1000 * 60 * 60 * 2) {
          // within 2 hours past
          isPast = true;
          diffMs = Math.abs(diffMs);
        } else {
          target.setDate(target.getDate() + 1);
          diffMs = target.getTime() - now.getTime();
        }
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, isPast });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [trip?.scheduledDeparture]);

  const isAlertWindowActive =
    !timeLeft.isPast && timeLeft.hours === 0 && timeLeft.minutes <= (trip.alertLeadMinutes || 20);

  const handleTestChime = () => {
    audioAlert.playByType(trip.alertChime || 'executive');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top row: Trip Selector & Live Alert Window State */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Active Scheduled Visit</span>
          <span className="text-slate-600">·</span>
          <select
            value={trip.id}
            onChange={(e) => onSelectTrip(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {allTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.scheduledDeparture})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {isAlertWindowActive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium animate-pulse">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Departure Alert Window Active ({trip.alertLeadMinutes}m prior)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <span>Alert triggers {trip.alertLeadMinutes}m before departure</span>
            </div>
          )}

          <button
            onClick={handleTestChime}
            title="Preview arrival/departure chime sound"
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-cyan-300 bg-slate-950/80 border border-slate-800 rounded-lg transition-colors"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Sound Chime</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Corridor Details + Countdown Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
        {/* Left Column: Corridor Route Info */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
              <span>{trip.title}</span>
              <span className="text-xs font-normal text-slate-400 font-sans px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                {trip.city || 'Global Metro'}
              </span>
            </h2>
            {trip.notes && <p className="text-xs text-slate-400 mt-1 italic">"{trip.notes}"</p>}
          </div>

          {/* Visual Route Points */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Origin (Departure Point)</div>
                <div className="text-sm font-medium text-slate-200 truncate">{trip.origin}</div>
              </div>
            </div>

            <div className="pl-3 border-l border-dashed border-slate-700/60 ml-3 h-3" />

            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Target Destination</div>
                <div className="text-sm font-medium text-slate-200 truncate">{trip.destination}</div>
              </div>
            </div>
          </div>

          {/* Schedule Metadata Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Departure:</span>
              <span className="font-mono tabular-nums text-white font-semibold">{trip.scheduledDeparture}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span>Target Arrival:</span>
              <span className="font-mono tabular-nums text-white font-semibold">{trip.targetArrival}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{trip.transportMode}</span>
            </span>
            <span>·</span>
            <span className="text-slate-400">Active Days: {trip.daysOfWeek.join(', ')}</span>
          </div>
        </div>

        {/* Right Column: Pre-Departure Tabular Countdown & Action Box */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              {timeLeft.isPast ? 'Trip Departure In Progress' : 'Time Remaining Until Departure'}
            </div>

            {/* High-Impact Tabular Digits */}
            <div className="font-mono tabular-nums text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-8 text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              <span>Hours</span>
              <span>Minutes</span>
              <span>Seconds</span>
            </div>
          </div>

          {/* Departure Status Indicator */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 flex items-center justify-center gap-2">
            {briefing ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  Briefing Ready: <strong className="text-white">{briefing.estimatedTravelTimeMin}m</strong> est. travel ({briefing.delayMin > 0 ? `+${briefing.delayMin}m delay` : 'Clear corridor'})
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Ready for pre-departure route intelligence scan</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onTriggerScan}
              disabled={isLoadingAnalysis}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg transition-all shadow-md shadow-cyan-500/15 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isLoadingAnalysis ? 'animate-spin' : ''}`} />
              <span>{isLoadingAnalysis ? 'Scanning...' : 'Scan Traffic Now'}</span>
            </button>

            <button
              onClick={onTriggerAlertModal}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
