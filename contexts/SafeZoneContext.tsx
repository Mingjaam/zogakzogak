import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api-services';

interface SafeZoneData {
  center: { lat: number; lng: number };
  radius: number;
}

interface SafeZoneContextType {
  safeZone: SafeZoneData;
  updateSafeZone: (center: { lat: number; lng: number }, radius: number) => Promise<void>;
  loadSafeZone: () => Promise<void>;
  isLoading: boolean;
}

const SafeZoneContext = createContext<SafeZoneContextType | undefined>(undefined);

interface SafeZoneProviderProps {
  children: ReactNode;
}

export const SafeZoneProvider: React.FC<SafeZoneProviderProps> = ({ children }) => {
  const [safeZone, setSafeZone] = useState<SafeZoneData>({
    center: { lat: 35.8714, lng: 128.6014 },
    radius: 500
  });
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 안전구역 데이터 로드
  const loadSafeZone = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 어르신 ID 사용
      // 현재는 기본값 사용, 나중에 서버에서 로드하도록 구현
      console.log('안전구역 데이터 로드');
    } catch (error) {
      console.error('안전구역 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 안전구역 업데이트 (서버에 저장)
  const updateSafeZone = async (center: { lat: number; lng: number }, radius: number) => {
    try {
      // TODO: 실제 어르신 ID 사용
      await api.senior.updateSafeZone(1, { latitude: center.lat, longitude: center.lng, radius });
      
      // 로컬 상태 업데이트
      setSafeZone({ center, radius });
      console.log('안전구역이 서버에 저장되었습니다:', { center, radius });
    } catch (error) {
      console.error('안전구역 저장 실패:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 안전구역 데이터 로드
  useEffect(() => {
    loadSafeZone();
  }, []);

  return (
    <SafeZoneContext.Provider value={{ 
      safeZone, 
      updateSafeZone, 
      loadSafeZone, 
      isLoading 
    }}>
      {children}
    </SafeZoneContext.Provider>
  );
};

export const useSafeZone = () => {
  const context = useContext(SafeZoneContext);
  if (context === undefined) {
    throw new Error('useSafeZone must be used within a SafeZoneProvider');
  }
  return context;
};
