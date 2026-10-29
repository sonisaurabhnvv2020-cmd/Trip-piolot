import React from 'react';
import { TrafficBriefing, PreplannedTrip } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  Gauge,
  Info,
  Navigation,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Umbrella,
  Zap,
} from 'lucide-react';

interface RadarCorridorViewProps {
  briefing: TrafficBriefing | null;
  trip: PreplannedTrip;
  isLoading: boolean;
  onRefreshScan: () => void;
  units: 'metric' | 'imperial';
}

export const RadarCorridorView: React.FC<RadarCorridorViewProps> = ({
  briefing,
  trip,
  isLoading,
  onRefreshScan,
  units,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-spin">
          <Compass className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white font-display">Scanning Global Corridor Intelligence...</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Gemini is analyzing chokepoints along {trip.origin} ➔ {trip.destination}, evaluating construction merges, calculating secret bypass backdoors, and factoring weather friction.
        </p>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
          <Navigation className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-white font-display">No Corridor Scan Run Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Click the button below to initiate an AI pre-departure traffic diagnosis that inspects chokepoint causes and identifies bypass backdoors before you leave.
        </p>
        <button
          onClick={onRefreshScan}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Scan Traffic Corridor Now</span>
        </button>
      </div>
    );
  }

  const isMetric = units !== 'imperial';
  const distanceFormatted = isMetric
    ? `${briefing.distanceKm.toFixed(1)} km`
    : `${(briefing.distanceKm * 0.621371).toFixed(1)} miles`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clear':
        return {
          label: 'Free-Flowing Corridor',
          className: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
          dot: 'bg-emerald-400',
        };
      case 'moderate':
        return {
          label: 'Moderate Peak Friction',
          className: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
          dot: 'bg-amber-400',
        };
      case 'heavy':
        return {
          label: 'Heavy Chokepoints Active',
          className: 'text-orange-400 bg-orange-950/60 border-orange-800/80',
          dot: 'bg-orange-400',
        };
      case 'gridlock':
        return {
          label: 'Severe Corridor Gridlock',
          className: 'text-red-400 bg-red-950/60 border-red-800/80',
          dot: 'bg-red-400',
        };
      default:
        return {
          label: 'Monitored',
          className: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80',
          dot: 'bg-cyan-400',
        };
    }
  };

  const statusInfo = getStatusBadge(briefing.status);

  return (
    <div className="space-y-6">
      {/* Top Banner: Corridor Overview & Quick Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 ${statusInfo.className}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              <span>{statusInfo.label}</span>
            </div>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Scanned at <strong className="font-mono text-slate-300">{new Date(briefing.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </span>
          </div>

          <button
            onClick={onRefreshScan}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Scan Corridor</span>
          </button>
        </div>

        {/* Corridor Narrative Insight */}
        <div className="pt-4 pb-2">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Executive Traffic Intelligence Brief</span>
          </h3>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{briefing.corridorSummary}</p>
        </div>

        {/* 4 Metric Strip (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 mt-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Travel Time (Primary)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              {briefing.estimatedTravelTimeMin} <span className="text-xs font-sans font-normal text-slate-400">min</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Baseline: {briefing.baselineTimeMin} min</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Congestion Delay</div>
            <div className={`text-xl font-bold font-mono tabular-nums mt-1 ${briefing.delayMin > 10 ? 'text-rose-400' : briefing.delayMin > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              +{briefing.delayMin} <span className="text-xs font-sans font-normal text-slate-400">min delay</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {briefing.delayMin === 0 ? 'Normal velocity' : 'Peak volume slowdown'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Distance</div>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">{distanceFormatted}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Corridor length</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Weather Friction</div>
            <div className="text-xl font-bold font-mono tabular-nums text-cyan-300 mt-1 flex items-center gap-1.5">
              <Umbrella className="w-4 h-4 text-cyan-400" />
              <span>+{briefing.weatherFactor?.weatherDelayMin || 0}m</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">{briefing.weatherFactor?.condition || 'Standard'}</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Primary Highway vs AI Secret Bypasses ("Different from Google Maps") */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Route Intelligence: Standard Map vs. AI Secret Bypasses</span>
            </h3>
            <p className="text-xs text-slate-400">
              Unlike standard navigation that herds drivers onto the same crowded expressway, DepartWise uncovers local bypass corridors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Standard Route */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Standard Navigation Route</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                {briefing.estimatedTravelTimeMin} min
              </span>
            </div>

            <div className="text-sm font-semibold text-white">Main Highway / Central Expressway</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct arterial followed by generic map apps. Prone to severe slowdowns around major exit ramps and signal clusters.
            </p>

            <div className="bg-slate-950/80 rounded-lg p-2.5 text-xs space-y-1 border border-slate-800">
              <div className="text-rose-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacted by {briefing.bottlenecks.length} active bottlenecks</span>
              </div>
              <div className="text-slate-400 text-[11px]">Average speed reduced by ~{Math.min(45, briefing.delayMin * 3)}% during current peak window.</div>
            </div>
          </div>

          {/* Card B: AI Secret Bypass (Recommended) */}
          {briefing.alternateBypasses.length > 0 ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-cyan-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-lg shadow-cyan-950/20">
              <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                AI Backdoor Pick
              </div>

              <div className="flex items-center justify-between pr-24">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">AI Recommended Bypass</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                  {briefing.alternateBypasses[0].travelTimeMin} min (Save {briefing.alternateBypasses[0].timeSavedMin}m)
                </span>
              </div>

              <div className="text-sm font-bold text-white">{briefing.alternateBypasses[0].name}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{briefing.alternateBypasses[0].description}</p>

              <div className="bg-slate-950/90 rounded-lg p-3 text-xs space-y-1.5 border border-slate-800">
                <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Advantage: {briefing.alternateBypasses[0].pros}</span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Road Quality: {briefing.alternateBypasses[0].roadQuality}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center text-xs text-slate-400">
              No secondary bypass required; main arterial is currently free-flowing.
            </div>
          )}
        </div>
      </div>

      {/* Bottleneck Deep-Dive Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Bottleneck Root Cause Diagnosis ({briefing.bottlenecks.length} Identified)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Exact reasons why traffic stalls along this corridor, from construction bottlenecks to school hours and signal desyncs.
          </p>
        </div>

        <div className="space-y-3">
          {briefing.bottlenecks.map((b, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{b.location}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      b.severity === 'critical'
                        ? 'text-red-400 bg-red-950/60 border-red-800/80'
                        : b.severity === 'heavy'
                        ? 'text-orange-400 bg-orange-950/60 border-orange-800/80'
                        : 'text-amber-400 bg-amber-950/60 border-amber-800/80'
                    }`}
                  >
                    {b.severity} severity
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">+{b.delayMinutes}m delay</span>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-slate-400">Root Cause: </strong>
                  {b.cause}
                </div>

                <div className="text-xs text-cyan-300/90 bg-cyan-950/30 border border-cyan-800/40 rounded-lg px-2.5 py-1.5 mt-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-cyan-200">AI Tactical Advice: </strong>
                    {b.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Weather Friction & Optimal Departure Window Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Weather & Road Grip Layer */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>Corridor Weather & Pavement Grip</span>
            </h4>
            <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {briefing.weatherFactor?.tempC}°C
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Atmospheric State:</span>
              <span className="font-medium text-white">{briefing.weatherFactor?.condition}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Pavement Traction:</span>
              <span className="capitalize font-medium text-emerald-400">{briefing.weatherFactor?.roadSlickness}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Visibility:</span>
              <span className="font-mono text-white">{briefing.weatherFactor?.visibilityKm} km</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed italic">
            "{briefing.weatherFactor?.advisory}"
          </div>
        </div>

        {/* Departure Window Recommendation */}
        <div className="md:col-span-7 bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Optimal Departure Time Window</span>
              </h4>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                Target: {briefing.departureWindowRecommendation?.bestDepartureTime}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-200 mt-2 leading-relaxed">
              {briefing.departureWindowRecommendation?.advice}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/80 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Save If Leave Now</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                ~{briefing.departureWindowRecommendation?.timeSavedIfLeaveNow || 10} min
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Delay If Wait 20m</div>
              <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                +{briefing.departureWindowRecommendation?.delayIfWait20m || 15} min
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
