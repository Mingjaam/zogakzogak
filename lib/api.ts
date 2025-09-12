// API 기본 설정 및 유틸리티 함수들

// 개발 환경에서는 직접 API 서버 사용 (프록시 문제로 인해)
const API_BASE_URL = 'http://54.180.125.150:8080/api';

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

// API 요청 래퍼 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
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
