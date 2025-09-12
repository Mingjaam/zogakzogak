import React, { useState } from 'react';
import { useSharedData } from '../contexts/SharedDataContext';
import { useAuth } from '../contexts/AuthContext';
import PillIcon from './icons/PillIcon';
import ClockIcon from './icons/ClockIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const MedicationManagementScreen: React.FC = () => {
  const { sharedMedications, addMedication, updateMedication, takeMedication } = useSharedData();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    time: ''
  });

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.time) {
      addMedication({
        userId: user?.id || '',
        userName: user?.name || '',
        name: newMedication.name,
        dosage: newMedication.dosage,
        time: newMedication.time,
        isTaken: false
      });
      
      setNewMedication({ name: '', dosage: '', time: '' });
      setShowAddForm(false);
    }
  };

  const handleTakeMedication = (id: string) => {
    takeMedication(id);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour % 12 || 12;
    return `${ampm} ${displayHour}:${minutes}`;
  };

  const getNextMedication = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    return sharedMedications
      .filter(med => !med.isTaken && med.time > currentTime)
      .sort((a, b) => a.time.localeCompare(b.time))[0];
  };

  const nextMedication = getNextMedication();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <PillIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">약물 관리</h1>
              <p className="text-sm text-gray-600">복용 시간을 관리하세요</p>
            </div>
          </div>

          {/* 다음 약물 알림 */}
          {nextMedication && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">다음 복용 시간</span>
              </div>
              <p className="text-blue-700 font-medium">{nextMedication.name}</p>
              <p className="text-sm text-blue-600">{formatTime(nextMedication.time)}</p>
            </div>
          )}
        </div>

        {/* 약물 목록 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">약물 목록</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#70c18c] text-white rounded-lg hover:bg-[#5da576] transition-colors text-sm"
            >
              + 추가
            </button>
          </div>

          <div className="space-y-3">
            {sharedMedications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <PillIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>등록된 약물이 없습니다</p>
              </div>
            ) : (
              sharedMedications.map((medication) => (
                <div
                  key={medication.id}
                  className={`border rounded-lg p-4 ${
                    medication.isTaken 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{medication.name}</h3>
                        {medication.isTaken && (
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{medication.dosage}</p>
                      <p className="text-sm text-gray-500">{formatTime(medication.time)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {medication.userName}이 추가
                      </p>
                    </div>
                    {!medication.isTaken && (
                      <button
                        onClick={() => handleTakeMedication(medication.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        복용
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 약물 추가 폼 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">새 약물 추가</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    약물 이름
                  </label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
                    placeholder="예: 혈압약"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    복용량
                  </label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
                    placeholder="예: 1정"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    복용 시간
                  </label>
                  <input
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddMedication}
                  className="flex-1 py-3 px-4 text-white bg-[#70c18c] rounded-lg hover:bg-[#5da576] transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationManagementScreen;
