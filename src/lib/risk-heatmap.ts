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

export const RISK_ZONES: RiskZone[] = [
  {
    id: 'zone-theft-1',
    category: 'theft',
    label: 'Janpath Market',
    latitude: 28.6263,
    longitude: 77.2177,
    intensity: 0.9,
    note: 'Pickpocket hotspot during peak shopping hours.',
  },
  {
    id: 'zone-theft-2',
    category: 'theft',
    label: 'Old Delhi Railway Gate',
    latitude: 28.6432,
    longitude: 77.2191,
    intensity: 0.8,
    note: 'Crowded footbridge; watch bags.',
  },
  {
    id: 'zone-harass-1',
    category: 'harassment',
    label: 'Barakhamba Crossing',
    latitude: 28.632,
    longitude: 77.22,
    intensity: 0.6,
    note: 'Reports of aggressive touts after 9pm.',
  },
  {
    id: 'zone-harass-2',
    category: 'harassment',
    label: 'Rajiv Chowk Entry',
    latitude: 28.6329,
    longitude: 77.2195,
    intensity: 0.7,
    note: 'Crowd swell due to metro diversions.',
  },
  {
    id: 'zone-danger-1',
    category: 'danger',
    label: 'Outer Circle Backlane',
    latitude: 28.6195,
    longitude: 77.2143,
    intensity: 0.65,
    note: 'Low lighting and closed shops after 10pm.',
  },
  {
    id: 'zone-danger-2',
    category: 'danger',
    label: 'Metro Exit F Corridor',
    latitude: 28.634,
    longitude: 77.2215,
    intensity: 0.55,
    note: 'Reports of aggressive touts and unsafe shortcuts.',
  },
];

export const HEAT_LEGEND = [
  { id: 'theft', label: 'Theft risk', color: 'rgba(244,67,54,0.35)' },
  { id: 'harassment', label: 'Harassment reports', color: 'rgba(255,152,0,0.35)' },
  { id: 'danger', label: 'Danger zones', color: 'rgba(116,63,181,0.35)' },
];
