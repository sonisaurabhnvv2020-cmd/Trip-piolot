import React, { useState } from 'react';
import { PreplannedTrip } from '../types';
import { GLOBAL_CITY_PRESETS } from '../data/presets';
import { X, MapPin, Clock, Bell, Sparkles, Navigation, Globe, Volume2 } from 'lucide-react';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrip: (trip: PreplannedTrip) => void;
  isLocatingGPS: boolean;
  onDetectGPS: (callback: (addr: string) => void) => void;
}

export const TripFormModal: React.FC<TripFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTrip,
  isLocatingGPS,
  onDetectGPS,
}) => {
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [scheduledDeparture, setScheduledDeparture] = useState('08:30');
  const [targetArrival, setTargetArrival] = useState('09:15');
  const [alertLeadMinutes, setAlertLeadMinutes] = useState(20);
  const [transportMode, setTransportMode] = useState<'car' | 'motorcycle' | 'cab' | 'transit'>('car');
  const [alertChime, setAlertChime] = useState<'executive' | 'subtle' | 'urgent'>('executive');
  const [notes, setNotes] = useState('');
  const [city, setCity] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (presetId: string) => {
    const found = GLOBAL_CITY_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setTitle(found.title);
      setOrigin(found.origin);
      setDestination(found.destination);
      setCity(`${found.city}, ${found.country}`);
      setAlertLeadMinutes(found.defaultLeadMinutes);
    }
  };

  const handleUseGPSForOrigin = () => {
    onDetectGPS((address) => {
      setOrigin(address);
      if (!title) setTitle(`Trip from ${address.slice(0, 24)}...`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !origin || !destination) return;

    const newTrip: PreplannedTrip = {
      id: 'trip-' + Date.now(),
      title,
      origin,
      destination,
      scheduledDeparture,
      targetArrival,
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      alertLeadMinutes,
      transportMode,
      units: 'metric',
      notes,
      city: city || 'Global Metro',
      isActive: true,
      alertChime,
    };

    onSaveTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Plan Pre-Trip Departure Routine</h3>
              <p className="text-xs text-slate-400">Configure departure targets and alert lead times</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Presets Quick Pick */}
        <div className="p-5 pb-0">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Worldwide Metro Quick-Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GLOBAL_CITY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id)}
                  className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-md transition-colors"
                >
                  {p.city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Trip Title & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trip Name / Routine</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Tech Hub Commute"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">City / Region</label>
              <input
                type="text"
                placeholder="e.g. London, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Origin Address with GPS Autofill */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Origin (Starting Point)</label>
              <button
                type="button"
                onClick={handleUseGPSForOrigin}
                disabled={isLocatingGPS}
                className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
              >
                <MapPin className="w-3 h-3" />
                <span>{isLocatingGPS ? 'Getting GPS...' : 'Use My Current Location'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. 742 Evergreen Terrace or Home"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Destination Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Destination (Target Point)</label>
            <input
              type="text"
              required
              placeholder="e.g. Downtown Innovation Center"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Departure & Arrival Times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Departure</span>
              </label>
              <input
                type="time"
                required
                value={scheduledDeparture}
                onChange={(e) => setScheduledDeparture(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Arrival</span>
              </label>
              <input
                type="time"
                required
                value={targetArrival}
                onChange={(e) => setTargetArrival(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Alert Lead Time & Chime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Alert Lead Time</span>
              </label>
              <select
                value={alertLeadMinutes}
                onChange={(e) => setAlertLeadMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={10}>10 minutes before departure</option>
                <option value={15}>15 minutes before departure</option>
                <option value={20}>20 minutes before departure (Standard)</option>
                <option value={30}>30 minutes before departure</option>
                <option value={45}>45 minutes before departure</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Departure Chime</span>
              </label>
              <select
                value={alertChime}
                onChange={(e) => setAlertChime(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="executive">Executive Harmonic Chime</option>
                <option value="subtle">Subtle Gentle Ping</option>
                <option value="urgent">Urgent Departure Warning</option>
              </select>
            </div>
          </div>

          {/* Context Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Context / Commute Constraints</label>
            <input
              type="text"
              placeholder="e.g. Need to arrive 5 mins early for client presentation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Scheduled Routine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
