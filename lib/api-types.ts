// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  name: string;
  number: string;
  role: 'SENIOR' | 'GUARDIAN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  number: string;
  role: 'SENIOR' | 'GUARDIAN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// 어르신 관련 타입
export interface Senior {
  id: number;
  name: string;
}

export interface SafeZone {
  latitude: number;
  longitude: number;
  radius: number; // 미터 단위
}

export interface CreateSeniorRequest {
  name: string;
}

export interface UpdateSafeZoneRequest {
  latitude: number;
  longitude: number;
  radius: number;
}

// 인물 관련 타입
export interface Person {
  id: number;
  vectorId: string;
  name: string;
  relationship: string;
  profileImageUrl: string;
  createdAt: string;
}

export interface CreatePersonRequest {
  vectorId: string;
  name: string;
  relationship: string;
}

export interface UpdatePersonRequest {
  name: string;
  relationship: string;
}

// 추억 관련 타입
export interface Memory {
  memoryId: number;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  memoryDate: string;
  createdAt: string;
}

export interface CreateMemoryRequest {
  title: string;
  description: string;
  memoryDate: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateMemoryRequest {
  title?: string;
  description?: string;
  memoryDate?: string;
  latitude?: number;
  longitude?: number;
}

// 일기 관련 타입
export interface Diary {
  id: number;
  content: string;
  date: string;
  emotion: string;
  emotionScores: EmotionScores;
}

export interface EmotionScores {
  sadness: number;
  anger: number;
  fear: number;
  joy: number;
  happiness: number;
  surprise: number;
}

export interface CreateDiaryRequest {
  seniorId: number;
  content: string;
  date: string;
  sadness: number;
  anger: number;
  fear: number;
  joy: number;
  happiness: number;
  surprise: number;
}

export interface UpdateDiaryRequest {
  content?: string;
  sadness?: number;
  anger?: number;
  fear?: number;
  joy?: number;
  happiness?: number;
  surprise?: number;
}

// 약 알림 관련 타입
export interface Medication {
  medicationId: number;
  pillName: string;
  notificationTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  taken: boolean;
}

export interface CreateMedicationRequest {
  pillName: string;
  notificationTime: string; // "09:00" 형식
}

export interface UpdateMedicationRequest {
  pillName?: string;
  notificationTime?: string;
}

// API 응답 타입 (실제 API는 단순한 응답 구조)
export type ApiResponse<T> = T;

// 감정 타입 (기존 gemini.ts와 호환)
export type EmotionType = 'joy' | 'happiness' | 'surprise' | 'sadness' | 'anger' | 'fear';

// 프로필 관련 타입
export interface Profile {
  id: number;
  name: string;
  email: string;
  role: 'SENIOR' | 'GUARDIAN';
  number: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  number?: string;
  avatar?: string;
}
