import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

// Registration form fields
export interface ParentInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ChildInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gradeLevel: string;
  allergies: string;
  specialNeeds: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface RegistrationState {
  currentStep: number;
  selectedCourseId: string | null;
  parentInfo: ParentInfo;
  childInfo: ChildInfo;
  emergencyContact: EmergencyContact;
  agreedToTerms: boolean;
  photoRelease: boolean;
}

const initialState: RegistrationState = {
  currentStep: 1,
  selectedCourseId: null,
  parentInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  childInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gradeLevel: '',
    allergies: '',
    specialNeeds: '',
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  agreedToTerms: false,
  photoRelease: false,
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSelectedCourseId: (state, action: PayloadAction<string | null>) => {
      state.selectedCourseId = action.payload;
    },
    updateParentInfo: (state, action: PayloadAction<Partial<ParentInfo>>) => {
      state.parentInfo = { ...state.parentInfo, ...action.payload };
    },
    updateChildInfo: (state, action: PayloadAction<Partial<ChildInfo>>) => {
      state.childInfo = { ...state.childInfo, ...action.payload };
    },
    updateEmergencyContact: (state, action: PayloadAction<Partial<EmergencyContact>>) => {
      state.emergencyContact = { ...state.emergencyContact, ...action.payload };
    },
    setAgreedToTerms: (state, action: PayloadAction<boolean>) => {
      state.agreedToTerms = action.payload;
    },
    setPhotoRelease: (state, action: PayloadAction<boolean>) => {
      state.photoRelease = action.payload;
    },
    resetRegistration: () => initialState,
  },
});

export const {
  setCurrentStep,
  setSelectedCourseId,
  updateParentInfo,
  updateChildInfo,
  updateEmergencyContact,
  setAgreedToTerms,
  setPhotoRelease,
  resetRegistration,
} = registrationSlice.actions;

export const selectCurrentStep = (state: RootState) => state.registration.currentStep;
export const selectSelectedCourseId = (state: RootState) => state.registration.selectedCourseId;
export const selectParentInfo = (state: RootState) => state.registration.parentInfo;
export const selectChildInfo = (state: RootState) => state.registration.childInfo;
export const selectEmergencyContact = (state: RootState) => state.registration.emergencyContact;
export const selectAgreedToTerms = (state: RootState) => state.registration.agreedToTerms;
export const selectPhotoRelease = (state: RootState) => state.registration.photoRelease;
export const selectRegistration = (state: RootState) => state.registration;

export default registrationSlice.reducer;