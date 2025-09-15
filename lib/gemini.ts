import { GoogleGenAI } from "@google/genai";
import { Person, EmotionType, EmotionScores } from './api-types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
};

export const identifyPerson = async (
    targetImageBase64: string,
    knownPeople: Person[]
): Promise<string> => {
    const model = 'gemini-2.5-flash';

    if (!ai) {
        return "API 키가 설정되지 않았습니다.";
    }

    try {
        const parts: any[] = [
            { text: "당신은 노인들이 사람을 알아보는 것을 돕는 조수입니다. 제가 아는 사람들의 목록과 사진을 제공하겠습니다. 그리고 새로운 사진을 보여드릴 것입니다. 새로운 사진 속의 사람이 제가 아는 사람 목록에 있는지 알려주세요. 만약 목록에 있다면, 그 사람의 이름을 말해주세요. 목록에 없다면 '모르는 사람'이라고 말해주세요. 사진에 사람이 없다면 '사람 없음'이라고 말해주세요. 한 사람만 식별하고, 사람의 이름, '모르는 사람', 또는 '사람 없음'으로만 대답해주세요.\n\n제가 아는 사람들:\n" }
        ];

        if (knownPeople.length === 0) {
            parts.push({ text: "아직 아는 사람이 없습니다.\n" });
        } else {
            for (const person of knownPeople) {
                parts.push(fileToGenerativePart(person.photo, "image/jpeg"));
                parts.push({ text: `이 사람은 ${person.name}, 저의 ${person.relationship}입니다.\n` });
            }
        }
        
        parts.push({ text: "\n자, 이 새로운 사진 속 인물은 누구인가요?\n" });
        parts.push(fileToGenerativePart(targetImageBase64, "image/jpeg"));

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts },
        });

        const text = response.text;
        
        // Add a check to handle undefined or non-string responses gracefully.
        if (typeof text !== 'string') {
            console.error("Invalid or empty response from Gemini API:", response);
            return "AI로부터 유효한 답변을 받지 못했습니다.";
        }

        return text.trim();
    } catch (error) {
        console.error("Error identifying person:", error);
        return "사람을 인식하는 동안 오류가 발생했습니다.";
    }
};

export const detectFace = async (targetImageBase64: string): Promise<boolean> => {
    const model = 'gemini-2.5-flash';

    if (!ai) {
        console.error("API 키가 설정되지 않았습니다.");
        return false;
    }

    try {
        const parts = [
            { text: "Does this image contain a human face? Answer with only 'Yes' or 'No'." },
            fileToGenerativePart(targetImageBase64, "image/jpeg"),
        ];

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts },
        });
        
        const text = response.text;
        
        // Add a check to handle undefined or non-string responses gracefully.
        if (typeof text !== 'string') {
            console.error("Invalid or empty response from Gemini API (detectFace):", response);
            return false;
        }

        return text.trim().toLowerCase() === 'yes';
    } catch (error) {
        console.error("Error detecting face:", error);
        return false;
    }
};

// EmotionScores는 api-types.ts에서 import

export const analyzeEmotion = async (diaryText: string): Promise<EmotionType> => {
    const model = 'gemini-2.5-flash';

    if (!ai) {
        console.error("API 키가 설정되지 않았습니다.");
        return 'joy'; // 기본값
    }

    try {
        const prompt = `다음 일기 내용을 분석하여 감정을 분류해주세요. 
다음 6가지 감정 중 하나로만 답변해주세요: joy, happiness, surprise, sadness, anger, fear

일기 내용: "${diaryText}"

감정 분석 기준:
- joy (기뻐요): 즐거운 일, 성취감, 만족감
- happiness (행복함): 평온함, 만족, 안정감
- surprise (놀라움): 예상치 못한 일, 깜짝 놀란 일
- sadness (슬퍼요): 우울함, 아쉬움, 그리움
- anger (화나요): 화남, 짜증, 분노
- fear (두려워요): 걱정, 불안, 두려움

답변은 반드시 다음 중 하나의 단어로만 해주세요: joy, happiness, surprise, sadness, anger, fear`;

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
        });

        const text = response.text?.trim() || '';
        
        if (typeof text !== 'string') {
            console.error("Invalid or empty response from Gemini API (analyzeEmotion):", response);
            return 'joy';
        }

        // 응답에서 감정 타입 추출
        const emotions: EmotionType[] = ['joy', 'happiness', 'surprise', 'sadness', 'anger', 'fear'];
        const detectedEmotion = emotions.find(emotion => text.includes(emotion));
        
        return detectedEmotion || 'joy';
    } catch (error) {
        console.error("Error analyzing emotion:", error);
        return 'joy'; // 기본값
    }
};

