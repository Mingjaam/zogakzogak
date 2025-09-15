import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api-services';
import { Memory, CreateMemoryRequest } from '../lib/api-types';

interface MemoryContextType {
  memories: Memory[];
  addMemory: (memoryData: CreateMemoryRequest, photo: File) => Promise<void>;
  deleteMemory: (id: number) => Promise<void>;
  loadMemories: () => Promise<void>;
  isLoading: boolean;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 추억 데이터 로드
  const loadMemories = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 어르신 ID 사용
      const serverMemories = await api.memory.getMemories(1);
      setMemories(serverMemories);
    } catch (error) {
      console.error('추억 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 추억 추가
  const addMemory = async (memoryData: CreateMemoryRequest, photo: File) => {
    try {
      // TODO: 실제 어르신 ID 사용
      const createdMemory = await api.memory.createMemory(1, memoryData, photo);
      setMemories(prev => [createdMemory, ...prev]);
    } catch (error) {
      console.error('추억 추가 실패:', error);
      throw error;
    }
  };

  // 추억 삭제
  const deleteMemory = async (id: number) => {
    try {
      await api.memory.deleteMemory(id);
      setMemories(prev => prev.filter(memory => memory.memoryId !== id));
    } catch (error) {
      console.error('추억 삭제 실패:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 서버에서 데이터 로드
  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <MemoryContext.Provider value={{
      memories,
      addMemory,
      deleteMemory,
      loadMemories,
      isLoading
    }}>
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