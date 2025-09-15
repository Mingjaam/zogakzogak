// Fetch API 기반 HTTP 클라이언트

const API_BASE_URL = 'https://zogakzogak.ddns.net';

// 공통 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 요청 옵션 타입
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// 기본 헤더
const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 인증 토큰 추가
  const token = localStorage.getItem('authToken');
  if (token && token.trim()) {
    // 토큰이 ASCII 문자만 포함하는지 확인
    const cleanToken = token.trim();
    if (/^[\x00-\x7F]*$/.test(cleanToken)) {
      headers['Authorization'] = `Bearer ${cleanToken}`;
    } else {
      console.warn('토큰에 ASCII가 아닌 문자가 포함되어 있어 Authorization 헤더를 추가하지 않습니다:', cleanToken);
    }
  }

  return headers;
};

// 타임아웃을 위한 AbortController
const createTimeoutController = (timeout: number = 30000): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
};

// fetch 래퍼 함수
export const fetchApi = async <T = any>(
  endpoint: string,
  options: RequestOptions = { method: 'GET' }
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Fetch API 요청:', {
    url,
    method: options.method,
    headers: options.headers
  });

  try {
    const controller = createTimeoutController(options.timeout);
    
    // FormData인 경우 Content-Type을 설정하지 않음
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = getDefaultHeaders();
    const customHeaders = options.headers || {};
    
    // 모든 헤더 값을 안전하게 처리
    const safeHeaders: Record<string, string> = {};
    
    // 기본 헤더 처리
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      if (/^[\x00-\x7F]*$/.test(value)) {
        safeHeaders[key] = value;
      } else {
        console.warn(`헤더 ${key}에서 ASCII가 아닌 문자 발견, 제거됨:`, value);
      }
    });
    
    // 커스텀 헤더 처리
    Object.entries(customHeaders).forEach(([key, value]) => {
      if (/^[\x00-\x7F]*$/.test(value)) {
        safeHeaders[key] = value;
      } else {
        console.warn(`헤더 ${key}에서 ASCII가 아닌 문자 발견, 제거됨:`, value);
      }
    });
    
    // FormData인 경우 Content-Type 헤더 제거
    if (isFormData) {
      delete safeHeaders['Content-Type'];
    }

    const response = await fetch(url, {
      method: options.method,
      headers: safeHeaders,
      body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
      signal: controller.signal,
    });

    console.log('Fetch API 응답:', {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Fetch API 에러:', {
        url,
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // JSON이 아닌 경우 텍스트로 처리
      const text = await response.text();
      console.log('Fetch API 텍스트 응답:', text);
      
      // 성공 메시지인 경우 토큰으로 처리
      if (text.includes('성공') || text.includes('success') || text.includes('완료')) {
        data = text; // 토큰으로 사용
      } else {
        data = { message: text };
      }
    }
    
    console.log('Fetch API 데이터:', data);
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Fetch API 요청 실패:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    
    throw error;
  }
};

// 편의 메서드들
export const fetchApiClient = {
  get: <T = any>(endpoint: string, timeout?: number) => 
    fetchApi<T>(endpoint, { method: 'GET', timeout }),
    
  post: <T = any>(endpoint: string, data?: any, timeout?: number) => 
    fetchApi<T>(endpoint, { method: 'POST', body: data, timeout }),
    
  put: <T = any>(endpoint: string, data?: any, timeout?: number) => 
    fetchApi<T>(endpoint, { method: 'PUT', body: data, timeout }),
    
  patch: <T = any>(endpoint: string, data?: any, timeout?: number) => 
    fetchApi<T>(endpoint, { method: 'PATCH', body: data, timeout }),
    
  delete: <T = any>(endpoint: string, timeout?: number) => 
    fetchApi<T>(endpoint, { method: 'DELETE', timeout }),
};

export default fetchApiClient;
