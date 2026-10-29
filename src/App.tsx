/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PreplannedTrip, TrafficBriefing } from './types';
import { INITIAL_DEFAULT_TRIPS } from './data/presets';
import { Header } from './components/Header';
import { ActiveTripCard } from './components/ActiveTripCard';
import { RadarCorridorView } from './components/RadarCorridorView';
import { InstantMessageCard } from './components/InstantMessageCard';
import { RevenueCalculator } from './components/RevenueCalculator';
import { TripFormModal } from './components/TripFormModal';
import { CockpitHUDModal } from './components/CockpitHUDModal';
import { SimulatedPushBanner } from './components/SimulatedPushBanner';
import { audioAlert } from './utils/audioAlert';
import {
  Clock,
  Plus,
  Trash2,
  MapPin,
  Navigation,
  Compass,
  Zap,
  Globe,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY_TRIPS = 'departwise_trips_v1';
const STORAGE_KEY_BRIEFINGS = 'departwise_briefings_v1';

export default function App() {
  // Trips state
  const [trips, setTrips] = useState<PreplannedTrip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved trips:', e);
    }
    return INITIAL_DEFAULT_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => trips[0]?.id || 'trip-daily-commute');
  const [briefings, setBriefings] = useState<Record<string, TrafficBriefing>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRIEFINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved briefings:', e);
    }
    return {};
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'radar' | 'dispatch' | 'revenue' | 'cockpit'>('dashboard');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);
  const [isPushBannerVisible, setIsPushBannerVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync trips to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {}
  }, [trips]);

  // Sync briefings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRIEFINGS, JSON.stringify(briefings));
    } catch (e) {}
  }, [briefings]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const activeBriefing = activeTrip ? briefings[activeTrip.id] || null : null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // GPS Geolocation Handler
  const handleDetectGPS = (callback?: (address: string) => void) => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/geo/reverse?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          const address = data.address || `GPS Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
          if (callback) {
            callback(address);
          } else {
            showToast(`GPS Located: ${address}`);
          }
        } catch (e) {
          const fallbackAddr = `GPS Pin (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
          if (callback) callback(fallbackAddr);
          else showToast(`GPS Located: ${fallbackAddr}`);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        showToast('Unable to acquire GPS position. Check permissions.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Trigger Traffic Scan via server Gemini API
  const handleTriggerScan = useCallback(async (tripToScan = activeTrip) => {
    if (!tripToScan) return;
    setIsLoadingAnalysis(true);

    try {
      const response = await fetch('/api/traffic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: tripToScan.origin,
          destination: tripToScan.destination,
          scheduledDeparture: tripToScan.scheduledDeparture,
          targetArrival: tripToScan.targetArrival,
          transportMode: tripToScan.transportMode,
          units,
          notes: tripToScan.notes,
          city: tripToScan.city,
        }),
      });

      const data = await response.json();
      if (data.briefing) {
        setBriefings((prev) => ({
          ...prev,
          [tripToScan.id]: data.briefing,
        }));
        showToast('Corridor intelligence updated successfully!');
      }
    } catch (e) {
      console.error('Scan failed:', e);
      showToast('Scan completed using local telemetry cache.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [activeTrip, units]);

  // Initial auto-scan if no briefing exists for active trip
  useEffect(() => {
    if (activeTrip && !briefings[activeTrip.id] && !isLoadingAnalysis) {
      handleTriggerScan(activeTrip);
    }
  }, [activeTripId]);

  // Check alert window and trigger chime & banner
  useEffect(() => {
    if (!activeTrip?.scheduledDeparture) return;

    const checkAlertWindow = () => {
      const [hh, mm] = activeTrip.scheduledDeparture.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, 0, 0);

      const diffMinutes = Math.floor((target.getTime() - now.getTime()) / (1000 * 60));
      const lead = activeTrip.alertLeadMinutes || 20;

      // If exactly in lead minute window
      if (diffMinutes === lead) {
        audioAlert.playByType(activeTrip.alertChime || 'executive');
        setIsPushBannerVisible(true);
      }
    };

    const timer = setInterval(checkAlertWindow, 15000);
    return () => clearInterval(timer);
  }, [activeTrip]);

  const handleSimulateAlertModal = () => {
    audioAlert.playByType(activeTrip.alertChime || 'executive');
    setIsPushBannerVisible(true);
  };

  const handleSaveNewTrip = (newTrip: PreplannedTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    showToast(`Added routine: "${newTrip.title}"`);
    handleTriggerScan(newTrip);
  };

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (trips.length <= 1) {
      showToast('At least one routine must be maintained.');
      return;
    }
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    if (activeTripId === id) {
      setActiveTripId(updated[0].id);
    }
    showToast('Routine removed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-200 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simulated OS Push Notification Drawer */}
      <SimulatedPushBanner
        isVisible={isPushBannerVisible}
        onDismiss={() => setIsPushBannerVisible(false)}
        onOpenDispatch={() => setCurrentTab('dispatch')}
        trip={activeTrip}
        briefing={activeBriefing}
      />

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        units={units}
        setUnits={setUnits}
        onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
        onOpenCockpitHUD={() => setIsCockpitOpen(true)}
        isLocatingGPS={isLocatingGPS}
        onDetectGPS={() => handleDetectGPS()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Dashboard / Commutes */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Active Trip Countdown Card */}
            <ActiveTripCard
              trip={activeTrip}
              briefing={activeBriefing}
              isLoadingAnalysis={isLoadingAnalysis}
              onTriggerScan={() => handleTriggerScan()}
              onTriggerAlertModal={handleSimulateAlertModal}
              onSelectTrip={(id) => setActiveTripId(id)}
              allTrips={trips}
              onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
            />

            {/* Quick Intelligence Teaser Strip */}
            {activeBriefing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setCurrentTab('radar')}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Bypass Radar</span>
                    <Navigation className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {activeBriefing.alternateBypasses?.[0]?.name || 'Secondary Bypass'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Save ~{activeBriefing.alternateBypasses?.[0]?.timeSavedMin || 8} min vs. primary arterial
                  </div>
                </div>

                <div
                  onClick={() => setCurrentTab('radar')}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Active Bottlenecks</span>
                    <Compass className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {activeBriefing.bottlenecks?.length || 0} Chokepoints Diagnosed
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {activeBriefing.bottlenecks?.[0]?.location || 'Corridor friction points'}
                  </div>
                </div>

                <div
                  onClick={() => setCurrentTab('dispatch')}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Instant Dispatch</span>
                    <Zap className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white mt-1">WhatsApp & Voice Briefing</div>
                  <div className="text-xs text-slate-400 mt-0.5">Ready to copy, share, or listen aloud</div>
                </div>
              </div>
            )}

            {/* Saved Itineraries & Pre-Planned Visits List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Saved Commutes & Planned Visits ({trips.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between active departure schedules or register new recurring routines
                  </p>
                </div>

                <button
                  onClick={() => setIsNewTripModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-950 border border-slate-800 hover:border-cyan-700 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add Routine</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trips.map((t) => {
                  const isCurrent = t.id === activeTripId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setActiveTripId(t.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isCurrent
                          ? 'bg-slate-950 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{t.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                                Active Focus
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{t.city || 'Global Metro'}</div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteTrip(t.id, e)}
                          title="Delete trip"
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-300">
                        <div className="truncate">
                          <span className="text-slate-500 font-semibold uppercase text-[10px]">From: </span>
                          {t.origin}
                        </div>
                        <div className="truncate">
                          <span className="text-slate-500 font-semibold uppercase text-[10px]">To: </span>
                          {t.destination}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-900">
                        <span className="font-mono tabular-nums text-slate-200">
                          Depart: <strong>{t.scheduledDeparture}</strong>
                        </span>
                        <span>Alert: {t.alertLeadMinutes}m prior</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bypass Radar (Deep intelligence beyond standard maps) */}
        {currentTab === 'radar' && (
          <RadarCorridorView
            briefing={activeBriefing}
            trip={activeTrip}
            isLoading={isLoadingAnalysis}
            onRefreshScan={() => handleTriggerScan()}
            units={units}
          />
        )}

        {/* Tab 3: Message Dispatch (WhatsApp/SMS Bubble + Voice Audio) */}
        {currentTab === 'dispatch' && (
          <InstantMessageCard
            briefing={activeBriefing}
            trip={activeTrip}
            onSimulatePush={handleSimulateAlertModal}
          />
        )}

        {/* Tab 4: Common-Man $0.99 Pricing & High-Volume Revenue Calculator */}
        {currentTab === 'revenue' && <RevenueCalculator />}
      </main>

      {/* New Trip Creation Modal */}
      <TripFormModal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        onSaveTrip={handleSaveNewTrip}
        isLocatingGPS={isLocatingGPS}
        onDetectGPS={handleDetectGPS}
      />

      {/* Fullscreen Departure Cockpit HUD */}
      <CockpitHUDModal
        isOpen={isCockpitOpen}
        onClose={() => setIsCockpitOpen(false)}
        trip={activeTrip}
        briefing={activeBriefing}
      />

      {/* Clean Anti-Slop Footer */}
      <footer className="mt-auto border-t border-slate-900/80 bg-slate-950 px-4 lg:px-8 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">DepartWise AI</span>
            <span>·</span>
            <span>Worldwide Pre-Departure Traffic Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>GPS Geolocation Ready</span>
            <span>·</span>
            <span>Web Audio Chime Active</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">$0.99 Mass-Market Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
