import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Live2DModelInfo {
  modelPath: string;
  // Add other model related info as needed
}

interface Live2DConfigContextValue {
  modelInfo: Live2DModelInfo | null;
  isLoading: boolean;
  setModelInfo: (info: Live2DModelInfo) => void;
  setIsLoading: (loading: boolean) => void;
}

const Live2DConfigContext = createContext<Live2DConfigContextValue | undefined>(undefined);

export const Live2DConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modelInfo, setModelInfo] = useState<Live2DModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <Live2DConfigContext.Provider value={{ modelInfo, isLoading, setModelInfo, setIsLoading }}>
      {children}
    </Live2DConfigContext.Provider>
  );
};

export const useLive2DConfig = (): Live2DConfigContextValue => {
  const context = useContext(Live2DConfigContext);
  if (!context) {
    throw new Error('useLive2DConfig must be used within a Live2DConfigProvider');
  }
  return context;
};
