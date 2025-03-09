// Language translations
export type Language = 'en' | 'sk';

export interface Translations {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    view: string;
    loading: string;
    success: string;
    error: string;
    copy?: string;
    copied?: string;
    firstName: string;
    lastName: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    username: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
  };
  home: {
    title: string;
    subtitle: string;
    getStarted: string;
    bookDemo: string;
    features: string;
    schedule: string;
    scheduleSubtitle: string;
    bookMeeting: string;
  };
  admin: {
    title: string;
    webhookConfig: string;
    webhookConfigDesc: string;
    webhookUrl: string;
    webhookUrlDesc: string;
    apiKey: string;
    apiKeyDesc: string;
    language: string;
    languageDesc: string;
    authMethod: string;
    none: string;
    basicAuth: string;
    bearerToken: string;
    oauth: string;
    username: string;
    password: string;
    token: string;
    clientId: string;
    clientSecret: string;
    tokenUrl: string;
    configSaved: string;
    doctorManagement: string;
    addDoctor: string;
    addDoctorDesc: string;
    fullName: string;
    email: string;
    specialization: string;
    doctorAdded: string;
    manageDoctors: string;
    manageDoctorsDesc: string;
  };
  doctor: {
    title: string;
    patientInfo: string;
    patientName: string;
    patientId: string;
    healthInsurance: string;
    appointmentType: string;
    audioRecording: string;
    audioRecordingDesc: string;
    readyToRecord: string;
    recording: string;
    recordingComplete: string;
    duration: string;
    transcribe: string;
    transcribing: string;
    transcription: string;
    transcriptionSuccess: string;
    saveToPatient: string;
    exportAsPdf: string;
    exportAsWord: string;
    recentPatients: string;
    appointment: string;
    instructions: string;
    instructionsList: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
    };
    support: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      view: 'View',
      loading: 'Loading...',
      success: 'Success!',
      error: 'Error',
      copy: 'Copy to Clipboard',
      copied: 'Copied to clipboard',
      firstName: 'First Name',
      lastName: 'Last Name',
    },
    auth: {
      signIn: 'Sign In',
      signOut: 'Logout',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
    },
    home: {
      title: 'Medical Records Simplified',
      subtitle: 'Streamline your medical practice with our advanced audio recording and transcription system.',
      getStarted: 'Get Started',
      bookDemo: 'Book a Demo',
      features: 'Key Features',
      schedule: 'Schedule a Consultation',
      scheduleSubtitle: 'Book an online meeting with our team to learn more about our services.',
      bookMeeting: 'Book a Meeting',
    },
    admin: {
      title: 'Admin Dashboard',
      webhookConfig: 'Webhook Configuration',
      webhookConfigDesc: 'Configure the webhook settings for audio transcription. These settings will be applied to all users.',
      webhookUrl: 'Webhook URL',
      webhookUrlDesc: 'The webhook must accept POST requests with multipart/form-data',
      apiKey: 'API Key',
      apiKeyDesc: 'API key for authentication with the transcription service',
      language: 'Language',
      languageDesc: 'Primary language for transcription',
      authMethod: 'Authentication Method',
      none: 'None',
      basicAuth: 'Basic Auth',
      bearerToken: 'Bearer Token',
      oauth: 'OAuth 2.0',
      username: 'Username',
      password: 'Password',
      token: 'Bearer Token',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      tokenUrl: 'Token URL',
      configSaved: 'Webhook configuration saved successfully!',
      doctorManagement: 'Doctor Management',
      addDoctor: 'Add New Doctor',
      addDoctorDesc: 'Create a new doctor account with access to the system',
      fullName: 'Full Name',
      email: 'Email',
      specialization: 'Specialization',
      doctorAdded: 'Doctor added successfully!',
      manageDoctors: 'Manage Doctors',
      manageDoctorsDesc: 'View and manage existing doctor accounts',
    },
    doctor: {
      title: 'Doctor Dashboard',
      patientInfo: 'Patient Information',
      patientName: 'Patient Name',
      patientId: 'Patient ID',
      healthInsurance: 'Health Insurance Company',
      appointmentType: 'Appointment Type',
      audioRecording: 'Audio Recording',
      audioRecordingDesc: 'Record and transcribe patient consultation audio',
      readyToRecord: 'Ready to record',
      recording: 'Recording in progress',
      recordingComplete: 'Recording complete',
      duration: 'Duration',
      transcribe: 'Transcribe',
      transcribing: 'Transcribing...',
      transcription: 'Transcription',
      transcriptionSuccess: 'Transcription completed successfully',
      saveToPatient: 'Save to Patient Record',
      exportAsPdf: 'Export as PDF',
      exportAsWord: 'Export as Word',
      recentPatients: 'Recent Patients',
      appointment: 'Appointment',
      instructions: 'Instructions',
      instructionsList: {
        step1: 'Enter patient information',
        step2: 'Click the microphone button to start recording',
        step3: 'Click stop when finished',
        step4: 'Preview the recording if needed',
        step5: 'Click transcribe to convert audio to text',
        step6: 'Review and save the transcription',
      },
      support: 'For technical support, please contact the IT department.',
    },
  },
  sk: {
    common: {
      save: 'Uložiť',
      cancel: 'Zrušiť',
      edit: 'Upraviť',
      delete: 'Vymazať',
      add: 'Pridať',
      view: 'Zobraziť',
      loading: 'Načítava sa...',
      success: 'Úspech!',
      error: 'Chyba',
      copy: 'Kopírovať do schránky',
      copied: 'Skopírované do schránky',
      firstName: 'Meno',
      lastName: 'Priezvisko',
    },
    auth: {
      signIn: 'Prihlásiť sa',
      signOut: 'Odhlásiť sa',
      username: 'Používateľské meno',
      password: 'Heslo',
      rememberMe: 'Zapamätať si ma',
      forgotPassword: 'Zabudli ste heslo?',
    },
    home: {
      title: 'Zjednodušené zdravotné záznamy',
      subtitle: 'Zefektívnite svoju lekársku prax pomocou nášho pokročilého systému nahrávania a prepisu zvuku.',
      getStarted: 'Začať',
      bookDemo: 'Rezervovať ukážku',
      features: 'Kľúčové funkcie',
      schedule: 'Naplánovať konzultáciu',
      scheduleSubtitle: 'Rezervujte si online stretnutie s naším tímom a dozviete sa viac o našich službách.',
      bookMeeting: 'Rezervovať stretnutie',
    },
    admin: {
      title: 'Administrátorský panel',
      webhookConfig: 'Konfigurácia webhooku',
      webhookConfigDesc: 'Nakonfigurujte nastavenia webhooku pre prepis zvuku. Tieto nastavenia budú aplikované na všetkých používateľov.',
      webhookUrl: 'URL webhooku',
      webhookUrlDesc: 'Webhook musí akceptovať POST požiadavky s multipart/form-data',
      apiKey: 'API kľúč',
      apiKeyDesc: 'API kľúč pre autentifikáciu so službou prepisu',
      language: 'Jazyk',
      languageDesc: 'Primárny jazyk pre prepis',
      authMethod: 'Spôsob autentifikácie',
      none: 'Žiadny',
      basicAuth: 'Základná autentifikácia',
      bearerToken: 'Bearer Token',
      oauth: 'OAuth 2.0',
      username: 'Používateľské meno',
      password: 'Heslo',
      token: 'Bearer Token',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      tokenUrl: 'Token URL',
      configSaved: 'Konfigurácia webhooku bola úspešne uložená!',
      doctorManagement: 'Správa lekárov',
      addDoctor: 'Pridať nového lekára',
      addDoctorDesc: 'Vytvorte nový účet lekára s prístupom do systému',
      fullName: 'Celé meno',
      email: 'Email',
      specialization: 'Špecializácia',
      doctorAdded: 'Lekár bol úspešne pridaný!',
      manageDoctors: 'Správa lekárov',
      manageDoctorsDesc: 'Zobraziť a spravovať existujúce účty lekárov',
    },
    doctor: {
      title: 'Panel lekára',
      patientInfo: 'Informácie o pacientovi',
      patientName: 'Meno pacienta',
      patientId: 'ID pacienta',
      healthInsurance: 'Zdravotná poisťovňa',
      appointmentType: 'Typ návštevy',
      audioRecording: 'Nahrávanie zvuku',
      audioRecordingDesc: 'Nahrávajte a prepisujte zvukové konzultácie pacientov',
      readyToRecord: 'Pripravené na nahrávanie',
      recording: 'Prebieha nahrávanie',
      recordingComplete: 'Nahrávanie dokončené',
      duration: 'Trvanie',
      transcribe: 'Prepísať',
      transcribing: 'Prebieha prepis...',
      transcription: 'Prepis',
      transcriptionSuccess: 'Prepis bol úspešne dokončený',
      saveToPatient: 'Uložiť do záznamu pacienta',
      exportAsPdf: 'Exportovať ako PDF',
      exportAsWord: 'Exportovať ako Word',
      recentPatients: 'Nedávni pacienti',
      appointment: 'Návšteva',
      instructions: 'Pokyny',
      instructionsList: {
        step1: 'Zadajte informácie o pacientovi',
        step2: 'Kliknite na tlačidlo mikrofónu pre začatie nahrávania',
        step3: 'Po dokončení kliknite na stop',
        step4: 'V prípade potreby si nahrávku vypočujte',
        step5: 'Kliknite na prepis pre konverziu zvuku na text',
        step6: 'Skontrolujte a uložte prepis',
      },
      support: 'Pre technickú podporu kontaktujte IT oddelenie.',
    },
  },
};

