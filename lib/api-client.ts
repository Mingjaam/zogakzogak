import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL = 'https://zogakzogak.ddns.net';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초로 증가
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// 요청 인터셉터 (인증 토큰 등 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가
    const token = localStorage.getItem('authToken');
    console.log('API 요청 - 저장된 토큰:', token);
    console.log('API 요청 - URL:', config.url);
    
    if (token && token.trim()) {
      // 토큰이 존재하고 비어있지 않은 경우에만 헤더에 추가
      const cleanToken = token.trim();
      console.log('API 요청 - 사용할 토큰:', cleanToken);
      
      // 헤더 값을 안전하게 설정
      if (config.headers) {
        config.headers.Authorization = `Bearer ${cleanToken}`;
        console.log('API 요청 - Authorization 헤더 설정됨');
      }
    } else {
      console.log('API 요청 - 토큰이 없어서 인증 헤더를 추가하지 않음');
    }
    
    // 모든 헤더 값을 안전하게 처리
    if (config.headers) {
      Object.keys(config.headers).forEach(key => {
        const value = config.headers[key];
        if (typeof value === 'string' && !/^[\x00-\x7F]*$/.test(value)) {
          // ASCII가 아닌 문자가 포함된 경우 제거
          console.warn(`헤더 ${key}에서 ASCII가 아닌 문자 발견, 제거됨:`, value);
          delete config.headers[key];
        }
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API 응답 성공:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('API Error 상세:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default apiClient;
