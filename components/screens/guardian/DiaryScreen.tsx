import React, { useState } from 'react';
import { EmotionType, EmotionScores } from '../../../lib/gemini';
import EmotionCharacter from '../../icons/EmotionCharacter';
import EmotionChart from '../../EmotionChart';
import { useDiary } from '../../../contexts/DiaryContext';
import { useSharedData } from '../../../contexts/SharedDataContext';

interface DiaryScreenProps {
  // Props can be added later if needed
}

const DiaryScreen: React.FC<DiaryScreenProps> = () => {
  const { diaries, deleteDiary } = useDiary();
  const { sharedMemories } = useSharedData();
  const [selectedEntry, setSelectedEntry] = useState<typeof diaries[0] | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  
  // 어르신이 작성한 일기와 공유 메모리 통합 (최신순)
  const allEntries = [
    ...diaries.filter(diary => diary.author === 'elderly').map(diary => ({
      ...diary,
      type: 'diary' as const,
      createdBy: 'SENIOR' as const,
      createdByName: '어르신',
      sharedAt: diary.date
    })),
    ...sharedMemories.map(memory => ({
      ...memory,
      type: 'memory' as const,
      author: memory.createdBy === 'SENIOR' ? 'elderly' : 'guardian',
      date: memory.sharedAt,
      emotionScores: { joy: 0.5, happiness: 0.3, surprise: 0.1, sadness: 0.05, anger: 0.03, fear: 0.02 } as EmotionScores
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const diaryEntries = allEntries;
  
  // 오늘의 기분 계산 (가장 최근 일기의 가장 높은 점수 감정)
  const getTodayEmotion = (): EmotionType => {
    if (diaryEntries.length === 0) return 'joy';
    
    const todayDiary = diaryEntries[0]; // 가장 최근 일기
    const scores = todayDiary.emotionScores;
    
    // 가장 높은 점수의 감정 찾기
    const emotions: EmotionType[] = ['joy', 'happiness', 'surprise', 'sadness', 'anger', 'fear'];
    return emotions.reduce((prev, current) => 
      scores[current] > scores[prev] ? current : prev
    );
  };
  
  const todayEmotion = getTodayEmotion();
  
  // 첫 번째 일기를 기본 선택으로 설정
  React.useEffect(() => {
    if (diaryEntries.length > 0 && !selectedEntry) {
      setSelectedEntry(diaryEntries[0]);
    }
  }, [diaryEntries, selectedEntry]);

  const handleDeleteDiary = (diaryId: string) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      deleteDiary(diaryId);
      console.log('일기가 삭제되었습니다:', diaryId);
      
      // 삭제된 일기가 현재 선택된 일기라면 선택 해제
      if (selectedEntry?.id === diaryId) {
        setSelectedEntry(null);
      }
    }
  };

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-gray-800">어르신의 일기</h2>
          {diaryEntries.length > 0 && (
            <div className="flex items-center gap-3">
              <EmotionCharacter emotion={todayEmotion} size="sm" />
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <span className="text-sm font-semibold text-green-800">
                  오늘의 기분: {todayEmotion === 'joy' ? '기뻐요' : 
                   todayEmotion === 'happiness' ? '행복함' :
                   todayEmotion === 'surprise' ? '놀라움' :
                   todayEmotion === 'sadness' ? '슬퍼요' :
                   todayEmotion === 'anger' ? '화나요' : '두려워요'}
                </span>
                <span className="text-xs text-green-600">
                  ({diaryEntries[0].emotionScores[todayEmotion]}%)
                </span>
              </div>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm">어르신이 작성한 일기의 감정을 분석해드려요</p>
        <p className="text-xs text-gray-500 mt-1">총 {diaryEntries.length}개의 일기</p>
      </div>

      {/* 선택된 일기 상세 */}
      {selectedEntry && (
        <div className="space-y-6">
          {/* 일기 내용 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <EmotionCharacter emotion={selectedEntry.emotion} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedEntry.date}</h3>
                <p className="text-sm text-gray-600">
                  {selectedEntry.type === 'diary' ? '어르신의 일기' : `${selectedEntry.createdByName}의 추억`}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">{selectedEntry.content}</p>
            </div>
          </div>

          {/* 감정 분석 그래프 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">감정 분석 결과</h3>
            <EmotionChart scores={selectedEntry.emotionScores} />
          </div>
        </div>
      )}

      {/* 일기 목록 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">최근 일기</h3>
        <div className="space-y-3">
          {diaryEntries.map((entry) => (
            <div
              key={entry.id}
              className={`w-full p-4 rounded-2xl shadow-lg border transition-all ${
                selectedEntry?.id === entry.id 
                  ? 'bg-white border-green-200 ring-2 ring-green-100' 
                  : 'bg-white border-gray-100 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <EmotionCharacter emotion={entry.emotion} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{entry.date}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'diary' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.type === 'diary' ? '일기' : '추억'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {expandedEntry === entry.id ? entry.content : 
                       entry.content.length > 50 ? `${entry.content.substring(0, 50)}...` : entry.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.type === 'diary' ? '어르신이 작성' : `${entry.createdByName}이 추가`}
                    </p>
                    {entry.content.length > 50 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedEntry(expandedEntry === entry.id ? null : entry.id);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        {expandedEntry === entry.id ? '접기' : '더보기'}
                      </button>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">감정 분석</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDiary(entry.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="일기 삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryScreen;
