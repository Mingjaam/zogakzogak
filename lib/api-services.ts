import fetchApiClient from './fetch-client';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Senior,
  CreateSeniorRequest,
  UpdateSafeZoneRequest,
  Person,
  CreatePersonRequest,
  UpdatePersonRequest,
  Memory,
  CreateMemoryRequest,
  Diary,
  CreateDiaryRequest,
  UpdateDiaryRequest,
  Medication,
  CreateMedicationRequest,
  Profile,
  UpdateProfileRequest,
  ApiResponse
} from './api-types';

// ==================== 사용자 관련 API ====================

export const authApi = {
  // 사용자 등록
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await fetchApiClient.post('/api/users/register', data);
    return response.data;
  },

  // 사용자 로그인
  login: async (data: LoginRequest): Promise<any> => {
    const response = await fetchApiClient.post('/api/users/login', data);
    console.log('로그인 API 응답:', response);
    return response.data;
  },
};

// ==================== 어르신 관리 API ====================

export const seniorApi = {
  // 내 어르신 목록 조회
  getSeniors: async (): Promise<Senior[]> => {
    const response = await fetchApiClient.get('/api/seniors');
    return response.data;
  },

  // 어르신 프로필 등록
  createSenior: async (data: CreateSeniorRequest): Promise<string> => {
    const response = await fetchApiClient.post('/api/seniors', data);
    return response.data;
  },

  // 안심구역 설정/수정
  updateSafeZone: async (seniorId: number, data: UpdateSafeZoneRequest): Promise<string> => {
    const response = await fetchApiClient.put(`/api/seniors/${seniorId}/safe-zone`, data);
    return response.data;
  },
};

// ==================== 인물 관리 API ====================

export const personApi = {
  // 내가 등록한 모든 인물 조회
  getPeople: async (): Promise<Person[]> => {
    const response = await fetchApiClient.get('/api/people');
    return response.data;
  },

  // 새로운 인물 등록 (multipart/form-data)
  createPerson: async (data: CreatePersonRequest, profileImage: File): Promise<void> => {
    const formData = new FormData();
    formData.append('request', JSON.stringify(data));
    formData.append('profileImage', profileImage);
    
    const response = await fetchApiClient.post('/api/people', formData);
    return response.data;
  },

  // 인물 정보 수정
  updatePerson: async (personId: number, data: UpdatePersonRequest): Promise<Person> => {
    const response = await fetchApiClient.patch(`/api/people/${personId}`, data);
    return response.data;
  },

  // 인물 정보 삭제
  deletePerson: async (personId: number): Promise<void> => {
    const response = await fetchApiClient.delete(`/api/people/${personId}`);
    return response.data;
  },

  // Vector ID로 인물 조회
  getPersonByVectorId: async (vectorId: string): Promise<Person> => {
    const response = await fetchApiClient.get(`/api/people/vector/${vectorId}`);
    return response.data;
  },
};

// ==================== 추억 관리 API ====================

export const memoryApi = {
  // 특정 어르신의 추억 목록 조회
  getMemories: async (seniorId: number): Promise<Memory[]> => {
    const response = await fetchApiClient.get(`/api/seniors/${seniorId}/memories`);
    return response.data;
  },

  // 추억 생성 (multipart/form-data)
  createMemory: async (seniorId: number, data: CreateMemoryRequest, photo: File): Promise<Memory> => {
    const formData = new FormData();
    formData.append('request', JSON.stringify(data));
    formData.append('photo', photo);
    
    const response = await fetchApiClient.post(`/api/seniors/${seniorId}/memories`, formData);
    return response.data;
  },

  // 추억 삭제
  deleteMemory: async (memoryId: number): Promise<void> => {
    const response = await fetchApiClient.delete(`/api/memories/${memoryId}`);
    return response.data;
  },
};

// ==================== 일기 관리 API ====================

export const diaryApi = {
  // 특정 어르신의 일기 목록 조회
  getDiaries: async (seniorId: number): Promise<Diary[]> => {
    const response = await fetchApiClient.get(`/api/diaries/senior/${seniorId}`);
    return response.data;
  },

  // 일기 생성
  createDiary: async (data: CreateDiaryRequest): Promise<string> => {
    const response = await fetchApiClient.post('/api/diaries', data);
    return response.data;
  },

  // 일기 수정
  updateDiary: async (diaryId: number, data: UpdateDiaryRequest): Promise<string> => {
    const response = await fetchApiClient.patch(`/api/diaries/${diaryId}`, data);
    return response.data;
  },

  // 일기 삭제
  deleteDiary: async (diaryId: number): Promise<void> => {
    const response = await fetchApiClient.delete(`/api/diaries/${diaryId}`);
    return response.data;
  },
};

// ==================== 약 복용 알림 API ====================

export const medicationApi = {
  // 나의 약 알림 목록 조회
  getMedications: async (): Promise<Medication[]> => {
    const response = await fetchApiClient.get('/api/medications');
    return response.data;
  },

  // 약 알림 생성
  createMedication: async (data: CreateMedicationRequest): Promise<void> => {
    const response = await fetchApiClient.post('/api/medications', data);
    return response.data;
  },

  // 약 복용 완료 처리
  markAsTaken: async (medicationId: number): Promise<void> => {
    const response = await fetchApiClient.patch(`/api/medications/${medicationId}/take`);
    return response.data;
  },

  // 약 알림 삭제
  deleteMedication: async (medicationId: number): Promise<void> => {
    const response = await fetchApiClient.delete(`/api/medications/${medicationId}`);
    return response.data;
  },
};

// ==================== 프로필 관리 API ====================

export const profileApi = {
  // 프로필 조회
  getProfile: async (): Promise<Profile> => {
    const response = await fetchApiClient.get('/api/users/profile');
    return response.data;
  },

  // 프로필 수정
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await fetchApiClient.patch('/api/users/profile', data);
    return response.data;
  },
};

// ==================== 통합 API 객체 ====================

export const api = {
  auth: authApi,
  senior: seniorApi,
  person: personApi,
  memory: memoryApi,
  diary: diaryApi,
  medication: medicationApi,
  profile: profileApi,
};

export default api;