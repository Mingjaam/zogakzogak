import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiEndpoint {
  name: string;
  endpoint: string;
  isConnected: boolean | null;
  lastChecked: Date | null;
  error?: string;
}

interface ApiStatusContextType {
  endpoints: Record<string, ApiEndpoint>;
  checkEndpoint: (name: string, endpoint: string) => Promise<void>;
  checkAllEndpoints: () => Promise<void>;
  isLoading: boolean;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

interface ApiStatusProviderProps {
  children: ReactNode;
}

export const ApiStatusProvider: React.FC<ApiStatusProviderProps> = ({ children }) => {
  const [endpoints, setEndpoints] = useState<Record<string, ApiEndpoint>>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkEndpoint = async (name: string, endpoint: string) => {
    try {
      const response = await fetch(`https://zogakzogak.ddns.net/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      });
      
      setEndpoints(prev => ({
        ...prev,
        [name]: {
          name,
          endpoint,
          isConnected: response.ok,
          lastChecked: new Date(),
          error: response.ok ? undefined : `HTTP ${response.status}`
        }
      }));
    } catch (error) {
      setEndpoints(prev => ({
        ...prev,
        [name]: {
          name,
          endpoint,
          isConnected: false,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const checkAllEndpoints = async () => {
    setIsLoading(true);
    const endpointsToCheck = [
      { name: 'memories', endpoint: '/memories' },
      { name: 'medications', endpoint: '/medications' },
      { name: 'users', endpoint: '/users/me' },
      { name: 'connection', endpoint: '/users/connection/status' }
    ];

    await Promise.all(
      endpointsToCheck.map(({ name, endpoint }) => checkEndpoint(name, endpoint))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    checkAllEndpoints();
  }, []);

  const value: ApiStatusContextType = {
    endpoints,
    checkEndpoint,
    checkAllEndpoints,
    isLoading
  };

  return (
    <ApiStatusContext.Provider value={value}>
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = () => {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error('useApiStatus must be used within an ApiStatusProvider');
  }
  return context;
};
