export type TravelMomentStatus = 'completed' | 'current' | 'upcoming';

export type TravelMoment = {
  id: string;
  title: string;
  time: string;
  note: string;
  status: TravelMomentStatus;
  safetyCue: string;
};

export const TRAVEL_MOMENTS: TravelMoment[] = [
  {
    id: 'sunrise',
    title: 'Sunrise walk · Lodhi Garden',
    time: '06:25',
    note: 'Low crowd pockets and patrolling rangers',
    status: 'completed',
    safetyCue: 'Green corridor until 8am',
  },
  {
    id: 'workspace',
    title: 'Cowork drop-in · Connaught Place',
    time: '10:10',
    note: 'Metal detectors at entry, ID needed',
    status: 'current',
    safetyCue: 'Security queue: 4 min avg',
  },
  {
    id: 'bazaar',
    title: 'Bazaar browse · Chandni Chowk',
    time: '17:40',
    note: 'Vendors expect 12% surge due to festival week',
    status: 'upcoming',
    safetyCue: 'Best exit via Gate 3',
  },
  {
    id: 'commute',
    title: 'Night commute · Hotel return',
    time: '21:15',
    note: 'Metro line 2 partial shutdown after 21:00',
    status: 'upcoming',
    safetyCue: 'Pre-book cab 20 min earlier',
  },
];

export type ConciergeAction = {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  route: string;
  tag: string;
  icon: string;
};

export const CONCIERGE_ACTIONS: ConciergeAction[] = [
  {
    id: 'route-audit',
    title: 'Re-run your ride home',
    detail: 'Metro line 2 is offline, we stitched an auto + ride-share combo.',
    actionLabel: 'Open routes',
    route: '/screens/TravelRoutes',
    tag: 'Mobility',
    icon: 'navigate-outline',
  },
  {
    id: 'documents',
    title: 'Review essential docs',
    detail: 'Insurance PDF and embassy note are synced but not favorited.',
    actionLabel: 'View trips',
    route: '/tabs/trips',
    tag: 'Readiness',
    icon: 'document-text-outline',
  },
  {
    id: 'reports',
    title: 'Log the coworking check-in',
    detail: 'Share your vibe so others can see the desk occupancy.',
    actionLabel: 'Add report',
    route: '/screens/Reports',
    tag: 'Community',
    icon: 'chatbubble-ellipses-outline',
  },
];

export type LocalIntel = {
  id: string;
  area: string;
  insight: string;
  detail: string;
  stat: string;
  icon: string;
};

export const LOCAL_INTEL: LocalIntel[] = [
  {
    id: 'connaught',
    area: 'Connaught Place',
    insight: 'Footfall +18% vs yesterday',
    detail: 'Perimeter checks at Rajiv Chowk, keep ID handy.',
    stat: 'Best window 11:00–16:00',
    icon: 'business-outline',
  },
  {
    id: 'khan-market',
    area: 'Khan Market',
    insight: 'Low crowd · boutique cafes open late',
    detail: 'Police beat shifts at 18:30, expect more bike patrols.',
    stat: 'Great for dinners 19:00',
    icon: 'restaurant-outline',
  },
  {
    id: 'aerocity',
    area: 'Aerocity corridor',
    insight: 'Hotel security drill tonight',
    detail: 'Visitors must register vehicles before 21:00.',
    stat: 'Parking slots 72% full',
    icon: 'shield-checkmark-outline',
  },
];

export type SafetyAutomation = {
  id: string;
  title: string;
  detail: string;
  status: 'armed' | 'paused';
  lastRun: string;
  icon: string;
};

export const SAFETY_AUTOMATIONS: SafetyAutomation[] = [
  {
    id: 'ghost-route',
    title: 'Ghost route mirror',
    detail: 'Shares breadcrumb trail with base every 400m.',
    status: 'armed',
    lastRun: 'Synced 2 min ago',
    icon: 'share-social-outline',
  },
  {
    id: 'audio-vault',
    title: 'Ambient audio vault',
    detail: 'Auto records 30s clip if you press volume keys twice.',
    status: 'armed',
    lastRun: 'Listening',
    icon: 'mic-outline',
  },
  {
    id: 'check-window',
    title: 'Check-in escalation',
    detail: 'Escalates if you ignore prompts for 10 min.',
    status: 'paused',
    lastRun: 'Paused at 18:00',
    icon: 'time-outline',
  },
];

export type GuardianWatcher = {
  id: string;
  name: string;
  distance: string;
  status: 'watching' | 'idle';
  signalStrength: number;
  note: string;
};

export const GUARDIAN_WATCHERS: GuardianWatcher[] = [
  {
    id: 'watcher-riya',
    name: 'Riya (local guide)',
    distance: '0.8 km',
    status: 'watching',
    signalStrength: 4,
    note: 'Live on map',
  },
  {
    id: 'watcher-daniel',
    name: 'Daniel (travel buddy)',
    distance: 'Hotel base',
    status: 'idle',
    signalStrength: 2,
    note: 'Will jump in after 22:00',
  },
  {
    id: 'watcher-concierge',
    name: 'Concierge desk',
    distance: 'Virtual',
    status: 'watching',
    signalStrength: 5,
    note: 'Monitoring SOS triggers',
  },
];

export type RideVerification = {
  driverName: string;
  vehicle: string;
  color: string;
  plate: string;
  otp: string;
  eta: string;
  badgeLevel: string;
  riskNote: string;
};

export const ACTIVE_RIDE: RideVerification = {
  driverName: 'Amit Sharma',
  vehicle: 'Hydra Prime · Sedan',
  color: 'Deep blue',
  plate: 'DL 12 CQ 9087',
  otp: '6249',
  eta: '3 min away',
  badgeLevel: 'Gold safety badge',
  riskNote: 'Driver cleared by ride-share at 19:40 · dashcam on.',
};
