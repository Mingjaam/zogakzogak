import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api-services';
import { Profile } from '../lib/api-types';

interface ProfileContextType {
  guardianProfile: Profile | null;
  elderlyProfile: Profile | null;
  updateGuardianProfile: (updates: Partial<Profile>) => Promise<void>;
  updateElderlyProfile: (updates: Partial<Profile>) => Promise<void>;
  loadProfiles: () => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [guardianProfile, setGuardianProfile] = useState<Profile | null>(null);
  const [elderlyProfile, setElderlyProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 로드
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // 현재는 임시 데이터 사용
      const tempGuardianProfile: Profile = {
        id: 1,
        name: '김영서',
        email: 'guardian@example.com',
        role: 'GUARDIAN',
        number: '010-1234-5678',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const tempElderlyProfile: Profile = {
        id: 2,
        name: '박길수',
        email: 'elderly@example.com',
        role: 'SENIOR',
        number: '010-9876-5432',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setGuardianProfile(tempGuardianProfile);
      setElderlyProfile(tempElderlyProfile);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 보호자 프로필 업데이트
  const updateGuardianProfile = async (updates: Partial<Profile>) => {
    if (!guardianProfile) return;

    try {
      // TODO: 실제 API 호출로 변경
      // const updatedProfile = await api.profile.updateProfile(updates);
      
      // 임시로 로컬 상태 업데이트
      setGuardianProfile(prev => prev ? { ...prev, ...updates } : null);
      
      console.log('보호자 프로필 업데이트:', updates);
    } catch (error) {
      console.error('보호자 프로필 업데이트 실패:', error);
      throw error;
    }
  };

  // 어르신 프로필 업데이트
  const updateElderlyProfile = async (updates: Partial<Profile>) => {
    if (!elderlyProfile) return;

    try {
      // TODO: 실제 API 호출로 변경
      // const updatedProfile = await api.profile.updateProfile(updates);
      
      // 임시로 로컬 상태 업데이트
      setElderlyProfile(prev => prev ? { ...prev, ...updates } : null);
      
      console.log('어르신 프로필 업데이트:', updates);
    } catch (error) {
      console.error('어르신 프로필 업데이트 실패:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 프로필 로드
  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <ProfileContext.Provider value={{
      guardianProfile,
      elderlyProfile,
      updateGuardianProfile,
      updateElderlyProfile,
      loadProfiles,
      isLoading
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
