import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Memory {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    address: string;
    description?: string;
  };
  imageUrl: string;
  date: string;
  createdAt: string;
  tags: string[];
}

interface MemoryContextType {
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  loadMemories: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

// 기존 데이터 마이그레이션 (userMemories -> zogakzogak_memories)
const migrateOldData = (): Memory[] => {
  try {
    const oldData = localStorage.getItem('userMemories');
    if (oldData) {
      const memories = JSON.parse(oldData);
      if (Array.isArray(memories) && memories.length > 0) {
        console.log('🔄 기존 데이터 마이그레이션 중:', memories.length, '개');
        localStorage.setItem('zogakzogak_memories', oldData);
        localStorage.removeItem('userMemories');
        console.log('✅ 데이터 마이그레이션 완료');
        return memories;
      }
    }
  } catch (error) {
    console.error('❌ 데이터 마이그레이션 실패:', error);
  }
  return [];
};

// 로컬 스토리지에서 추억 로드
const loadMemoriesFromStorage = (): Memory[] => {
  try {
    // PWA 환경에서 localStorage 접근 확인
    if (typeof window === 'undefined') {
      console.log('❌ window 객체가 없습니다 (SSR 환경)');
      return [];
    }
    
    if (!window.localStorage) {
      console.log('❌ localStorage를 사용할 수 없습니다');
      return [];
    }
    
    const stored = localStorage.getItem('zogakzogak_memories');
    console.log('🔍 로컬 스토리지에서 추억 데이터 로드:', stored ? '데이터 있음' : '데이터 없음');
    
    if (stored) {
      const memories = JSON.parse(stored);
      console.log('✅ 파싱된 추억 데이터 개수:', memories.length);
      return Array.isArray(memories) ? memories : [];
    } else {
      // 기존 데이터가 있는지 확인하고 마이그레이션
      const migratedMemories = migrateOldData();
      if (migratedMemories.length > 0) {
        return migratedMemories;
      }
      console.log('📝 저장된 추억 데이터가 없습니다.');
      return [];
    }
  } catch (error) {
    console.error('❌ 로컬 스토리지에서 추억 로드 실패:', error);
    return [];
  }
};

// 로컬 스토리지에 추억 저장
const saveMemoriesToStorage = (memories: Memory[]): void => {
  try {
    // PWA 환경에서 localStorage 접근 확인
    if (typeof window === 'undefined') {
      console.log('❌ window 객체가 없습니다 (SSR 환경)');
      return;
    }
    
    if (!window.localStorage) {
      console.log('❌ localStorage를 사용할 수 없습니다');
      return;
    }
    
    const dataToStore = JSON.stringify(memories);
    console.log('💾 추억 데이터 저장 중:', memories.length, '개');
    
    // PWA에서 안정적인 저장을 위해 try-catch로 감싸고 재시도 로직 추가
    let retryCount = 0;
    const maxRetries = 3;
    
    const saveWithRetry = () => {
      try {
        localStorage.setItem('zogakzogak_memories', dataToStore);
        console.log('✅ 추억 데이터 저장 완료');
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`🔄 저장 재시도 ${retryCount}/${maxRetries}`);
          setTimeout(saveWithRetry, 100 * retryCount); // 지수 백오프
        } else {
          throw error;
        }
      }
    };
    
    saveWithRetry();
  } catch (error) {
    console.error('❌ 로컬 스토리지에 추억 저장 실패:', error);
  }
};


interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMemories = useCallback(() => {
    console.log('📂 추억 데이터 로드 함수 호출');
    const loadedMemories = loadMemoriesFromStorage();
    console.log('📊 로드된 추억 개수:', loadedMemories.length);
    
    setMemories(loadedMemories);
    setIsLoaded(true);
  }, []);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    console.log('🚀 MemoryProvider 마운트됨, 추억 데이터 로드 시작');
    loadMemories();
  }, [loadMemories]);

  // 앱이 포커스를 받을 때마다 데이터 새로고침 (PWA에서 중요)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 앱 포커스 - 추억 데이터 새로고침');
      loadMemories();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 앱 가시성 변경 - 추억 데이터 새로고침');
        loadMemories();
      }
    };

    // 페이지 로드 완료 후에도 한 번 더 로드
    const handleLoad = () => {
      console.log('🔄 페이지 로드 완료 - 추억 데이터 새로고침');
      loadMemories();
    };

    // PWA 환경에서 안전하게 이벤트 리스너 추가
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('load', handleLoad);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('load', handleLoad);
      }
    };
  }, [loadMemories]);

  // 주기적으로 데이터 동기화 (PWA에서 중요) - 빈도 줄임
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ 주기적 데이터 동기화');
      loadMemories();
    }, 30000); // 30초마다 동기화 (성능 개선)

    return () => clearInterval(interval);
  }, [loadMemories]);

  const addMemory = useCallback((memory: Omit<Memory, 'id' | 'createdAt'>) => {
    console.log('➕ MemoryContext - 새 추억 추가:', memory);
    
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    console.log('🆕 MemoryContext - 생성된 새 추억:', newMemory);

    setMemories(prev => {
      const updated = [newMemory, ...prev];
      console.log('📝 MemoryContext - 업데이트된 추억 목록:', updated.length, '개');
      
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
  }, []);

  // 로컬 스토리지에서 직접 로드하는 함수 (외부에서 호출 가능)
  const loadMemoriesFromLocalStorage = useCallback(() => {
    console.log('🔄 MemoryContext - 외부에서 로드 요청');
    loadMemories();
  }, [loadMemories]);

  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setMemories(prev => {
      const updated = prev.map(memory => 
        memory.id === id ? { ...memory, ...updates } : memory
      );
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => {
      const updated = prev.filter(memory => memory.id !== id);
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
  }, []);

  return (
    <MemoryContext.Provider value={{ memories, addMemory, updateMemory, deleteMemory, loadMemories: loadMemoriesFromLocalStorage }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};
