export type Trend = 'up' | 'down' | 'steady';

export interface SafetyMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: Trend;
  trendLabel: string;
  score: number;
}

export type AlertLevel = 'critical' | 'warning' | 'info';

export interface SafetyAlert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  distanceKm: number;
  updatedAt: string;
  guidance: string;
  latitude: number;
  longitude: number;
  impactRadius: number;
}

export interface SafeSpot {
  id: string;
  name: string;
  type: 'embassy' | 'hospital' | 'police';
  address: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  notes: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  location: string;
  lastCheckIn: string;
  status: 'ok' | 'pending';
}

export interface PreparednessSection {
  id: string;
  title: string;
  items: string[];
}

export interface ResourceLink {
  id: string;
  title: string;
  summary: string;
  contactLabel: string;
  contactValue: string;
}

export const SAFETY_METRICS: SafetyMetric[] = [
  {
    id: 'city-risk',
    label: 'City Risk',
    value: 'Moderate',
    detail: 'Nightlife districts are crowded but stable.',
    trend: 'steady',
    trendLabel: 'No major changes in the last 4h',
    score: 64,
  },
  {
    id: 'crowd-density',
    label: 'Crowd Density',
    value: 'High',
    detail: 'Market areas peaking due to festivals.',
    trend: 'up',
    trendLabel: '+8% vs. daily average',
    score: 78,
  },
  {
    id: 'weather',
    label: 'Weather',
    value: 'Storm watch',
    detail: 'Short burst of rain expected after 7pm.',
    trend: 'down',
    trendLabel: 'Moderating winds',
    score: 52,
  },
];

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-1',
    level: 'critical',
    title: 'Demonstration reported',
    description: 'Large gathering with heavy police presence near the central square.',
    distanceKm: 1.2,
    updatedAt: '5 min ago',
    guidance: 'Avoid the main boulevard and use 4th street to bypass.',
    latitude: 28.6143,
    longitude: 77.2089,
    impactRadius: 400,
  },
  {
    id: 'alert-2',
    level: 'warning',
    title: 'Transit disruption',
    description: 'Metro line 2 temporarily suspended due to maintenance.',
    distanceKm: 2.7,
    updatedAt: '22 min ago',
    guidance: 'Use ride-share or shuttle buses from Rajiv Chowk.',
    latitude: 28.6328,
    longitude: 77.2197,
    impactRadius: 250,
  },
  {
    id: 'alert-3',
    level: 'info',
    title: 'Weather advisory',
    description: 'Lightning risk flagged for open parks later tonight.',
    distanceKm: 4.1,
    updatedAt: '40 min ago',
    guidance: 'Plan indoor activities after sunset.',
    latitude: 28.59,
    longitude: 77.24,
    impactRadius: 600,
  },
];

export const SAFE_SPOTS: SafeSpot[] = [
  {
    id: 'safe-embassy',
    name: 'Embassy Assistance Center',
    type: 'embassy',
    address: 'Chanakyapuri Diplomatic Enclave',
    distanceKm: 3.5,
    latitude: 28.5979,
    longitude: 77.1878,
    notes: '24/7 desk with translators on-site.',
  },
  {
    id: 'safe-hospital',
    name: 'CityCare Hospital',
    type: 'hospital',
    address: 'Sector 4, Connaught Place',
    distanceKm: 2.1,
    latitude: 28.6315,
    longitude: 77.2167,
    notes: 'Emergency trauma ward and pharmacy.',
  },
  {
    id: 'safe-police',
    name: 'Tourist Police Booth',
    type: 'police',
    address: 'Janpath Road',
    distanceKm: 1.6,
    latitude: 28.625,
    longitude: 77.213,
    notes: 'English-speaking officers available.',
  },
];

export const TRUSTED_CONTACTS: TrustedContact[] = [
  {
    id: 'contact-1',
    name: 'Riya Sharma',
    relation: 'Local guide',
    phone: '+911100000001',
    location: '0.8 km away · Karol Bagh',
    lastCheckIn: '2 min ago',
    status: 'ok',
  },
  {
    id: 'contact-2',
    name: 'Daniel Kim',
    relation: 'Travel buddy',
    phone: '+82100000002',
    location: 'Hotel base · Connaught Place',
    lastCheckIn: 'Waiting',
    status: 'pending',
  },
];

export const PREPAREDNESS: PreparednessSection[] = [
  {
    id: 'docs',
    title: 'Document vault',
    items: ['Passport scan uploaded', 'Insurance card backed up', 'Visa copy synced to cloud'],
  },
  {
    id: 'kit',
    title: 'Go bag checklist',
    items: ['Reusable water pouch filled', 'Power bank at 90%', 'Offline maps downloaded'],
  },
  {
    id: 'local',
    title: 'Local insights',
    items: ['Festival crowd rules reviewed', 'Curfew times noted', 'Recommended taxi operators saved'],
  },
];

export const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: 'helpline',
    title: 'Tourist safety helpline',
    summary: '24/7 bilingual operators for any incident.',
    contactLabel: 'Call',
    contactValue: '1363',
  },
  {
    id: 'women',
    title: 'Women safety desk',
    summary: 'Rapid response support within city limits.',
    contactLabel: 'Call',
    contactValue: '1091',
  },
  {
    id: 'embassy',
    title: 'Embassy emergency line',
    summary: 'Direct connect to duty officer.',
    contactLabel: 'Call',
    contactValue: '+331234567',
  },
];
