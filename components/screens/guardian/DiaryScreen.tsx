import React, { useState } from 'react';

interface DiaryScreenProps {
  // Props can be added later if needed
}

interface EmotionData {
  happiness: number;
  love: number;
  surprise: number;
  sadness: number;
  anger: number;
  fear: number;
}

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  emotions: EmotionData;
  character: string;
}

const DiaryScreen: React.FC<DiaryScreenProps> = () => {
  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const [diaryEntries] = useState<DiaryEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      content: '오늘은 손자와 함께 산책을 했어요. 정말 즐거웠습니다.',
      emotions: {
        happiness: 85,
        love: 70,
        surprise: 20,
        sadness: 5,
        anger: 0,
        fear: 0
      },
      character: 'happy'
    },
    {
      id: '2',
      date: '2024-01-14',
      content: '약을 깜빡했는데 아들이 걱정해주셨어요.',
      emotions: {
        happiness: 30,
        love: 60,
        surprise: 40,
        sadness: 20,
        anger: 10,
        fear: 15
      },
      character: 'grateful'
    }
  ]);

  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(diaryEntries[0]);

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happiness: 'bg-green-500',
      love: 'bg-pink-500',
      surprise: 'bg-yellow-500',
      sadness: 'bg-blue-500',
      anger: 'bg-red-500',
      fear: 'bg-lime-500'
    };
    return colors[emotion] || 'bg-gray-500';
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: { [key: string]: string } = {
      happiness: '행복',
      love: '사랑',
      surprise: '놀라움',
      sadness: '슬픔',
      anger: '화남',
      fear: '두려움'
    };
    return labels[emotion] || emotion;
  };

  const getCharacterEmoji = (character: string) => {
    const characters: { [key: string]: string } = {
      happy: '😊',
      grateful: '🥰',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      scared: '😨'
    };
    return characters[character] || '😊';
  };

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">어르신의 일기</h2>
        <p className="text-gray-600 text-sm">어르신이 작성한 일기의 감정을 분석해드려요</p>
      </div>

      {/* 일기 목록 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">최근 일기</h3>
        <div className="space-y-3">
          {diaryEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={`w-full p-4 rounded-2xl shadow-lg border transition-all ${
                selectedEntry?.id === entry.id 
                  ? 'bg-white border-green-200 ring-2 ring-green-100' 
                  : 'bg-white border-gray-100 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCharacterEmoji(entry.character)}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{entry.date}</p>
                    <p className="text-sm text-gray-600 truncate max-w-48">{entry.content}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">감정 분석</div>
                  <div className="text-xs text-gray-400">자세히 보기</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 일기 상세 */}
      {selectedEntry && (
        <div className="space-y-6">
          {/* 일기 내용 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{getCharacterEmoji(selectedEntry.character)}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedEntry.date}</h3>
                <p className="text-sm text-gray-600">어르신의 기분</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">{selectedEntry.content}</p>
            </div>
          </div>

          {/* 감정 분석 결과 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">오늘의 감정분석</h3>
            <div className="space-y-4">
              {Object.entries(selectedEntry.emotions).map(([emotion, value]) => (
                <div key={emotion} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-700">
                    {getEmotionLabel(emotion)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div
                      className={`h-3 rounded-full ${getEmotionColor(emotion)} transition-all duration-500`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-bold text-gray-600 text-right">
                    {value}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 캐릭터 표시 영역 (추후 구현) */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">감정 캐릭터</h3>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{getCharacterEmoji(selectedEntry.character)}</div>
              <p className="text-gray-600">캐릭터 이미지가 여기에 표시됩니다</p>
              <p className="text-sm text-gray-400 mt-2">(캐릭터 이미지는 추후 추가 예정)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryScreen;
