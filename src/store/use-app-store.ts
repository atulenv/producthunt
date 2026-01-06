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
  relationship?: string;
  isEmergencyContact?: boolean;
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

type FamilyContact = {
  name: string;
  relationship: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  notifyOnSOS: boolean;
};

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
  medicalConditions: string;
  organDonor: boolean;
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
  // Essential Info (MANDATORY)
  name: string;
  tagline: string;
  photoUri: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Contact Info
  email: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  
  // Identity Documents
  passportNumber: string;
  passportExpiry: string;
  nationalId: string;
  visaNumber: string;
  visaExpiry: string;
  
  // Family/Emergency Contacts (CRITICAL FOR SAFETY)
  familyContacts: FamilyContact[];
  
  // Current Location Info
  currentHotel: string;
  hotelAddress: string;
  hotelPhone: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  
  // Travel Info
  arrivalFlight: string;
  departureFlight: string;
  travelInsurance: string;
  insuranceEmergencyNumber: string;
  
  // Embassy Info
  embassyName: string;
  embassyPhone: string;
  embassyAddress: string;
  
  // Legacy fields for compatibility
  homeBase: string;
  pronouns: string;
  travelDocumentExpiry: string;
  languagesSpoken: string;
  safeWord: string;
  embassyContact: string;
  localStayAddress: string;
  localHostName: string;
  employerContact: string;
  socialHandle: string;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  travelPreferences: TravelPreferences;
  verificationNotes: string;
  
  // Profile completion
  profileComplete: boolean;
  lastUpdated: string;
};

type SOSSettings = {
  shakeToSOS: boolean;
  shakeSensitivity: 'low' | 'medium' | 'high';
  autoLocationShare: boolean;
  locationShareInterval: number; // minutes
  silentSOSEnabled: boolean;
  audioRecordOnSOS: boolean;
  videoRecordOnSOS: boolean;
  sirenOnSOS: boolean;
  autoCallEmergency: boolean;
  emergencyNumber: string;
  fakeCallEnabled: boolean;
  fakeCallerName: string;
  fakeCallDelay: number; // seconds
};

type DeepPartialUserProfile = Partial<Omit<UserProfile, 'emergencyContact' | 'medicalInfo' | 'travelPreferences' | 'familyContacts'>> & {
  emergencyContact?: Partial<EmergencyContact>;
  medicalInfo?: Partial<MedicalInfo>;
  travelPreferences?: Partial<TravelPreferences>;
  familyContacts?: FamilyContact[];
};

type AppState = {
  onboardingCompleted: boolean;
  theme: 'light' | 'dark';
  language: LanguageCode;
  userProfile: UserProfile;
  sosSettings: SOSSettings;
  trips: Trip[];
  trustedContacts: TrustedContact[];
  incidentReports: IncidentReport[];
  savedPlaces: SavedPlace[];
  sosActive: boolean;
  sosStartTime: string | null;
  locationSharingActive: boolean;
};

type AppActions = {
  completeOnboarding: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: LanguageCode) => void;
  addTrip: (trip: Trip) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  updateTrustedContact: (contact: TrustedContact) => void;
  removeTrustedContact: (id: string) => void;
  addIncidentReport: (report: IncidentReport) => void;
  addSavedPlace: (place: SavedPlace) => void;
  updateUserProfile: (updates: DeepPartialUserProfile) => void;
  updateSOSSettings: (updates: Partial<SOSSettings>) => void;
  triggerSOS: () => void;
  deactivateSOS: () => void;
  toggleLocationSharing: () => void;
  addFamilyContact: (contact: FamilyContact) => void;
  removeFamilyContact: (index: number) => void;
  updateFamilyContact: (index: number, contact: Partial<FamilyContact>) => void;
};

