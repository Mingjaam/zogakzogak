import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// 로컬 스토리지에서 추억 로드
const loadMemoriesFromStorage = (): Memory[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('userMemories');
      console.log('🔍 로컬 스토리지에서 추억 데이터 로드:', stored);
      
      if (stored) {
        const memories = JSON.parse(stored);
        console.log('✅ 파싱된 추억 데이터:', memories);
        return memories;
      } else {
        console.log('📝 저장된 추억 데이터가 없습니다.');
        return [];
      }
    }
    console.log('❌ window 또는 localStorage가 사용할 수 없습니다.');
    return [];
  } catch (error) {
    console.error('❌ 로컬 스토리지에서 추억 로드 실패:', error);
    return [];
  }
};

// 로컬 스토리지에 추억 저장
const saveMemoriesToStorage = (memories: Memory[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const dataToStore = JSON.stringify(memories);
      console.log('💾 추억 데이터 저장 중:', memories.length, '개');
      localStorage.setItem('userMemories', dataToStore);
      console.log('✅ 추억 데이터 저장 완료');
    } else {
      console.log('❌ localStorage를 사용할 수 없습니다.');
    }
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

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    console.log('🚀 MemoryProvider 마운트됨, 추억 데이터 로드 시작');
    loadMemories();
  }, []);

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

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadMemories = () => {
    console.log('📂 추억 데이터 로드 함수 호출');
    const loadedMemories = loadMemoriesFromStorage();
    console.log('📊 로드된 추억 개수:', loadedMemories.length);
    setMemories(loadedMemories);
    setIsLoaded(true);
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
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
  };

  // 로컬 스토리지에서 직접 로드하는 함수 (외부에서 호출 가능)
  const loadMemoriesFromLocalStorage = () => {
    console.log('🔄 MemoryContext - 외부에서 로드 요청');
    loadMemories();
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => {
      const updated = prev.map(memory => 
        memory.id === id ? { ...memory, ...updates } : memory
      );
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => {
      const updated = prev.filter(memory => memory.id !== id);
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
  };

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
