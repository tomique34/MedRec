// Type definitions for the application

export interface DoctorProfile {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  ambulanceName: string;
  ambulanceAddress: string;
  contactPhone: string;
  specialization?: string;
  webhookUrl?: string;
  apiKey?: string;
  authType?: 'none' | 'basic' | 'bearer' | 'oauth';
  authConfig?: {
    username?: string;
    password?: string;
    bearerToken?: string;
    oauthClientId?: string;
    oauthClientSecret?: string;
    oauthTokenUrl?: string;
  };
}

// Default doctor profile data
export const defaultDoctorProfile: DoctorProfile = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  title: '',
  ambulanceName: '',
  ambulanceAddress: '',
  contactPhone: ''
};

// Function to get doctor profile from localStorage
export const getDoctorProfile = (): DoctorProfile => {
  const storedProfile = localStorage.getItem('doctorProfile');
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }
  return defaultDoctorProfile;
};

// Function to save doctor profile to localStorage
export const saveDoctorProfile = (profile: DoctorProfile): void => {
  localStorage.setItem('doctorProfile', JSON.stringify(profile));
};
