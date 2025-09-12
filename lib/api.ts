// API 기본 설정 및 유틸리티 함수들

// HTTPS API 서버 사용
const API_BASE_URL = 'https://zogakzogak.ddns.net/api';

// CORS 프록시 URL (GitHub Pages용 - 임시 해결책)
// 주의: 이는 임시 해결책이며, 백엔드에서 CORS 설정이 권장됩니다.
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const PRODUCTION_API_URL = CORS_PROXY + encodeURIComponent(API_BASE_URL);

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 회원가입 요청 데이터 타입
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  number: string;
  role: 'SENIOR' | 'GUARDIAN';
}

// 로그인 요청 데이터 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  role: 'SENIOR' | 'GUARDIAN';
  createdAt: string;
}

// API 요청 헤더 생성
const createHeaders = (): HeadersInit => ({
  'accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': window.location.origin,
});

// 환경에 따른 API URL 결정
function getApiUrl(endpoint: string): string {
  const isProduction = window.location.hostname === 'mingjaam.github.io';
  const baseUrl = isProduction ? PRODUCTION_API_URL : API_BASE_URL;
  return `${baseUrl}${endpoint}`;
}

// API 요청 래퍼 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = getApiUrl(endpoint);
    console.log('API 요청:', url, options);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...createHeaders(),
        ...options.headers,
      },
    });

    console.log('API 응답 상태:', response.status, response.statusText);

    // 응답이 비어있는 경우 처리
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {
        success: response.ok,
        message: response.ok ? '요청이 성공적으로 처리되었습니다.' : '요청 처리 중 오류가 발생했습니다.',
      };
    }

    // JSON 파싱 시도
    let data;
    try {
      const text = await response.text();
      console.log('API 응답 텍스트:', text);
      
      if (text.trim()) {
        data = JSON.parse(text);
      } else {
        data = {};
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return {
        success: false,
        error: '서버 응답을 파싱할 수 없습니다.',
        message: '서버에서 예상치 못한 응답을 받았습니다.',
      };
    }

    if (!response.ok) {
      console.error('API 오류 응답:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        message: data.message || data.error || '요청 처리 중 오류가 발생했습니다.',
      };
    }

    return {
      success: true,
      data,
      message: data.message || '요청이 성공적으로 처리되었습니다.',
    };
  } catch (error) {
    console.error('API 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

// 회원가입 API
export async function registerUser(userData: RegisterRequest): Promise<ApiResponse<User>> {
  return apiRequest<User>('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// 로그인 API 응답 타입
interface LoginResponse {
  accessToken: string;
  refreshToken: string | null;
}

// 로그인 API
export async function loginUser(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// 사용자 정보 조회 API
export async function getUserInfo(token: string): Promise<ApiResponse<User>> {
  return apiRequest<User>('/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// 연결 상태 확인 API
export async function checkConnectionStatus(token: string): Promise<ApiResponse<{ isConnected: boolean; connectedUser?: User }>> {
  return apiRequest<{ isConnected: boolean; connectedUser?: User }>('/users/connection/status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// 이메일로 연결 요청 보내기 API
export async function sendConnectionRequest(token: string, email: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>('/users/connection/request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
}

// 연결 요청 수락 API
export async function acceptConnectionRequest(token: string, requestId: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>('/users/connection/accept', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });
}

// 연결 요청 목록 조회 API
export async function getConnectionRequests(token: string): Promise<ApiResponse<{ requests: ConnectionRequest[] }>> {
  return apiRequest<{ requests: ConnectionRequest[] }>('/users/connection/requests', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// 연결 요청 타입 정의
export interface ConnectionRequest {
  id: string;
  fromUser: User;
  toUser: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

// 공유 데이터 동기화 API
export async function syncSharedData(token: string): Promise<ApiResponse<{
  memories: any[];
  locations: any[];
  medications: any[];
  notifications: any[];
}>> {
  try {
    // 실제 API 엔드포인트들을 사용
    const [memoriesRes, medicationsRes] = await Promise.all([
      apiRequest<any[]>('/memories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
      apiRequest<any[]>('/medications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    ]);

    return {
      success: true,
      data: {
        memories: memoriesRes.success ? memoriesRes.data || [] : [],
        locations: [], // 위치 API는 아직 구현되지 않음
        medications: medicationsRes.success ? medicationsRes.data || [] : [],
        notifications: [] // 알림 API는 아직 구현되지 않음
      }
    };
  } catch (error) {
    console.error('데이터 동기화 오류:', error);
    return {
      success: false,
      error: '데이터 동기화 중 오류가 발생했습니다.'
    };
  }
}

// 공유 메모리 동기화 API
export async function syncSharedMemories(token: string, memories: any[]): Promise<ApiResponse<{ message: string }>> {
  try {
    // 실제 메모리 API 사용
    const response = await apiRequest<any>('/memories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(memories[0]), // 첫 번째 메모리만 전송
    });
    
    return {
      success: response.success,
      data: { message: '메모리가 동기화되었습니다.' }
    };
  } catch (error) {
    console.error('메모리 동기화 오류:', error);
    return {
      success: false,
      error: '메모리 동기화 중 오류가 발생했습니다.'
    };
  }
}

// 공유 위치 동기화 API
export async function syncSharedLocations(token: string, locations: any[]): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>('/users/shared-data/locations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ locations }),
  });
}

// 공유 약물 동기화 API
export async function syncSharedMedications(token: string, medications: any[]): Promise<ApiResponse<{ message: string }>> {
  try {
    // 실제 약물 API 사용
    const response = await apiRequest<any>('/medications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(medications[0]), // 첫 번째 약물만 전송
    });
    
    return {
      success: response.success,
      data: { message: '약물이 동기화되었습니다.' }
    };
  } catch (error) {
    console.error('약물 동기화 오류:', error);
    return {
      success: false,
      error: '약물 동기화 중 오류가 발생했습니다.'
    };
  }
}

// 토큰 저장/조회/삭제 유틸리티
export const tokenStorage = {
  set: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  get: () => {
    return localStorage.getItem('auth_token');
  },
  remove: () => {
    localStorage.removeItem('auth_token');
  },
};

// JWT 토큰에서 사용자 정보 추출
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 오류:', error);
    return null;
  }
}

// 사용자 정보 저장/조회/삭제 유틸리티
export const userStorage = {
  set: (user: User) => {
    localStorage.setItem('user_info', JSON.stringify(user));
  },
  get: (): User | null => {
    const userStr = localStorage.getItem('user_info');
    return userStr ? JSON.parse(userStr) : null;
  },
  remove: () => {
    localStorage.removeItem('user_info');
  },
};
