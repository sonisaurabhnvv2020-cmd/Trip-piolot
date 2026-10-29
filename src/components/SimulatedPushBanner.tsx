import React from 'react';
import { Compass, X, ArrowRight, Volume2 } from 'lucide-react';
import { PreplannedTrip, TrafficBriefing } from '../types';

interface SimulatedPushBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  onOpenDispatch: () => void;
  trip: PreplannedTrip;
  briefing: TrafficBriefing | null;
}

export const SimulatedPushBanner: React.FC<SimulatedPushBannerProps> = ({
  isVisible,
  onDismiss,
  onOpenDispatch,
  trip,
  briefing,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-bounce-subtle">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">DepartWise AI Dispatch</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                  Pre-Departure Alert
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Scheduled Visit: {trip.title}</div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Message Text */}
        <p className="text-xs text-slate-200 mt-2.5 leading-relaxed font-sans">
          {briefing ? (
            <>
              {briefing.departureWindowRecommendation?.advice ||
                `Time to prepare departure! Primary route has ${briefing.delayMin}m delay. Best bypass saves ${briefing.alternateBypasses?.[0]?.timeSavedMin || 8}m.`}
            </>
          ) : (
            `Departure time (${trip.scheduledDeparture}) approaching in ${trip.alertLeadMinutes} minutes. Tap to inspect traffic bottlenecks.`
          )}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs">
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-200 text-[11px] font-medium"
          >
            Dismiss
          </button>

          <button
            onClick={() => {
              onDismiss();
              onOpenDispatch();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <span>Review Route Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
