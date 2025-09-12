import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EmotionType, EmotionScores } from '../lib/gemini';
import { useSharedData } from './SharedDataContext';

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  emotion: EmotionType;
  emotionScores: EmotionScores;
  author: 'elderly' | 'guardian';
}

interface DiaryContextType {
  diaries: DiaryEntry[];
  addDiary: (diary: Omit<DiaryEntry, 'id'>) => void;
  updateDiary: (id: string, updates: Partial<DiaryEntry>) => void;
  deleteDiary: (id: string) => void;
  resetDiaries: () => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

interface DiaryProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'zogakzogak_diaries';

// 빈 배열로 시작 - 실제 Gemini AI 분석 결과만 사용
const defaultDiaries: DiaryEntry[] = [];

// 로컬 스토리지에서 일기 데이터 로드
const loadDiariesFromStorage = (): DiaryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultDiaries;
    }
  } catch (error) {
    console.error('로컬 스토리지에서 일기 데이터를 로드하는 중 오류:', error);
  }
  return defaultDiaries;
};

// 로컬 스토리지에 일기 데이터 저장
const saveDiariesToStorage = (diaries: DiaryEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries));
  } catch (error) {
    console.error('로컬 스토리지에 일기 데이터를 저장하는 중 오류:', error);
  }
};

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const { addSharedMemory } = useSharedData();

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadedDiaries = loadDiariesFromStorage();
    setDiaries(loadedDiaries);
  }, []);

  const addDiary = (diary: Omit<DiaryEntry, 'id'>) => {
    console.log("📝 addDiary called with:", diary);
    
    const newDiary: DiaryEntry = {
      ...diary,
      id: Date.now().toString(),
    };
    
    console.log("📝 New diary created:", newDiary);
    
    setDiaries(prev => {
      console.log("📝 Previous diaries count:", prev.length);
      const updated = [newDiary, ...prev];
      console.log("📝 Updated diaries count:", updated.length);
      
      try {
        saveDiariesToStorage(updated);
        console.log("✅ Diaries saved to storage successfully");
      } catch (error) {
        console.error("❌ Error saving to storage:", error);
      }
      
      return updated;
    });

    // 자동으로 공유 메모리에 추가
    try {
      addSharedMemory({
        title: `일기 - ${newDiary.date}`,
        description: newDiary.content,
        imageUrl: '', // 일기는 이미지가 없으므로 빈 문자열
        location: {
          name: '집',
          lat: 0,
          lng: 0
        },
        date: newDiary.date,
        people: [diary.author === 'elderly' ? '어르신' : '보호자'],
        tags: ['일기', '감정기록'],
        createdBy: diary.author === 'elderly' ? 'SENIOR' : 'GUARDIAN',
        createdByName: diary.author === 'elderly' ? '어르신' : '보호자'
      });
      console.log("✅ Diary automatically shared as memory");
    } catch (error) {
      console.error("❌ Error sharing diary as memory:", error);
    }
  };

  const updateDiary = (id: string, updates: Partial<DiaryEntry>) => {
    setDiaries(prev => {
      const updated = prev.map(diary => 
        diary.id === id ? { ...diary, ...updates } : diary
      );
      saveDiariesToStorage(updated);
      return updated;
    });
  };

  const deleteDiary = (id: string) => {
    setDiaries(prev => {
      const updated = prev.filter(diary => diary.id !== id);
      saveDiariesToStorage(updated);
      return updated;
    });
  };

  const resetDiaries = () => {
    setDiaries(defaultDiaries);
    saveDiariesToStorage(defaultDiaries);
  };

  return (
    <DiaryContext.Provider value={{ diaries, addDiary, updateDiary, deleteDiary, resetDiaries }}>
      {children}
    </DiaryContext.Provider>
  );
};
