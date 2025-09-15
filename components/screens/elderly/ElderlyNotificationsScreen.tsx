import React, { useState } from 'react';
import BellIcon from '../../icons/BellIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import ClockIcon from '../../icons/ClockIcon';
import PillIcon from '../../icons/PillIcon';
import TrashIcon from '../../icons/TrashIcon';
import { useMedication } from '../../../contexts/MedicationContext';

interface ElderlyNotificationsScreenProps {
  onBack?: () => void;
}

interface NotificationItemProps {
    medication: {
        medicationId: number;
        pillName: string;
        notificationTime: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        taken: boolean;
    };
    onMarkAsTaken: (id: number) => void;
    onDelete: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ medication, onMarkAsTaken, onDelete }) => {
    const { medicationId, pillName, notificationTime, taken } = medication;
    
    const timeString = `${notificationTime.hour.toString().padStart(2, '0')}:${notificationTime.minute.toString().padStart(2, '0')}`;
    const isCompleted = taken;
    
    const bgColor = isCompleted ? 'bg-lime-50' : 'bg-blue-50';
    const borderColor = isCompleted ? 'border-lime-200' : 'border-blue-200';
    const icon = isCompleted 
        ? <CheckCircleIcon className="w-7 h-7 text-green-500" /> 
        : <BellIcon className="w-7 h-7 text-blue-500" />;

    const statusText = isCompleted ? `${timeString} 복용 완료` : `${timeString} 예정`;

    return (
        <div className={`p-4 rounded-2xl border ${borderColor} ${bgColor} flex items-start gap-4`}>
            {icon}
            <div className="flex-grow">
                <p className="font-bold text-gray-800">{pillName}</p>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{statusText}</span>
                </div>
            </div>
            <div className="flex gap-2">
                {!isCompleted && (
                    <button
                        onClick={() => onMarkAsTaken(medicationId)}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                    >
                        복용 완료
                    </button>
                )}
                <button
                    onClick={() => onDelete(medicationId)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const ElderlyNotificationsScreen: React.FC<ElderlyNotificationsScreenProps> = ({ onBack }) => {
    const { medications, addMedication, markAsTaken, deleteMedication, isLoading } = useMedication();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMedication, setNewMedication] = useState({
        pillName: '',
        notificationTime: ''
    });

    const handleMarkAsTaken = async (id: number) => {
        try {
            await markAsTaken(id);
        } catch (error) {
            console.error('복용 완료 처리 실패:', error);
            alert('복용 완료 처리에 실패했습니다.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('이 약 복용 알림을 삭제하시겠습니까?')) {
            try {
                await deleteMedication(id);
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const handleAddMedication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMedication.pillName || !newMedication.notificationTime) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            await addMedication({
                pillName: newMedication.pillName,
                notificationTime: newMedication.notificationTime
            });
            setNewMedication({ pillName: '', notificationTime: '' });
            setShowAddModal(false);
        } catch (error) {
            console.error('약 복용 알림 추가 실패:', error);
            alert('약 복용 알림 추가에 실패했습니다.');
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <PillIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">약 복용 알림</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-[#70c18c] text-white rounded-lg hover:bg-[#5da576] transition-colors"
                        >
                            추가
                        </button>
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                뒤로가기
                            </button>
                        )}
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#70c18c] mx-auto"></div>
                        <p className="text-gray-500 mt-2">로딩 중...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {medications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <PillIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>등록된 약 복용 알림이 없습니다.</p>
                            </div>
                        ) : (
                            medications.map((medication) => (
                                <NotificationItem
                                    key={medication.medicationId}
                                    medication={medication}
                                    onMarkAsTaken={handleMarkAsTaken}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 약 복용 알림 추가 모달 */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">약 복용 알림 추가</h3>
                        <form onSubmit={handleAddMedication} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    약 이름
                                </label>
                                <input
                                    type="text"
                                    value={newMedication.pillName}
                                    onChange={(e) => setNewMedication(prev => ({ ...prev, pillName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c]"
                                    placeholder="예: 혈압약"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    복용 시간
                                </label>
                                <input
                                    type="time"
                                    value={newMedication.notificationTime}
                                    onChange={(e) => setNewMedication(prev => ({ ...prev, notificationTime: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70c18c]"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#70c18c] text-white rounded-lg hover:bg-[#5da576] transition-colors"
                                >
                                    추가
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElderlyNotificationsScreen;