export const analyzeEmotionScores = async (diaryText: string): Promise<{scores: EmotionScores, dominantEmotion: EmotionType}> => {
    const model = 'gemini-2.5-flash';

    if (!ai) {
        console.error("API 키가 설정되지 않았습니다.");
        return { 
            scores: { joy: 50, happiness: 30, surprise: 10, sadness: 5, anger: 3, fear: 2 }, 
            dominantEmotion: 'joy' 
        };
    }

    try {
        const prompt = `다음 일기 내용을 분석하여 6가지 감정의 강도를 0-100점으로 평가해주세요.

일기 내용: "${diaryText}"

감정 분석 기준:
- joy (기뻐요): 즐거운 일, 성취감, 만족감
- happiness (행복함): 평온함, 만족, 안정감  
- surprise (놀라움): 예상치 못한 일, 깜짝 놀란 일
- sadness (슬퍼요): 우울함, 아쉬움, 그리움
- anger (화나요): 화남, 짜증, 분노
- fear (두려워요): 걱정, 불안, 두려움

중요: 반드시 다음 JSON 형식으로만 답변해주세요. 다른 텍스트는 포함하지 마세요.

{
  "joy": 0,
  "happiness": 0,
  "surprise": 0,
  "sadness": 0,
  "anger": 0,
  "fear": 0
}

각 감정의 점수는 0-100 사이의 정수여야 합니다.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
        }).catch((error) => {
            console.error('Gemini API 호출 실패:', error);
            throw new Error(`API 호출 실패: ${error.message}`);
        });

        const text = response.text?.trim() || '';
        
        console.log("🔍 Gemini API Raw Response:", text);
        
        if (typeof text !== 'string') {
            console.error("Invalid or empty response from Gemini API (analyzeEmotionScores):", response);
            return { 
                scores: { joy: 50, happiness: 30, surprise: 10, sadness: 5, anger: 3, fear: 2 }, 
                dominantEmotion: 'joy' 
            };
        }

        try {
            // JSON 파싱 시도 (여러 줄이나 추가 텍스트가 있을 수 있으므로 JSON 부분만 추출)
            let jsonText = text;
            
            // JSON 부분만 추출 (```json ... ``` 또는 { ... } 형태)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }
            
            console.log("🔍 Extracted JSON:", jsonText);
            
            const emotionData = JSON.parse(jsonText);
            console.log("✅ Parsed emotion data:", emotionData);
            
            // 유효성 검사
            const validEmotions = ['joy', 'happiness', 'surprise', 'sadness', 'anger', 'fear'];
            const scores: EmotionScores = { joy: 0, happiness: 0, surprise: 0, sadness: 0, anger: 0, fear: 0 };
            
            validEmotions.forEach(emotion => {
                const value = emotionData[emotion];
                if (typeof value === 'number' && value >= 0 && value <= 100) {
                    scores[emotion as keyof EmotionScores] = Math.round(value);
                } else {
                    console.warn(`⚠️ Invalid value for ${emotion}:`, value);
                }
            });
            
            console.log("📊 Raw scores before normalization:", scores);
            
            // 점수 정규화 (합계가 100이 되도록) - 하지만 원래 점수가 0이면 정규화하지 않음
            const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
            console.log("📊 Total score:", totalScore);
            
            // 모든 점수가 0이 아니고, 합계가 0보다 클 때만 정규화
            if (totalScore > 0 && totalScore !== 100) {
                console.log("📊 Normalizing scores...");
                validEmotions.forEach(emotion => {
                    const originalScore = scores[emotion as keyof EmotionScores];
                    const normalizedScore = Math.round((originalScore / totalScore) * 100);
                    scores[emotion as keyof EmotionScores] = normalizedScore;
                    console.log(`📊 ${emotion}: ${originalScore} -> ${normalizedScore}`);
                });
            } else if (totalScore === 0) {
                console.log("📊 All scores are 0, using default distribution");
                // 모든 점수가 0이면 기본 분포 사용
                scores.joy = 50;
                scores.happiness = 30;
                scores.surprise = 10;
                scores.sadness = 5;
                scores.anger = 3;
                scores.fear = 2;
            }
            
            console.log("📊 Final normalized scores:", scores);
            
            // 가장 높은 점수의 감정 찾기
            const dominantEmotion = validEmotions.reduce((prev, current) => 
                scores[current as keyof EmotionScores] > scores[prev as keyof EmotionScores] ? current : prev
            ) as EmotionType;
            
            console.log("🎯 Dominant emotion calculated:", dominantEmotion);
            
            return { scores, dominantEmotion };
        } catch (parseError) {
            console.error("Error parsing emotion scores JSON:", parseError);
            return { 
                scores: { joy: 50, happiness: 30, surprise: 10, sadness: 5, anger: 3, fear: 2 }, 
                dominantEmotion: 'joy' 
            };
        }
    } catch (error) {
        console.error("Error analyzing emotion scores:", error);
        return { 
            scores: { joy: 50, happiness: 30, surprise: 10, sadness: 5, anger: 3, fear: 2 }, 
            dominantEmotion: 'joy' 
        };
    }
};