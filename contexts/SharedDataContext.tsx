import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Memory } from '../types/memory';
import { syncSharedData, syncSharedMemories, syncSharedLocations, syncSharedMedications } from '../lib/api';

// 공유 데이터 타입 정의
export interface SharedMemory extends Memory {
  createdBy: 'SENIOR' | 'GUARDIAN';
  createdByName: string;
  sharedAt: string;
}

export interface SharedLocation {
  id: string;
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  isActive: boolean;
}

export interface SharedMedication {
  id: string;
  userId: string;
  userName: string;
  name: string;
  dosage: string;
  time: string;
  isTaken: boolean;
  takenAt?: string;
  createdAt: string;
}

export interface SharedNotification {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  type: 'MEMORY' | 'LOCATION' | 'MEDICATION' | 'EMERGENCY';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

interface SharedDataContextType {
  // 공유 메모리
  sharedMemories: SharedMemory[];
  addSharedMemory: (memory: Omit<SharedMemory, 'id' | 'sharedAt'>) => void;
  updateSharedMemory: (id: string, updates: Partial<SharedMemory>) => void;
  deleteSharedMemory: (id: string) => void;
  
  // 공유 위치
  sharedLocations: SharedLocation[];
  updateLocation: (location: Omit<SharedLocation, 'id' | 'timestamp'>) => void;
  
  // 공유 약물 관리
  sharedMedications: SharedMedication[];
  addMedication: (medication: Omit<SharedMedication, 'id' | 'createdAt'>) => void;
  updateMedication: (id: string, updates: Partial<SharedMedication>) => void;
  takeMedication: (id: string) => void;
  
