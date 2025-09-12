import React, { useState } from 'react';

interface ElderlyDiaryScreenProps {
  // Props can be added later if needed
}

const ElderlyDiaryScreen: React.FC<ElderlyDiaryScreenProps> = () => {
  const [diaryContent, setDiaryContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const handleSave = () => {
    if (diaryContent.trim()) {
      // 실제로는 API에 저장
      console.log('일기 저장:', diaryContent);
      alert('일기가 저장되었습니다!');
      setDiaryContent('');
      setIsWriting(false);
    }
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleCancel = () => {
    setIsWriting(false);
    setDiaryContent('');
  };

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">오늘의 일기</h2>
        <p className="text-gray-600 text-sm">오늘 하루는 어떠셨나요? 마음을 담아 써보세요</p>
      </div>

      {!isWriting ? (
        /* 일기 작성 시작 화면 */
        <div className="space-y-6">
          {/* 오늘의 기분 카드 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
            <div className="text-6xl mb-4">😊</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">오늘의 기분은...</h3>
            <p className="text-gray-600 text-sm mb-4">어떤 하루를 보내셨나요?</p>
            <button
              onClick={handleStartWriting}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              일기 쓰기
            </button>
          </div>

          {/* 최근 일기 목록 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">최근 일기</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <div>
                    <p className="font-medium text-gray-800">2024-01-15</p>
                    <p className="text-sm text-gray-600">오늘은 손자와 함께 산책을 했어요...</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥰</span>
                  <div>
                    <p className="font-medium text-gray-800">2024-01-14</p>
                    <p className="text-sm text-gray-600">약을 깜빡했는데 아들이 걱정해주셨어요...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 일기 작성 화면 */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">일기 작성</h3>
            <textarea
              value={diaryContent}
              onChange={(e) => setDiaryContent(e.target.value)}
              placeholder="오늘 하루는 어떠셨나요? 자유롭게 써보세요..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {diaryContent.length}자 작성됨
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!diaryContent.trim()}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    diaryContent.trim()
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>

          {/* 작성 팁 */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 작성 팁</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 오늘 있었던 일들을 자유롭게 써보세요</li>
              <li>• 기분이나 감정도 함께 표현해보세요</li>
              <li>• 짧게라도 괜찮으니 매일 써보세요</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElderlyDiaryScreen;
