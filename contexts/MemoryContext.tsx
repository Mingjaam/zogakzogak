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

// 더미 추억 데이터
const dummyMemories: Memory[] = [
  {
    id: 'dummy-1',
    title: "사랑하는 가족들과 함께한 시간",
    description: "딸과 손자들과 함께한 즐거운 시간이었습니다.",
    location: {
      lat: 35.8714,
      lng: 128.6014,
      name: "대구 월성동",
      address: "대구 월성동",
      description: "가족과 함께한 특별한 장소"
    },
    imageUrl: "https://i.imgur.com/k2m3s4f.png",
    date: "2024.05.05",
    createdAt: "2024-05-05T00:00:00.000Z",
    tags: ["가족", "행복"]
  },
  {
    id: 'dummy-2',
    title: "봄날의 산책",
    description: "따뜻한 봄날 산책로를 걸으며 좋은 시간을 보냈습니다.",
    location: {
      lat: 35.8281,
      lng: 128.6811,
      name: "대구 수성못",
      address: "대구 수성못",
      description: "봄날 산책로"
    },
    imageUrl: "https://i.imgur.com/k2m3s4f.png",
    date: "2024.04.15",
    createdAt: "2024-04-15T00:00:00.000Z",
    tags: ["산책", "봄"]
  },
  {
    id: 'dummy-3',
    title: "생일 축하 파티",
    description: "65번째 생일을 가족들과 함께 축하했습니다.",
    location: {
      lat: 35.8714,
      lng: 128.6014,
      name: "집",
      address: "집",
      description: "가정집"
    },
    imageUrl: "https://i.imgur.com/k2m3s4f.png",
    date: "2024.03.20",
    createdAt: "2024-03-20T00:00:00.000Z",
    tags: ["생일", "축하"]
  },
  {
    id: 'dummy-4',
    title: "손자와의 첫 만남",
    description: "첫 손자를 안아보는 순간, 세상에서 가장 행복했습니다.",
    location: {
      lat: 35.8714,
      lng: 128.6014,
      name: "병원",
      address: "병원",
      description: "병원"
    },
    imageUrl: "https://i.imgur.com/k2m3s4f.png",
    date: "2024.02.10",
    createdAt: "2024-02-10T00:00:00.000Z",
    tags: ["손자", "첫만남"]
  }
];

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
    // 더미 데이터와 사용자 데이터 결합
    const allMemories = [...loadedMemories, ...dummyMemories];
    setMemories(allMemories);
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setMemories(prev => {
      const updated = [newMemory, ...prev];
      // 사용자 추억만 로컬 스토리지에 저장 (더미 데이터 제외)
      const userMemories = updated.filter(m => !m.id.startsWith('dummy-'));
      saveMemoriesToStorage(userMemories);
      return updated;
    });
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => {
      const updated = prev.map(memory => 
        memory.id === id ? { ...memory, ...updates } : memory
      );
      // 사용자 추억만 로컬 스토리지에 저장
      const userMemories = updated.filter(m => !m.id.startsWith('dummy-'));
      saveMemoriesToStorage(userMemories);
      return updated;
    });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => {
      const updated = prev.filter(memory => memory.id !== id);
      // 사용자 추억만 로컬 스토리지에 저장
      const userMemories = updated.filter(m => !m.id.startsWith('dummy-'));
      saveMemoriesToStorage(userMemories);
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
