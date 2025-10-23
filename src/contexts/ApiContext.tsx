import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiConfig } from '../types';

interface ApiContextType {
  config: ApiConfig;
  updateConfig: (config: ApiConfig) => void;
  isConfigured: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('apiConfig');
    return saved ? JSON.parse(saved) : { baseUrl: '', apiKey: '' };
  });

  const updateConfig = (newConfig: ApiConfig) => {
    setConfig(newConfig);
    localStorage.setItem('apiConfig', JSON.stringify(newConfig));
  };

  const isConfigured = config.baseUrl && config.apiKey;

  useEffect(() => {
    // Set default mock API config for development
    if (!isConfigured) {
      const mockConfig = {
        baseUrl: 'https://api.urbannoise.demo',
        apiKey: 'demo-key-12345'
      };
      updateConfig(mockConfig);
    }
  }, [isConfigured]);

  return (
    <ApiContext.Provider value={{ config, updateConfig, isConfigured }}>
      {children}
    </ApiContext.Provider>
  );
};