// Default language
let currentLanguage: Language = 'en';

// Get current language
export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

// Set current language
export const setCurrentLanguage = (lang: Language): void => {
  currentLanguage = lang;
  // Store in localStorage for persistence
  localStorage.setItem('language', lang);
  // Dispatch an event so components can react to language change
  window.dispatchEvent(new Event('languagechange'));
};

// Initialize language from localStorage if available
export const initializeLanguage = (): void => {
  const storedLang = localStorage.getItem('language') as Language;
  if (storedLang && (storedLang === 'en' || storedLang === 'sk')) {
    currentLanguage = storedLang;
  }
};

// Get translations for current language
export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  // Try to get the translation in the current language
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      // If we can't find the translation in the current language, try English
      let fallback = translations['en'];
      for (let j = 0; j <= i; j++) {
        const fk = keys[j];
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk as keyof typeof fallback];
        } else {
          // If we can't find it in English either, return the key
          return key;
        }
      }
      
      // Continue with the rest of the keys on the fallback
      for (let j = i + 1; j < keys.length; j++) {
        const fk = keys[j];
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk as keyof typeof fallback];
        } else {
          return key;
        }
      }
      
      return typeof fallback === 'string' ? fallback : key;
    }
  }
  
  return typeof value === 'string' ? value : key;
};
