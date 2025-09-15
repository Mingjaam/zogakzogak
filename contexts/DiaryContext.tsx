import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EmotionType, EmotionScores } from '../lib/gemini';
import api from '../lib/api-services';
import { Diary } from '../lib/api-types';

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
  addDiary: (diary: Omit<DiaryEntry, 'id'>) => Promise<void>;
  updateDiary: (id: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;
  loadDiaries: () => Promise<void>;
  isLoading: boolean;
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

// 서버 Diary 타입을 클라이언트 DiaryEntry 타입으로 변환
const convertServerDiaryToClient = (serverDiary: Diary): DiaryEntry => {
  return {
    id: serverDiary.id.toString(),
    date: serverDiary.date,
    content: serverDiary.content,
    emotion: serverDiary.emotion as EmotionType,
    emotionScores: serverDiary.emotionScores,
    author: 'elderly' // 서버에서 role 정보를 받아서 설정해야 함
  };
};

// 클라이언트 DiaryEntry 타입을 서버 Diary 타입으로 변환
const convertClientDiaryToServer = (clientDiary: Omit<DiaryEntry, 'id'>) => {
  return {
    seniorId: 1, // TODO: 실제 어르신 ID 사용
    content: clientDiary.content,
    date: clientDiary.date,
    sadness: clientDiary.emotionScores.sadness,
    anger: clientDiary.emotionScores.anger,
    fear: clientDiary.emotionScores.fear,
    joy: clientDiary.emotionScores.joy,
    happiness: clientDiary.emotionScores.happiness,
    surprise: clientDiary.emotionScores.surprise
  };
};

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 일기 데이터 로드
  const loadDiaries = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 어르신 ID 사용
      const serverDiaries = await api.diary.getDiaries(1);
      const convertedDiaries = serverDiaries.map(convertServerDiaryToClient);
      setDiaries(convertedDiaries);
    } catch (error) {
      console.error('일기 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 서버에서 데이터 로드
  useEffect(() => {
    loadDiaries();
  }, []);

  const addDiary = async (diary: Omit<DiaryEntry, 'id'>) => {
    console.log("📝 addDiary called with:", diary);
    
    try {
      const serverDiaryData = convertClientDiaryToServer(diary);
      const createdDiary = await api.diary.createDiary(serverDiaryData);
      
      // 서버에서 생성된 일기를 클라이언트 형식으로 변환
      const newDiary = convertServerDiaryToClient(createdDiary);
      
      setDiaries(prev => [newDiary, ...prev]);
      console.log("✅ Diary saved to server successfully");
    } catch (error) {
      console.error("❌ Error saving diary to server:", error);
      throw error;
    }
  };

  const updateDiary = async (id: string, updates: Partial<DiaryEntry>) => {
    try {
      const diaryId = parseInt(id);
      const updateData = {
        content: updates.content,
        sadness: updates.emotionScores?.sadness,
        anger: updates.emotionScores?.anger,
        fear: updates.emotionScores?.fear,
        joy: updates.emotionScores?.joy,
        happiness: updates.emotionScores?.happiness,
        surprise: updates.emotionScores?.surprise
      };
      
      await api.diary.updateDiary(diaryId, updateData);
      
      // 로컬 상태 업데이트
      setDiaries(prev => 
        prev.map(diary => 
          diary.id === id ? { ...diary, ...updates } : diary
        )
      );
    } catch (error) {
      console.error("❌ Error updating diary:", error);
      throw error;
    }
  };

  const deleteDiary = async (id: string) => {
    try {
      const diaryId = parseInt(id);
      await api.diary.deleteDiary(diaryId);
      
      setDiaries(prev => prev.filter(diary => diary.id !== id));
    } catch (error) {
      console.error("❌ Error deleting diary:", error);
      throw error;
    }
  };

  return (
    <DiaryContext.Provider value={{ 
      diaries, 
      addDiary, 
      updateDiary, 
      deleteDiary, 
      loadDiaries,
      isLoading 
    }}>
      {children}
    </DiaryContext.Provider>
  );
};
