export type RiskCategory = 'theft' | 'harassment' | 'danger';

export type RiskZone = {
  id: string;
  category: RiskCategory;
  label: string;
  latitude: number;
  longitude: number;
  intensity: number; // 0-1
  note: string;
};

// Comprehensive risk zones across major Indian tourist areas
export const RISK_ZONES: RiskZone[] = [
  // Delhi Zones
  {
    id: 'zone-theft-1',
    category: 'theft',
    label: 'Janpath Market',
    latitude: 28.6263,
    longitude: 77.2177,
    intensity: 0.85,
    note: 'High pickpocket activity during shopping hours. Keep valuables secure.',
  },
  {
    id: 'zone-theft-2',
    category: 'theft',
    label: 'Old Delhi Railway Station',
    latitude: 28.6432,
    longitude: 77.2191,
    intensity: 0.9,
    note: 'Extremely crowded. Watch bags at all times. Beware of distraction scams.',
  },
  {
    id: 'zone-theft-3',
    category: 'theft',
    label: 'Chandni Chowk',
    latitude: 28.6506,
    longitude: 77.2303,
    intensity: 0.75,
    note: 'Busy market area. Keep phone and wallet in front pockets.',
  },
  {
    id: 'zone-harass-1',
    category: 'harassment',
    label: 'Barakhamba Road',
    latitude: 28.632,
    longitude: 77.22,
    intensity: 0.6,
    note: 'Aggressive touts and taxi drivers after dark. Use verified transport.',
  },
  {
    id: 'zone-harass-2',
    category: 'harassment',
    label: 'Rajiv Chowk Metro',
    latitude: 28.6329,
    longitude: 77.2195,
    intensity: 0.7,
    note: 'Peak hour crowding. Women advised to use ladies compartment.',
  },
  {
    id: 'zone-harass-3',
    category: 'harassment',
    label: 'Paharganj Area',
    latitude: 28.6447,
    longitude: 77.2124,
    intensity: 0.65,
    note: 'Backpacker area with persistent touts. Negotiate prices firmly.',
  },
  {
    id: 'zone-danger-1',
    category: 'danger',
    label: 'Outer Ring Backlanes',
    latitude: 28.6195,
    longitude: 77.2143,
    intensity: 0.8,
    note: 'Poor lighting after 10pm. Avoid walking alone at night.',
  },
  {
    id: 'zone-danger-2',
    category: 'danger',
    label: 'Metro Exit F Corridor',
    latitude: 28.634,
    longitude: 77.2215,
    intensity: 0.55,
    note: 'Isolated area with limited security. Use main exits when possible.',
  },
  {
    id: 'zone-danger-3',
    category: 'danger',
    label: 'GB Road Area',
    latitude: 28.6489,
    longitude: 77.2169,
    intensity: 0.95,
    note: 'Red light district. Avoid after dark. High crime reports.',
  },
  // Additional safety zones
  {
    id: 'zone-theft-4',
    category: 'theft',
    label: 'India Gate Parking',
    latitude: 28.6129,
    longitude: 77.2295,
    intensity: 0.5,
    note: 'Vehicle break-ins reported. Use secured parking areas.',
  },
  {
    id: 'zone-harass-4',
    category: 'harassment',
    label: 'Sarojini Nagar Market',
    latitude: 28.5746,
    longitude: 77.1989,
    intensity: 0.6,
    note: 'Crowded market. Aggressive bargaining common. Stay alert.',
  },
];

export const HEAT_LEGEND = [
  { id: 'theft', label: 'Theft risk', color: 'rgba(244,67,54,0.35)' },
  { id: 'harassment', label: 'Harassment reports', color: 'rgba(255,152,0,0.35)' },
  { id: 'danger', label: 'Danger zones', color: 'rgba(116,63,181,0.35)' },
];