const defaultFamilyContact: FamilyContact = {
  name: '',
  relationship: '',
  phone: '',
  altPhone: '',
  email: '',
  address: '',
  city: '',
  country: '',
  notifyOnSOS: true,
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  onboardingCompleted: false,
  theme: 'light',
  language: 'en',
  sosActive: false,
  sosStartTime: null,
  locationSharingActive: false,
  
  sosSettings: {
    shakeToSOS: true,
    shakeSensitivity: 'medium',
    autoLocationShare: true,
    locationShareInterval: 5,
    silentSOSEnabled: true,
    audioRecordOnSOS: true,
    videoRecordOnSOS: false,
    sirenOnSOS: true,
    autoCallEmergency: true,
    emergencyNumber: '112',
    fakeCallEnabled: true,
    fakeCallerName: 'Mom',
    fakeCallDelay: 10,
  },
  
  userProfile: {
    name: '',
    tagline: 'Tourist in India',
    photoUri: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    alternatePhone: '',
    whatsapp: '',
    passportNumber: '',
    passportExpiry: '',
    nationalId: '',
    visaNumber: '',
    visaExpiry: '',
    familyContacts: [{ ...defaultFamilyContact }],
    currentHotel: '',
    hotelAddress: '',
    hotelPhone: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    arrivalFlight: '',
    departureFlight: '',
    travelInsurance: '',
    insuranceEmergencyNumber: '',
    embassyName: '',
    embassyPhone: '',
    embassyAddress: '',
    homeBase: '',
    pronouns: '',
    travelDocumentExpiry: '',
    languagesSpoken: '',
    safeWord: '',
    embassyContact: '',
    localStayAddress: '',
    localHostName: '',
    employerContact: '',
    socialHandle: '',
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
      email: '',
      address: '',
    },
    medicalInfo: {
      bloodType: '',
      allergies: '',
      medications: '',
      insuranceProvider: '',
      insurancePolicy: '',
      physicianContact: '',
      medicalNotes: '',
      medicalConditions: '',
      organDonor: false,
    },
    travelPreferences: {
      travelStyle: '',
      accommodation: '',
      transport: '',
      dietary: '',
      mobilityNeeds: '',
      communication: '',
    },
    verificationNotes: '',
    profileComplete: false,
    lastUpdated: '',
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

  updateTrustedContact: (contact) =>
    set((state) => ({
      trustedContacts: state.trustedContacts.map((c) =>
        c.id === contact.id ? contact : c
      ),
    })),
    
  removeTrustedContact: (id) =>
    set((state) => ({
      trustedContacts: state.trustedContacts.filter((c) => c.id !== id),
    })),
    
  addIncidentReport: (report) =>
    set((state) => ({
      incidentReports: [...state.incidentReports, report],
    })),
    
  addSavedPlace: (place) =>
    set((state) => ({ savedPlaces: [...state.savedPlaces, place] })),
    
  updateUserProfile: (updates) =>
    set((state) => {
      const { emergencyContact, medicalInfo, travelPreferences, familyContacts, ...rest } = updates;
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
          familyContacts: familyContacts ?? state.userProfile.familyContacts,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
    
  updateSOSSettings: (updates) =>
    set((state) => ({
      sosSettings: { ...state.sosSettings, ...updates },
    })),
    
  triggerSOS: () =>
    set({
      sosActive: true,
      sosStartTime: new Date().toISOString(),
      locationSharingActive: true,
    }),
    
  deactivateSOS: () =>
    set({
      sosActive: false,
      sosStartTime: null,
    }),
    
  toggleLocationSharing: () =>
    set((state) => ({
      locationSharingActive: !state.locationSharingActive,
    })),
    
  addFamilyContact: (contact) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        familyContacts: [...state.userProfile.familyContacts, contact],
      },
    })),
    
  removeFamilyContact: (index) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        familyContacts: state.userProfile.familyContacts.filter((_, i) => i !== index),
      },
    })),
    
  updateFamilyContact: (index, contact) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        familyContacts: state.userProfile.familyContacts.map((c, i) =>
          i === index ? { ...c, ...contact } : c
        ),
      },
    })),
}));
