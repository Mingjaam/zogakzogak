import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSharedData } from '../contexts/SharedDataContext';
import ConnectionRequestModal from './modals/ConnectionRequestModal';

interface ConnectionScreenProps {
  onConnectionUpdate?: () => void;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onConnectionUpdate }) => {
  const { user } = useAuth();
  const { isConnected, connectedUser, connectWithUser } = useSharedData();
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  useEffect(() => {
    // 연결 상태 확인 완료
    setIsLoading(false);
  }, [isConnected]);

  const handleConnectionSuccess = () => {
    onConnectionUpdate?.(); // 부모 컴포넌트에 연결 상태 업데이트 알림
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70c18c] mx-auto mb-4"></div>
          <p className="text-gray-600">연결 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {user?.role === 'SENIOR' ? '보호자 연결' : '어르신 연결'}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            {user?.role === 'SENIOR' 
              ? '보호자와 연결하여 안전한 추억 기록을 시작하세요.'
              : '어르신과 연결하여 일상을 함께 관리하세요.'
            }
          </p>

          {isConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold text-green-800">연결됨</span>
              </div>
              <p className="text-green-700 text-sm mb-4">
                {connectedUser?.name}님과 연결되어 있습니다.
              </p>
              <p className="text-green-600 text-xs mb-4">
                이제 서로의 정보를 공유할 수 있습니다.
              </p>
              <button
                onClick={() => onConnectionUpdate?.()}
                className="w-full py-3 px-4 bg-[#70c18c] text-white rounded-lg hover:bg-[#5da576] transition-colors"
              >
                메인으로 이동
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-semibold text-yellow-800">연결되지 않음</span>
              </div>
              <p className="text-yellow-700 text-sm mb-4">
                아직 연결된 {user?.role === 'SENIOR' ? '보호자' : '어르신'}가 없습니다.
              </p>
              <button
                onClick={() => setShowConnectionModal(true)}
                className="w-full py-3 px-4 bg-[#70c18c] text-white rounded-lg hover:bg-[#5da576] transition-colors"
              >
                연결 요청 보내기
              </button>
            </div>
          )}
        </div>

      </div>

      <ConnectionRequestModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onSuccess={handleConnectionSuccess}
      />
    </div>
  );
};

export default ConnectionScreen;
