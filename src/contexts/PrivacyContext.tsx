import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrivacyContextType {
  microphoneConsent: boolean;
  locationConsent: boolean;
  audioStorageConsent: boolean;
  showConsentModal: boolean;
  setMicrophoneConsent: (consent: boolean) => void;
  setLocationConsent: (consent: boolean) => void;
  setAudioStorageConsent: (consent: boolean) => void;
  setShowConsentModal: (show: boolean) => void;
  hasAllRequiredConsents: boolean;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [microphoneConsent, setMicrophoneConsent] = useState(false);
  const [locationConsent, setLocationConsent] = useState(false);
  const [audioStorageConsent, setAudioStorageConsent] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const hasAllRequiredConsents = microphoneConsent && locationConsent;

  useEffect(() => {
    const saved = localStorage.getItem('privacyConsents');
    if (saved) {
      const consents = JSON.parse(saved);
      setMicrophoneConsent(consents.microphone || false);
      setLocationConsent(consents.location || false);
      setAudioStorageConsent(consents.audioStorage !== false);
    } else {
      setShowConsentModal(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('privacyConsents', JSON.stringify({
      microphone: microphoneConsent,
      location: locationConsent,
      audioStorage: audioStorageConsent
    }));
  }, [microphoneConsent, locationConsent, audioStorageConsent]);

  return (
    <PrivacyContext.Provider value={{
      microphoneConsent,
      locationConsent,
      audioStorageConsent,
      showConsentModal,
      setMicrophoneConsent,
      setLocationConsent,
      setAudioStorageConsent,
      setShowConsentModal,
      hasAllRequiredConsents
    }}>
      {children}
    </PrivacyContext.Provider>
  );
};