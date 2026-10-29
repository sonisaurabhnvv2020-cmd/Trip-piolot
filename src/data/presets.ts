import { GlobalCityPreset, PreplannedTrip } from '../types';

export const GLOBAL_CITY_PRESETS: GlobalCityPreset[] = [
  {
    id: 'mumbai-bkc',
    city: 'Mumbai',
    country: 'India',
    title: 'Andheri West to BKC Financial Hub',
    origin: 'Lokhandwala Complex, Andheri West, Mumbai',
    destination: 'Bandra Kurla Complex (BKC), G Block, Mumbai',
    typicalRushHour: '08:30 - 11:00 AM',
    defaultLeadMinutes: 25,
    units: 'metric',
  },
  {
    id: 'london-heathrow',
    city: 'London',
    country: 'United Kingdom',
    title: 'Kensington to Heathrow Airport Terminal 5',
    origin: 'High Street Kensington, London',
    destination: 'Heathrow Airport Terminal 5, Hounslow',
    typicalRushHour: '07:30 - 10:00 AM',
    defaultLeadMinutes: 30,
    units: 'metric',
  },
  {
    id: 'nyc-midtown',
    city: 'New York',
    country: 'United States',
    title: 'Brooklyn Heights to Midtown Manhattan',
    origin: 'Montague St, Brooklyn Heights, NY',
    destination: 'Grand Central Terminal, 42nd St, New York, NY',
    typicalRushHour: '07:45 - 09:45 AM',
    defaultLeadMinutes: 20,
    units: 'imperial',
  },
  {
    id: 'tokyo-shibuya',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Kichijoji Station to Shibuya Crossing',
    origin: 'Kichijoji Minamicho, Musashino, Tokyo',
    destination: 'Shibuya Scramble Crossing, Shibuya, Tokyo',
    typicalRushHour: '08:00 - 09:30 AM',
    defaultLeadMinutes: 20,
    units: 'metric',
  },
  {
    id: 'dubai-marina',
    city: 'Dubai',
    country: 'United Arab Emirates',
    title: 'Downtown Burj Khalifa to Dubai Marina',
    origin: 'Downtown Dubai, Boulevard Point',
    destination: 'Dubai Marina Walk, Dubai',
    typicalRushHour: '17:30 - 20:00 PM',
    defaultLeadMinutes: 20,
    units: 'metric',
  },
  {
    id: 'sf-silicon-valley',
    city: 'San Francisco',
    country: 'United States',
    title: 'Mission District to Palo Alto Tech Campus',
    origin: 'Valencia St & 18th St, San Francisco, CA',
    destination: 'University Ave, Palo Alto, CA',
    typicalRushHour: '07:30 - 09:30 AM',
    defaultLeadMinutes: 25,
    units: 'imperial',
  },
];

// Helper to generate dynamic scheduled times for a fresh demo experience
const getDemoTime = (offsetMinutes: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const INITIAL_DEFAULT_TRIPS: PreplannedTrip[] = [
  {
    id: 'trip-daily-commute',
    title: 'Morning Office Commute',
    origin: 'Home - Residential Sector 62',
    destination: 'Tech District - Innovation Tower 4',
    scheduledDeparture: getDemoTime(18), // 18 minutes from right now for immediate countdown demo!
    targetArrival: getDemoTime(58),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    alertLeadMinutes: 20,
    transportMode: 'car',
    units: 'metric',
    notes: 'Morning executive standup starts at arrival time. Crucial to avoid highway choke.',
    city: 'Global Metro Hub',
    isActive: true,
    alertChime: 'executive',
  },
  {
    id: 'trip-client-visit',
    title: 'Afternoon Client Consultation',
    origin: 'Main Corporate Headquarters',
    destination: 'Westside Logistics Park, Gateway 3',
    scheduledDeparture: getDemoTime(110),
    targetArrival: getDemoTime(145),
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    alertLeadMinutes: 30,
    transportMode: 'car',
    units: 'metric',
    notes: 'Requires carrying project materials. Prefer smooth roads over bumpy detours.',
    city: 'Metropolitan Area',
    isActive: true,
    alertChime: 'subtle',
  },
];
