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
  imageName?: string;
  imageSize?: number;
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
    
    // 필수 필드 검증
    if (!memory.title || !memory.imageUrl || !memory.location) {
      console.error("❌ 필수 필드가 누락되었습니다:", { title: memory.title, imageUrl: memory.imageUrl, location: memory.location });
      return;
    }
    
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tags: memory.tags || [], // tags가 없으면 빈 배열로 설정
    };
    
    console.log("📝 New memory created:", newMemory);
    
    setMemories(prev => {
      console.log("📝 Previous memories count:", prev.length);
      const updated = [newMemory, ...prev];
      console.log("📝 Updated memories count:", updated.length);
      
      try {
        saveMemoriesToStorage(updated);
        console.log("✅ Memories saved to storage successfully");
        
        // 저장 후 즉시 로드해서 확인
        const verifyMemories = loadMemoriesFromStorage();
        console.log("🔍 저장 후 검증 - 로드된 추억 개수:", verifyMemories.length);
        
        // 저장이 성공했으면 상태도 업데이트
        if (verifyMemories.length > 0) {
          setMemories(verifyMemories);
        }
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
    console.log("🔄 loadMemories 호출됨");
    const loadedMemories = loadMemoriesFromStorage();
    console.log("📊 로드된 추억 개수:", loadedMemories.length);
    setMemories(loadedMemories);
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, updateMemory, deleteMemory, loadMemories }}>
      {children}
    </MemoryContext.Provider>
  );
};