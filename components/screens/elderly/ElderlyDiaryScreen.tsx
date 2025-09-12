import React, { useState, useEffect } from 'react';
import { analyzeEmotionScores, EmotionType, EmotionScores } from '../../../lib/gemini';
import EmotionCharacter from '../../icons/EmotionCharacter';
import EmotionChart from '../../EmotionChart';
import { useDiary } from '../../../contexts/DiaryContext';

interface ElderlyDiaryScreenProps {
  // Props can be added later if needed
}

const ElderlyDiaryScreen: React.FC<ElderlyDiaryScreenProps> = () => {
  const { diaries, addDiary } = useDiary();
  const [diaryContent, setDiaryContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{emotion: EmotionType, scores: EmotionScores} | null>(null);
  
  // 어르신이 작성한 일기만 필터링 (최신순)
  const recentDiaries = diaries.filter(diary => diary.author === 'elderly').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // 오늘의 기분 계산 (가장 최근 일기의 가장 높은 점수 감정)
  const getTodayEmotion = (): EmotionType => {
    if (recentDiaries.length === 0) return 'joy';
    
    const todayDiary = recentDiaries[0]; // 가장 최근 일기
    const scores = todayDiary.emotionScores;
    
    // 가장 높은 점수의 감정 찾기
    const emotions: EmotionType[] = ['joy', 'happiness', 'surprise', 'sadness', 'anger', 'fear'];
    return emotions.reduce((prev, current) => 
      scores[current] > scores[prev] ? current : prev
    );
  };
  
  const todayEmotion = getTodayEmotion();

  const handleAnalyze = async () => {
    if (diaryContent.trim()) {
      setIsAnalyzing(true);
      try {
        console.log("🔍 Starting emotion analysis for:", diaryContent);
        
        // 감정 점수 분석 (이제 dominantEmotion도 함께 반환)
        const analysisResult = await analyzeEmotionScores(diaryContent);
        
        console.log("📊 Analysis result received:", analysisResult);
        console.log("🎯 Dominant emotion:", analysisResult.dominantEmotion);
        console.log("📊 Emotion scores:", analysisResult.scores);
        
        console.log("📊 Setting analysis result and showing analysis...");
        setAnalysisResult({ 
          emotion: analysisResult.dominantEmotion, 
          scores: analysisResult.scores 
        });
        setShowAnalysis(true);
        console.log("📊 Analysis result set, showAnalysis should be true now");
      } catch (error) {
        console.error('감정 분석 중 오류:', error);
        alert('감정 분석에 실패했습니다.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSave = () => {
    console.log("💾 handleSave called");
    console.log("💾 analysisResult:", analysisResult);
    console.log("💾 diaryContent:", diaryContent);
    
    if (analysisResult) {
      // 새 일기 항목 생성
      const newDiary = {
        date: new Date().toISOString().split('T')[0],
        content: diaryContent,
        emotion: analysisResult.emotion,
        emotionScores: analysisResult.scores,
        author: 'elderly' as const
      };
      
      console.log("💾 Saving diary with analysis result:", newDiary);
      console.log("💾 Emotion scores being saved:", analysisResult.scores);
      
      try {
        // 일기 목록에 추가
        addDiary(newDiary);
        console.log("✅ Diary saved successfully!");
        
        alert('일기가 저장되었습니다!');
        setDiaryContent('');
        setIsWriting(false);
        setShowAnalysis(false);
        setAnalysisResult(null);
      } catch (error) {
        console.error("❌ Error saving diary:", error);
        alert('일기 저장에 실패했습니다.');
      }
    } else {
      console.error("❌ Cannot save: analysisResult is null");
      alert('감정 분석을 먼저 완료해주세요.');
    }
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleCancel = () => {
    setIsWriting(false);
    setDiaryContent('');
    setShowAnalysis(false);
    setAnalysisResult(null);
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
            <div className="mb-4">
              <EmotionCharacter emotion={todayEmotion} size="xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">오늘의 기분은...</h3>
            {recentDiaries.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  📅 {recentDiaries[0].date} 일기 분석 결과
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full">
                  <div className="text-xs font-bold text-gray-700">
                    {recentDiaries[0].emotionScores[todayEmotion]}%의 {todayEmotion === 'joy' ? '기뻐요' : 
                     todayEmotion === 'happiness' ? '행복함' :
                     todayEmotion === 'surprise' ? '놀라움' :
                     todayEmotion === 'sadness' ? '슬퍼요' :
                     todayEmotion === 'anger' ? '화나요' : '두려워요'}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  ✨ 가장 높은 점수의 감정이 선택되었습니다
                </div>
              </div>
            )}
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">최근 일기</h3>
              <button className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
                일기 보기
              </button>
            </div>
            <div className="space-y-3">
              {recentDiaries.slice(0, 3).map((diary) => (
                <div key={diary.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <EmotionCharacter emotion={diary.emotion} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{diary.date}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{diary.content}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                {!showAnalysis ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={!diaryContent.trim() || isAnalyzing}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      diaryContent.trim() && !isAnalyzing
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAnalyzing ? '분석 중...' : '감정 분석하기'}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      저장하기
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      분석 완료: {analysisResult ? '✅' : '❌'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 감정 분석 결과 */}
          {showAnalysis && analysisResult && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Gemini AI 감정 분석 결과</h3>
              <div className="mb-4 text-center">
                <EmotionCharacter emotion={analysisResult.emotion} size="lg" />
                <p className="text-sm text-gray-600 mt-2">
                  AI가 분석한 결과입니다
                </p>
              </div>
              <EmotionChart scores={analysisResult.scores} />
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <p className="text-sm font-semibold text-green-800">
                    오늘의 기분이 결정되었습니다!
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  가장 높은 점수({analysisResult.scores[analysisResult.emotion]}%)의 감정이 오늘의 기분으로 설정됩니다.
                </p>
              </div>
            </div>
          )}

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
