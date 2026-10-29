export interface PreplannedTrip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  scheduledDeparture: string; // HH:mm format e.g. "08:30"
  targetArrival: string; // HH:mm format e.g. "09:15"
  daysOfWeek: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  alertLeadMinutes: number; // e.g. 20 (alert triggers 20 mins before departure)
  transportMode: 'car' | 'motorcycle' | 'cab' | 'transit';
  units: 'metric' | 'imperial';
  notes?: string;
  city?: string;
  isActive: boolean;
  alertChime: 'executive' | 'subtle' | 'urgent';
}

export interface TrafficBottleneck {
  location: string;
  cause: string;
  severity: 'moderate' | 'heavy' | 'critical';
  delayMinutes: number;
  recommendation: string;
}

export interface SecretBypass {
  name: string;
  description: string;
  travelTimeMin: number;
  timeSavedMin: number;
  avoidsBottlenecks: string[];
  roadQuality: string;
  pros: string;
  cons: string;
}

export interface TrafficBriefing {
  tripId: string;
  generatedAt: string;
  status: 'clear' | 'moderate' | 'heavy' | 'gridlock';
  corridorSummary: string;
  estimatedTravelTimeMin: number;
  baselineTimeMin: number;
  delayMin: number;
  distanceKm: number;
  weatherFactor: {
    condition: string;
    tempC: number;
    roadSlickness: 'dry' | 'damp' | 'wet' | 'icy';
    visibilityKm: number;
    weatherDelayMin: number;
    advisory: string;
  };
  bottlenecks: TrafficBottleneck[];
  alternateBypasses: SecretBypass[];
  departureWindowRecommendation: {
    bestDepartureTime: string;
    advice: string;
    delayIfWait20m: number;
    timeSavedIfLeaveNow: number;
  };
  instantMessagePayload: string;
  voiceScript: string;
}

export interface GlobalCityPreset {
  id: string;
  city: string;
  country: string;
  title: string;
  origin: string;
  destination: string;
  typicalRushHour: string;
  defaultLeadMinutes: number;
  units: 'metric' | 'imperial';
}
