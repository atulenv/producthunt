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
  category: 'theft' | 'harassment' | 'danger' | 'unsafe-feeling' | 'other';
  location: string;
  description: string;
  timestamp: string;
};

export type SavedPlace = {
  id: string;
  name: string;
  location: string;
};

export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'ar';

type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
  email: string;
  address: string;
};

type MedicalInfo = {
  bloodType: string;
  allergies: string;
  medications: string;
  insuranceProvider: string;
  insurancePolicy: string;
  physicianContact: string;
  medicalNotes: string;
};

type TravelPreferences = {
  travelStyle: string;
  accommodation: string;
  transport: string;
  dietary: string;
  mobilityNeeds: string;
  communication: string;
};

type UserProfile = {
  name: string;
  tagline: string;
  homeBase: string;
  dateOfBirth: string;
  gender: string;
  pronouns: string;
  nationality: string;
  passportNumber: string;
  nationalId: string;
  travelDocumentExpiry: string;
  email: string;
  phone: string;
  alternatePhone: string;
  languagesSpoken: string;
  safeWord: string;
  embassyContact: string;
  localStayAddress: string;
  localHostName: string;
  arrivalFlight: string;
  departureFlight: string;
  employerContact: string;
  socialHandle: string;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  travelPreferences: TravelPreferences;
  verificationNotes: string;
};

type DeepPartialUserProfile = Partial<Omit<UserProfile, 'emergencyContact' | 'medicalInfo' | 'travelPreferences'>> & {
  emergencyContact?: Partial<EmergencyContact>;
  medicalInfo?: Partial<MedicalInfo>;
  travelPreferences?: Partial<TravelPreferences>;
};

type AppState = {
  onboardingCompleted: boolean;
  theme: 'light' | 'dark';
  language: LanguageCode;
  userProfile: UserProfile;
  trips: Trip[];
  trustedContacts: TrustedContact[];
  incidentReports: IncidentReport[];
  savedPlaces: SavedPlace[];
};

type AppActions = {
  completeOnboarding: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: LanguageCode) => void;
  addTrip: (trip: Trip) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  addIncidentReport: (report: IncidentReport) => void;
  addSavedPlace: (place: SavedPlace) => void;
  updateUserProfile: (updates: DeepPartialUserProfile) => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  onboardingCompleted: false,
  theme: 'light',
  language: 'en',
  userProfile: {
    name: 'Atul Sahu',
    tagline: 'Solo traveler',
    homeBase: 'Seattle, USA',
    dateOfBirth: '14 Jan 1994',
    gender: 'Male',
    pronouns: 'He/Him',
    nationality: 'American',
    passportNumber: 'X1234567',
    nationalId: 'SSN: ***-**-1234',
    travelDocumentExpiry: 'Jun 2030',
    email: 'john@example.com',
    phone: '+1 206-555-0123',
    alternatePhone: '+91 98100 00000',
    languagesSpoken: 'English, Spanish',
    safeWord: 'AURORA',
    embassyContact: 'US Embassy New Delhi · +91 11 2419 8000',
    localStayAddress: 'The Imperial Hotel, Janpath Rd',
    localHostName: 'Front desk + concierge: +91 11 2334 1234',
    arrivalFlight: 'AI 104 · ETA 22:15 · DEL T3',
    departureFlight: 'BA 256 · ETD 02:10 · DEL T3',
    employerContact: 'Manager: Sarah Lee · +1 206-555-0777',
    socialHandle: '@atul-onroad',
    emergencyContact: {
      name: 'Maya Doe',
      relation: 'Sister',
      phone: '+1 206-555-0456',
      email: 'maya@example.com',
      address: '1234 5th Ave, Seattle, USA',
    },
    medicalInfo: {
      bloodType: 'O+',
      allergies: 'Peanuts',
      medications: 'Vitamin D supplement',
      insuranceProvider: 'Global Travel Shield',
      insurancePolicy: 'GTS-99321',
      physicianContact: '+1 206-555-0901',
      medicalNotes: 'Carries inhaler for mild asthma',
    },
    travelPreferences: {
      travelStyle: 'Solo explorer · food and night walks',
      accommodation: 'Boutique hotels & vetted rentals',
      transport: 'Verified taxis + metro',
      dietary: 'Vegetarian · no peanuts',
      mobilityNeeds: 'Avoid long staircases after injury',
      communication: 'WhatsApp or SMS updates preferred',
    },
    verificationNotes: 'ID verified with embassy desk and concierge.',
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
  updateUserProfile: (updates) =>
    set((state) => {
      const { emergencyContact, medicalInfo, travelPreferences, ...rest } = updates;
      return {
        userProfile: {
          ...state.userProfile,
          ...rest,
          emergencyContact: emergencyContact
            ? { ...state.userProfile.emergencyContact, ...emergencyContact }
            : state.userProfile.emergencyContact,
          medicalInfo: medicalInfo
            ? { ...state.userProfile.medicalInfo, ...medicalInfo }
            : state.userProfile.medicalInfo,
          travelPreferences: travelPreferences
            ? { ...state.userProfile.travelPreferences, ...travelPreferences }
            : state.userProfile.travelPreferences,
        },
      };
    }),
}));
