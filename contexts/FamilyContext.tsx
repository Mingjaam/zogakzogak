import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  Family, 
  FamilyMember, 
  FamilyInvitation, 
  getFamilies, 
  createFamily, 
  inviteToFamily, 
  getFamilyInvitations, 
  acceptFamilyInvitation, 
  getFamilyMembers 
} from '../lib/api';

interface FamilyContextType {
  // Family 데이터
  families: Family[];
  currentFamily: Family | null;
  familyMembers: FamilyMember[];
  familyInvitations: FamilyInvitation[];
  
  // Family 관리 함수
  loadFamilies: () => Promise<void>;
  createNewFamily: (name: string) => Promise<boolean>;
  inviteToCurrentFamily: (email: string) => Promise<boolean>;
  loadFamilyInvitations: () => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<boolean>;
  loadFamilyMembers: (familyId: string) => Promise<void>;
  setCurrentFamily: (family: Family | null) => void;
  
  // 상태
  isLoading: boolean;
  error: string | null;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyInvitations, setFamilyInvitations] = useState<FamilyInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 가족 목록 로드
  const loadFamilies = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await getFamilies(token);
      if (response.success && response.data) {
        setFamilies(response.data);
        
        // 현재 가족이 없으면 첫 번째 가족을 선택
        if (!currentFamily && response.data.length > 0) {
          setCurrentFamily(response.data[0]);
        }
      } else {
        console.log('가족 목록을 가져올 수 없음, 로컬 스토리지 사용');
        // 로컬 스토리지에서 가족 정보 로드
        loadFamiliesFromStorage();
      }
    } catch (error) {
      console.error('가족 목록 로드 오류:', error);
      setError('가족 목록을 불러올 수 없습니다.');
      loadFamiliesFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지에서 가족 정보 로드
  const loadFamiliesFromStorage = () => {
    try {
      const storedFamilies = localStorage.getItem('user_families');
      if (storedFamilies) {
        const familiesData = JSON.parse(storedFamilies);
        setFamilies(familiesData);
        
        if (familiesData.length > 0 && !currentFamily) {
          setCurrentFamily(familiesData[0]);
        }
      }
    } catch (error) {
      console.error('로컬 스토리지에서 가족 정보 로드 오류:', error);
    }
  };

  // 가족 생성
  const createNewFamily = async (name: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await createFamily(token, name);
      if (response.success && response.data) {
        const newFamily = response.data;
        setFamilies(prev => [...prev, newFamily]);
        setCurrentFamily(newFamily);
        saveFamiliesToStorage([...families, newFamily]);
        return true;
      } else {
        // API 실패 시 로컬에서 가족 생성
        const newFamily: Family = {
          id: `family_${Date.now()}`,
          name,
          members: [{
            id: `member_${Date.now()}`,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: true,
            joinedAt: new Date().toISOString()
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setFamilies(prev => [...prev, newFamily]);
        setCurrentFamily(newFamily);
        saveFamiliesToStorage([...families, newFamily]);
        return true;
      }
    } catch (error) {
      console.error('가족 생성 오류:', error);
      setError('가족을 생성할 수 없습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 가족 초대
  const inviteToCurrentFamily = async (email: string): Promise<boolean> => {
    if (!currentFamily || !isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await inviteToFamily(token, currentFamily.id, email);
      if (response.success) {
        console.log('가족 초대 성공:', email);
        return true;
      } else {
        // API 실패 시 로컬에서 초대 시뮬레이션
        const invitation: FamilyInvitation = {
          id: `invitation_${Date.now()}`,
          familyId: currentFamily.id,
          inviterId: user.id,
          inviteeEmail: email,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7일 후 만료
        };
        
        setFamilyInvitations(prev => [...prev, invitation]);
        console.log('가족 초대 시뮬레이션 성공:', email);
        return true;
      }
    } catch (error) {
      console.error('가족 초대 오류:', error);
      setError('가족 초대를 보낼 수 없습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 가족 초대 목록 로드
  const loadFamilyInvitations = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await getFamilyInvitations(token);
      if (response.success && response.data) {
        setFamilyInvitations(response.data);
      } else {
        console.log('가족 초대 목록을 가져올 수 없음, 로컬 스토리지 사용');
        loadInvitationsFromStorage();
      }
    } catch (error) {
      console.error('가족 초대 목록 로드 오류:', error);
      loadInvitationsFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지에서 초대 목록 로드
  const loadInvitationsFromStorage = () => {
    try {
      const storedInvitations = localStorage.getItem('family_invitations');
      if (storedInvitations) {
        setFamilyInvitations(JSON.parse(storedInvitations));
      }
    } catch (error) {
      console.error('로컬 스토리지에서 초대 목록 로드 오류:', error);
    }
  };

  // 초대 수락
  const acceptInvitation = async (invitationId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await acceptFamilyInvitation(token, invitationId);
      if (response.success && response.data) {
        setCurrentFamily(response.data);
        setFamilies(prev => [...prev, response.data!]);
        setFamilyInvitations(prev => 
          prev.map(inv => 
            inv.id === invitationId 
              ? { ...inv, status: 'ACCEPTED' as const }
              : inv
          )
        );
        return true;
      } else {
        // API 실패 시 로컬에서 수락 시뮬레이션
        setFamilyInvitations(prev => 
          prev.map(inv => 
            inv.id === invitationId 
              ? { ...inv, status: 'ACCEPTED' as const }
              : inv
          )
        );
        console.log('가족 초대 수락 시뮬레이션 성공');
        return true;
      }
    } catch (error) {
      console.error('가족 초대 수락 오류:', error);
      setError('가족 초대를 수락할 수 없습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 가족 구성원 로드
  const loadFamilyMembers = async (familyId: string) => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await getFamilyMembers(token, familyId);
      if (response.success && response.data) {
        setFamilyMembers(response.data);
      } else {
        console.log('가족 구성원을 가져올 수 없음, 로컬 스토리지 사용');
        loadMembersFromStorage(familyId);
      }
    } catch (error) {
      console.error('가족 구성원 로드 오류:', error);
      loadMembersFromStorage(familyId);
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지에서 구성원 로드
  const loadMembersFromStorage = (familyId: string) => {
    try {
      const storedMembers = localStorage.getItem(`family_members_${familyId}`);
      if (storedMembers) {
        setFamilyMembers(JSON.parse(storedMembers));
      }
    } catch (error) {
      console.error('로컬 스토리지에서 구성원 로드 오류:', error);
    }
  };

  // 로컬 스토리지에 저장
  const saveFamiliesToStorage = (familiesData: Family[]) => {
    try {
      localStorage.setItem('user_families', JSON.stringify(familiesData));
    } catch (error) {
      console.error('가족 정보 저장 오류:', error);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFamilies();
      loadFamilyInvitations();
    }
  }, [isAuthenticated, user]);

  // 현재 가족이 변경되면 구성원 로드
  useEffect(() => {
    if (currentFamily) {
      loadFamilyMembers(currentFamily.id);
    }
  }, [currentFamily]);

  const value: FamilyContextType = {
    families,
    currentFamily,
    familyMembers,
    familyInvitations,
    loadFamilies,
    createNewFamily,
    inviteToCurrentFamily,
    loadFamilyInvitations,
    acceptInvitation,
    loadFamilyMembers,
    setCurrentFamily,
    isLoading,
    error
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