  // 공유 알림
  sharedNotifications: SharedNotification[];
  addNotification: (notification: Omit<SharedNotification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  // 연결된 사용자 정보
  connectedUser: any | null;
  isConnected: boolean;
  connectWithUser: (email: string) => void;
  disconnectUser: () => void;
  
  // 데이터 동기화
  syncData: () => Promise<void>;
  isLoading: boolean;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

interface SharedDataProviderProps {
  children: ReactNode;
}

export const SharedDataProvider: React.FC<SharedDataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [sharedMemories, setSharedMemories] = useState<SharedMemory[]>([]);
  const [sharedLocations, setSharedLocations] = useState<SharedLocation[]>([]);
  const [sharedMedications, setSharedMedications] = useState<SharedMedication[]>([]);
  const [sharedNotifications, setSharedNotifications] = useState<SharedNotification[]>([]);
  const [connectedUser, setConnectedUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 연결 상태 확인 및 데이터 동기화
  useEffect(() => {
    if (isAuthenticated && user) {
      checkConnectionAndSync();
      checkConnectionStatus();
    }
  }, [isAuthenticated, user]);

  // 연결 상태 확인 (로컬 스토리지 기반)
  const checkConnectionStatus = () => {
    try {
      const connectionData = localStorage.getItem('user_connection');
      if (connectionData) {
        const { isConnected: storedConnection, connectedUser: storedUser } = JSON.parse(connectionData);
        setIsConnected(storedConnection);
        setConnectedUser(storedUser);
      } else {
        // 연결되지 않은 상태로 초기화
        setIsConnected(false);
        setConnectedUser(null);
      }
    } catch (error) {
      console.error('연결 상태 확인 오류:', error);
      setIsConnected(false);
      setConnectedUser(null);
    }
  };

  const checkConnectionAndSync = async () => {
    setIsLoading(true);
    try {
      // 더미데이터로 초기화
      console.log('🔄 더미데이터로 초기화...');
      
      // 더미 메모리 데이터
      const dummyMemories = [
        {
          id: 'memory_1',
          title: '오늘의 산책',
          content: '공원에서 산책을 했습니다. 날씨가 좋아서 기분이 좋았어요.',
          date: new Date().toISOString(),
          location: '한강공원',
          mood: 'happy',
          images: []
        },
        {
          id: 'memory_2',
          title: '가족과의 식사',
          content: '가족들과 함께 맛있는 저녁을 먹었습니다.',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: '집',
          mood: 'content',
          images: []
        }
      ];
      setSharedMemories(dummyMemories);

      // 더미 약물 데이터
      const dummyMedications = [
        {
          id: 'med_1',
          name: '혈압약',
          dosage: '1정',
          frequency: '하루 1회',
          time: '아침',
          startDate: new Date().toISOString(),
          endDate: null,
          isActive: true,
          notes: '식후 30분에 복용'
        },
        {
          id: 'med_2',
          name: '비타민',
          dosage: '2정',
          frequency: '하루 1회',
          time: '점심',
          startDate: new Date().toISOString(),
          endDate: null,
          isActive: true,
          notes: '식사와 함께 복용'
        }
      ];
      setSharedMedications(dummyMedications);

      // 더미 위치 데이터
      const dummyLocations = [
        {
          id: 'loc_1',
          name: '집',
          address: '서울시 강남구',
          latitude: 37.5665,
          longitude: 126.9780,
          timestamp: new Date().toISOString(),
          isSafeZone: true
        },
        {
          id: 'loc_2',
          name: '병원',
          address: '서울시 강남구 병원',
          latitude: 37.5665,
          longitude: 126.9780,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isSafeZone: false
        }
      ];
      setSharedLocations(dummyLocations);

      // 더미 알림 데이터
      const dummyNotifications = [
        {
          id: 'notif_1',
          title: '약물 복용 알림',
          message: '혈압약을 복용할 시간입니다.',
          type: 'medication',
          timestamp: new Date().toISOString(),
          isRead: false
        },
        {
          id: 'notif_2',
          title: '안전구역 알림',
          message: '안전구역을 벗어났습니다.',
          type: 'safety',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: true
        }
      ];
      setSharedNotifications(dummyNotifications);

      console.log('✅ 더미데이터 초기화 완료');
      
      // 로컬 스토리지에도 저장
      saveSharedDataToStorage();
    } catch (error) {
      console.error('데이터 초기화 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSharedDataFromStorage = () => {
    try {
      const storedMemories = localStorage.getItem('shared_memories');
      if (storedMemories) {
        setSharedMemories(JSON.parse(storedMemories));
      }

      const storedLocations = localStorage.getItem('shared_locations');
      if (storedLocations) {
        setSharedLocations(JSON.parse(storedLocations));
      }

      const storedMedications = localStorage.getItem('shared_medications');
      if (storedMedications) {
        setSharedMedications(JSON.parse(storedMedications));
      }

      const storedNotifications = localStorage.getItem('shared_notifications');
      if (storedNotifications) {
        setSharedNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('로컬 스토리지 로드 오류:', error);
    }
  };

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('로컬 스토리지 저장 오류:', error);
    }
  };

  // 서버에 데이터 동기화
  const syncToServer = async (type: string, data: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      console.log(`${type} 데이터를 서버에 동기화 시도:`, data);
      
      // 실제 서버 API 호출
      switch (type) {
        case 'memories':
          await syncSharedMemories(token, data);
          break;
        case 'locations':
          await syncSharedLocations(token, data);
          break;
        case 'medications':
          await syncSharedMedications(token, data);
          break;
      }
    } catch (error) {
      console.error('서버 동기화 오류:', error);
    }
  };

  // 공유 메모리 관리
  const addSharedMemory = (memory: Omit<SharedMemory, 'id' | 'sharedAt'>) => {
    const newMemory: SharedMemory = {
      ...memory,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sharedAt: new Date().toISOString(),
    };
    
    const updatedMemories = [...sharedMemories, newMemory];
    setSharedMemories(updatedMemories);
    saveToStorage('shared_memories', updatedMemories);
    
    // 자동으로 상대방에게 알림 추가 (연결된 사용자가 있으면)
    if (connectedUser) {
      addNotification({
        fromUserId: user?.id || '',
        fromUserName: user?.name || '',
        toUserId: connectedUser?.id || '',
        toUserName: connectedUser?.name || '',
        type: 'MEMORY',
        title: '새로운 추억이 추가되었습니다',
        message: `${user?.name}님이 새로운 추억을 기록했습니다.`,
        data: { memoryId: newMemory.id },
        isRead: false,
      });
    }
    
    // 서버에 동기화 시도
    syncToServer('memories', updatedMemories);
  };

  const updateSharedMemory = (id: string, updates: Partial<SharedMemory>) => {
    const updatedMemories = sharedMemories.map(memory =>
      memory.id === id ? { ...memory, ...updates } : memory
    );
    setSharedMemories(updatedMemories);
    saveToStorage('shared_memories', updatedMemories);
  };

  const deleteSharedMemory = (id: string) => {
    const updatedMemories = sharedMemories.filter(memory => memory.id !== id);
    setSharedMemories(updatedMemories);
    saveToStorage('shared_memories', updatedMemories);
  };

  // 공유 위치 관리
  const updateLocation = (location: Omit<SharedLocation, 'id' | 'timestamp'>) => {
    const newLocation: SharedLocation = {
      ...location,
      id: `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedLocations = [...sharedLocations.filter(l => l.userId !== location.userId), newLocation];
    setSharedLocations(updatedLocations);
    saveToStorage('shared_locations', updatedLocations);
    
    // 서버에 동기화
    syncToServer('locations', updatedLocations);
  };

  // 공유 약물 관리
  const addMedication = (medication: Omit<SharedMedication, 'id' | 'createdAt'>) => {
    const newMedication: SharedMedication = {
      ...medication,
      id: `medication_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedMedications = [...sharedMedications, newMedication];
    setSharedMedications(updatedMedications);
    saveToStorage('shared_medications', updatedMedications);
    
    // 서버에 동기화
    syncToServer('medications', updatedMedications);
  };

  const updateMedication = (id: string, updates: Partial<SharedMedication>) => {
    const updatedMedications = sharedMedications.map(medication =>
      medication.id === id ? { ...medication, ...updates } : medication
    );
    setSharedMedications(updatedMedications);
    saveToStorage('shared_medications', updatedMedications);
    
    // 서버에 동기화
    syncToServer('medications', updatedMedications);
  };

  const takeMedication = (id: string) => {
    updateMedication(id, {
      isTaken: true,
      takenAt: new Date().toISOString(),
    });
  };

  // 공유 알림 관리
  const addNotification = (notification: Omit<SharedNotification, 'id' | 'createdAt'>) => {
    const newNotification: SharedNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [...sharedNotifications, newNotification];
    setSharedNotifications(updatedNotifications);
    saveToStorage('shared_notifications', updatedNotifications);
  };

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = sharedNotifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setSharedNotifications(updatedNotifications);
    saveToStorage('shared_notifications', updatedNotifications);
  };

  // 연결 함수들
  const connectWithUser = (email: string) => {
    // 이메일로 연결 요청 시뮬레이션
    const connectionData = {
      isConnected: true,
      connectedUser: {
        id: `user_${Date.now()}`,
        name: email.includes('guardian') ? '보호자' : '어르신',
        email: email,
        role: email.includes('guardian') ? 'GUARDIAN' : 'SENIOR'
      }
    };
    
    localStorage.setItem('user_connection', JSON.stringify(connectionData));
    setIsConnected(true);
    setConnectedUser(connectionData.connectedUser);
    
    // 연결 성공 알림 추가
    addNotification({
      fromUserId: user?.id || '',
      fromUserName: user?.name || '',
      toUserId: connectionData.connectedUser.id,
      toUserName: connectionData.connectedUser.name,
      type: 'MEMORY',
      title: '연결 요청이 전송되었습니다',
      message: `${email}로 연결 요청을 보냈습니다.`,
      isRead: false,
    });
  };

  const disconnectUser = () => {
    localStorage.removeItem('user_connection');
    setIsConnected(false);
    setConnectedUser(null);
  };

  // 데이터 동기화
  const syncData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // 서버에서 최신 데이터 가져오기
      const response = await syncSharedData(token);
      if (response.success && response.data) {
        // 서버 데이터로 로컬 상태 업데이트
        setSharedMemories(response.data.memories || []);
        setSharedLocations(response.data.locations || []);
        setSharedMedications(response.data.medications || []);
        setSharedNotifications(response.data.notifications || []);
        
        // 로컬 스토리지에도 저장
        saveToStorage('shared_memories', response.data.memories || []);
        saveToStorage('shared_locations', response.data.locations || []);
        saveToStorage('shared_medications', response.data.medications || []);
        saveToStorage('shared_notifications', response.data.notifications || []);
      }
    } catch (error) {
      console.error('데이터 동기화 오류:', error);
      // 오류 시 로컬 스토리지에서 로드
      loadSharedDataFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // 주기적 데이터 동기화
  useEffect(() => {
    if (isAuthenticated && user) {
      // 초기 동기화
      syncData();
      
      // 30초마다 동기화
      const interval = setInterval(syncData, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const value: SharedDataContextType = {
    sharedMemories,
    addSharedMemory,
    updateSharedMemory,
    deleteSharedMemory,
    sharedLocations,
    updateLocation,
    sharedMedications,
    addMedication,
    updateMedication,
    takeMedication,
    sharedNotifications,
    addNotification,
    markNotificationAsRead,
    connectedUser,
    isConnected,
    connectWithUser,
    disconnectUser,
    syncData,
    isLoading,
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = (): SharedDataContextType => {
  const context = useContext(SharedDataContext);
  if (context === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};
