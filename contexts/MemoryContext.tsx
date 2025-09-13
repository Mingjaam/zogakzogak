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

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};

interface MemoryProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'zogakzogak_memories';

// 빈 배열로 시작
const defaultMemories: Memory[] = [];

// 로컬 스토리지에서 추억 데이터 로드
const loadMemoriesFromStorage = (): Memory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultMemories;
    }
  } catch (error) {
    console.error('로컬 스토리지에서 추억 데이터를 로드하는 중 오류:', error);
  }
  return defaultMemories;
};

// 로컬 스토리지에 추억 데이터 저장
const saveMemoriesToStorage = (memories: Memory[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    console.error('로컬 스토리지에 추억 데이터를 저장하는 중 오류:', error);
  }
};

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadedMemories = loadMemoriesFromStorage();
    setMemories(loadedMemories);
  }, []);

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    console.log("📝 addMemory called with:", memory);
    
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    console.log("📝 New memory created:", newMemory);
    
    setMemories(prev => {
      console.log("📝 Previous memories count:", prev.length);
      const updated = [newMemory, ...prev];
      console.log("📝 Updated memories count:", updated.length);
      
      try {
        saveMemoriesToStorage(updated);
        console.log("✅ Memories saved to storage successfully");
      } catch (error) {
        console.error("❌ Error saving to storage:", error);
      }
      
      return updated;
    });
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => {
      const updated = prev.map(memory => 
        memory.id === id ? { ...memory, ...updates } : memory
      );
      saveMemoriesToStorage(updated);
      return updated;
    });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => {
      const updated = prev.filter(memory => memory.id !== id);
      saveMemoriesToStorage(updated);
      return updated;
    });
  };

  const loadMemories = () => {
    const loadedMemories = loadMemoriesFromStorage();
    setMemories(loadedMemories);
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, updateMemory, deleteMemory, loadMemories }}>
      {children}
    </MemoryContext.Provider>
  );
};