// API 사용 예시 파일 (실제 Swagger 스펙에 맞춤)
import api from './api-services';
import { EmotionType, EmotionScores } from './api-types';

// ==================== 사용 예시 ====================

// 1. 사용자 인증
export const authExamples = {
  // 회원가입
  async register() {
    try {
      const result = await api.auth.register({
        name: '김평화',
        email: 'test@example.com',
        password: 'password123',
        number: '010-1234-5678',
        role: 'SENIOR'
      });
      console.log('회원가입 성공:', result);
      return result;
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  },

  // 로그인
  async login() {
    try {
      const result = await api.auth.login({
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('로그인 성공:', result);
      // 토큰을 localStorage에 저장
      localStorage.setItem('authToken', result);
      return result;
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  }
};

// 2. 어르신 관리
export const seniorExamples = {
  // 어르신 목록 조회
  async getSeniors() {
    try {
      const result = await api.senior.getSeniors();
      console.log('어르신 목록:', result);
      return result;
    } catch (error) {
      console.error('어르신 목록 조회 실패:', error);
    }
  },

  // 어르신 등록
  async createSenior() {
    try {
      const result = await api.senior.createSenior({
        name: '이영희'
      });
      console.log('어르신 등록 성공:', result);
      return result;
    } catch (error) {
      console.error('어르신 등록 실패:', error);
    }
  },

  // 안심구역 설정
  async setSafeZone(seniorId: number) {
    try {
      const result = await api.senior.updateSafeZone(seniorId, {
        latitude: 37.5665,
        longitude: 126.9780,
        radius: 500 // 500미터
      });
      console.log('안심구역 설정 성공:', result);
      return result;
    } catch (error) {
      console.error('안심구역 설정 실패:', error);
    }
  }
};

// 3. 인물 관리
export const personExamples = {
  // 인물 목록 조회
  async getPeople() {
    try {
      const result = await api.person.getPeople();
      console.log('인물 목록:', result);
      return result;
    } catch (error) {
      console.error('인물 목록 조회 실패:', error);
    }
  },

  // 인물 등록 (multipart/form-data)
  async createPerson(vectorId: string, profileImageFile: File) {
    try {
      const result = await api.person.createPerson({
        vectorId: vectorId,
        name: '김아들',
        relationship: '아들'
      }, profileImageFile);
      console.log('인물 등록 성공:', result);
      return result;
    } catch (error) {
      console.error('인물 등록 실패:', error);
    }
  },

  // 인물 정보 수정
  async updatePerson(personId: number) {
    try {
      const result = await api.person.updatePerson(personId, {
        name: '김아들 (수정)',
        relationship: '장남'
      });
      console.log('인물 정보 수정 성공:', result);
      return result;
    } catch (error) {
      console.error('인물 정보 수정 실패:', error);
    }
  },

  // Vector ID로 인물 조회
  async getPersonByVector(vectorId: string) {
    try {
      const result = await api.person.getPersonByVector(vectorId);
      console.log('Vector ID로 인물 조회 성공:', result);
      return result;
    } catch (error) {
      console.error('Vector ID로 인물 조회 실패:', error);
    }
  }
};

// 4. 추억 관리
export const memoryExamples = {
  // 추억 목록 조회
  async getMemories(seniorId: number) {
    try {
      const result = await api.memory.getMemories(seniorId);
      console.log('추억 목록:', result);
      return result;
    } catch (error) {
      console.error('추억 목록 조회 실패:', error);
    }
  },

  // 추억 생성 (multipart/form-data)
  async createMemory(seniorId: number, photoFile: File) {
    try {
      const result = await api.memory.createMemory(seniorId, {
        title: '가족과의 즐거운 시간',
        description: '오늘 가족들과 함께 맛있는 식사를 했습니다.',
        memoryDate: '2024-05-10',
        latitude: 37.5665,
        longitude: 126.9780
      }, photoFile);
      console.log('추억 생성 성공:', result);
      return result;
    } catch (error) {
      console.error('추억 생성 실패:', error);
    }
  }
};

// 5. 일기 관리
export const diaryExamples = {
  // 일기 목록 조회
  async getDiaries(seniorId: number) {
    try {
      const result = await api.diary.getDiaries(seniorId);
      console.log('일기 목록:', result);
      return result;
    } catch (error) {
      console.error('일기 목록 조회 실패:', error);
    }
  },

  // 일기 생성 (감정 점수 포함)
  async createDiary(seniorId: number) {
    try {
      const result = await api.diary.createDiary({
        seniorId: seniorId,
        content: '오늘은 날씨가 좋아서 산책을 했습니다.',
        date: '2024-05-10',
        sadness: 10,
        anger: 5,
        fear: 0,
        joy: 60,
        happiness: 20,
        surprise: 5
      });
      console.log('일기 생성 성공:', result);
      return result;
    } catch (error) {
      console.error('일기 생성 실패:', error);
    }
  },

  // 일기 수정
  async updateDiary(diaryId: number) {
    try {
      const result = await api.diary.updateDiary(diaryId, {
        content: '수정된 일기 내용입니다.',
        joy: 70,
        happiness: 30
      });
      console.log('일기 수정 성공:', result);
      return result;
    } catch (error) {
      console.error('일기 수정 실패:', error);
    }
  }
};

// 6. 약 알림 관리
export const medicationExamples = {
  // 약 알림 목록 조회
  async getMedications() {
    try {
      const result = await api.medication.getMedications();
      console.log('약 알림 목록:', result);
      return result;
    } catch (error) {
      console.error('약 알림 목록 조회 실패:', error);
    }
  },

  // 약 알림 생성
  async createMedication() {
    try {
      const result = await api.medication.createMedication({
        pillName: '혈압약',
        notificationTime: '09:00'
      });
      console.log('약 알림 생성 성공:', result);
      return result;
    } catch (error) {
      console.error('약 알림 생성 실패:', error);
    }
  },

  // 약 복용 완료 처리
  async markAsTaken(medicationId: number) {
    try {
      const result = await api.medication.markAsTaken(medicationId);
      console.log('약 복용 완료 처리 성공:', result);
      return result;
    } catch (error) {
      console.error('약 복용 완료 처리 실패:', error);
    }
  }
};

// ==================== 헬퍼 함수 ====================

// Base64를 File로 변환하는 헬퍼 함수
export const base64ToFile = (base64: string, filename: string, mimeType: string = 'image/jpeg'): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// 감정 점수를 정규화하는 헬퍼 함수
export const normalizeEmotionScores = (scores: EmotionScores): EmotionScores => {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  if (total === 0) return scores;
  
  const normalized: EmotionScores = {} as EmotionScores;
  Object.keys(scores).forEach(key => {
    const emotionKey = key as keyof EmotionScores;
    normalized[emotionKey] = Math.round((scores[emotionKey] / total) * 100);
  });
  
  return normalized;
};