import React from 'react';
import { useApiStatus } from '../contexts/ApiStatusContext';

const ApiStatusDashboard: React.FC = () => {
  const { endpoints, checkAllEndpoints, isLoading } = useApiStatus();

  const getStatusIcon = (isConnected: boolean | null) => {
    if (isConnected === null) {
      return (
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
      );
    }
    if (isConnected) {
      return (
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      );
    }
    return (
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
    );
  };

  const getStatusText = (isConnected: boolean | null) => {
    if (isConnected === null) return '확인 중...';
    if (isConnected) return '연결됨';
    return '연결 실패';
  };

  const getStatusColor = (isConnected: boolean | null) => {
    if (isConnected === null) return 'text-gray-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  const endpointNames: Record<string, string> = {
    memories: '메모리 API',
    medications: '약물 관리 API',
    users: '사용자 정보 API',
    connection: '연결 상태 API',
    families: '가족 관리 API'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">API 연결 상태</h3>
        <button
          onClick={checkAllEndpoints}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? '확인 중...' : '새로고침'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(endpoints).map(([key, endpoint]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(endpoint.isConnected)}
              <div>
                <p className="font-medium text-gray-800">
                  {endpointNames[key] || key}
                </p>
                <p className="text-xs text-gray-500">
                  {endpoint.endpoint}
                </p>
                {endpoint.error && (
                  <p className="text-xs text-red-500 mt-1">
                    오류: {endpoint.error}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${getStatusColor(endpoint.isConnected)}`}>
                {getStatusText(endpoint.isConnected)}
              </p>
              {endpoint.lastChecked && (
                <p className="text-xs text-gray-400">
                  {endpoint.lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">API 연결 안내</p>
            <p className="text-xs text-blue-600 mt-1">
              연결되지 않은 API는 더미 데이터를 사용합니다. 
              백엔드 개발자에게 CORS 설정을 요청하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusDashboard;
