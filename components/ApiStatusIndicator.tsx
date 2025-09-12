import React, { useState, useEffect } from 'react';

interface ApiStatusIndicatorProps {
  endpoint: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showStatus?: boolean;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  endpoint,
  children,
  fallback,
  showStatus = true
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkApiStatus();
  }, [endpoint]);

  const checkApiStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://zogakzogak.ddns.net/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      });
      
      setIsConnected(response.ok);
    } catch (error) {
      console.log(`API ${endpoint} 연결 실패:`, error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        {children}
        {showStatus && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>연결 확인 중...</span>
          </div>
        )}
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="relative">
        {fallback || (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <div className="text-gray-500 mb-2">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">API 연결 불가</p>
            <p className="text-xs text-gray-500">서버 연결을 확인해주세요</p>
          </div>
        )}
        {showStatus && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>연결 실패</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      {showStatus && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>연결됨</span>
        </div>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
