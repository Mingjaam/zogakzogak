import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSharedData } from '../../contexts/SharedDataContext';

interface ConnectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const { connectWithUser } = useSharedData();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!email.trim()) {
        setErrorMessage('이메일을 입력해주세요.');
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      // 연결 시뮬레이션
      connectWithUser(email);
      
      setSuccessMessage('연결 요청이 전송되었습니다!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('연결 요청 오류:', error);
      setErrorMessage('연결 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {user?.role === 'SENIOR' ? '보호자 연결' : '어르신 연결'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {user?.role === 'SENIOR' 
              ? '보호자의 이메일 주소를 입력하여 연결을 요청하세요.'
              : '어르신의 이메일 주소를 입력하여 연결을 요청하세요.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
              required
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex-1 py-3 px-4 text-white bg-[#70c18c] rounded-lg hover:bg-[#5da576] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '전송 중...' : '연결 요청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionRequestModal;
