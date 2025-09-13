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
      const memories = JSON.parse(localStorage.getItem('userMemories') || '[]');
      return memories;
    }
    return [];
  } catch (error) {
    console.error('로컬 스토리지에서 추억 로드 실패:', error);
    return [];
  }
};

// 로컬 스토리지에 추억 저장
const saveMemoriesToStorage = (memories: Memory[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userMemories', JSON.stringify(memories));
    }
  } catch (error) {
    console.error('로컬 스토리지에 추억 저장 실패:', error);
  }
};


interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    const loadedMemories = loadMemoriesFromStorage();
    // 사용자 데이터만 표시
    setMemories(loadedMemories);
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setMemories(prev => {
      const updated = [newMemory, ...prev];
      // 모든 추억을 로컬 스토리지에 저장
      saveMemoriesToStorage(updated);
      return updated;
    });
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
    <MemoryContext.Provider value={{ memories, addMemory, updateMemory, deleteMemory, loadMemories }}>
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
