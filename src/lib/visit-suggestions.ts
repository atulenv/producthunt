export type VisitSuggestion = {
  id: string;
  title: string;
  area: string;
  distance: string;
  bestTime: string;
  category: 'culture' | 'food' | 'night';
  safetyScore: number;
  note: string;
};

export const VISIT_SUGGESTIONS: VisitSuggestion[] = [
  {
    id: 'heritage',
    title: 'Humayun’s Tomb Night Walk',
    area: 'Nizamuddin East',
    distance: '4.2 km',
    bestTime: '19:00',
    category: 'culture',
    safetyScore: 82,
    note: 'Illuminated complex with private guides available.',
  },
  {
    id: 'food',
    title: 'Jama Masjid Terrace Food Trail',
    area: 'Old Delhi',
    distance: '3.7 km',
    bestTime: '20:30',
    category: 'food',
    safetyScore: 68,
    note: 'Arrive with local host to skip touts, carry cashless wallet.',
  },
  {
    id: 'nightlife',
    title: 'Rooftop Jazz Session',
    area: 'Connaught Place',
    distance: '0.9 km',
    bestTime: '22:15',
    category: 'night',
    safetyScore: 74,
    note: 'ID check at entrance; safe drop-off lane on KG Marg.',
  },
  {
    id: 'market',
    title: 'Khan Market Late Shopping',
    area: 'Khan Market',
    distance: '5.1 km',
    bestTime: '18:30',
    category: 'culture',
    safetyScore: 88,
    note: 'Low crowd pockets, heavily patrolled.',
  },
];
