import { create } from 'zustand';

export type Trip = {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
};

export type TrustedContact = {
  id: string;
  name: string;
  phone: string;
};

export type IncidentReport = {
  id: string;
  category: 'theft' | 'harassment' | 'scam' | 'unsafe-feeling' | 'other';
  location: string;
  description: string;
  timestamp: string;
};

export type SavedPlace = {
  id: string;
  name: string;
  location: string;
};

type AppState = {
  onboardingCompleted: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  userProfile: {
    name: string;
    tagline: string;
  };
  trips: Trip[];
  trustedContacts: TrustedContact[];
  incidentReports: IncidentReport[];
  savedPlaces: SavedPlace[];
};

type AppActions = {
  completeOnboarding: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'hi') => void;
  addTrip: (trip: Trip) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  addIncidentReport: (report: IncidentReport) => void;
  addSavedPlace: (place: SavedPlace) => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  onboardingCompleted: false,
  theme: 'light',
  language: 'en',
  userProfile: {
    name: 'John Doe',
    tagline: 'Solo traveler',
  },
  trips: [],
  trustedContacts: [],
  incidentReports: [],
  savedPlaces: [],
  completeOnboarding: () => set({ onboardingCompleted: true }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  addTrustedContact: (contact) =>
    set((state) => ({
      trustedContacts: [...state.trustedContacts, contact],
    })),
  addIncidentReport: (report) =>
    set((state) => ({
      incidentReports: [...state.incidentReports, report],
    })),
  addSavedPlace: (place) =>
    set((state) => ({ savedPlaces: [...state.savedPlaces, place] })),
}));
