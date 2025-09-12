import React, { useState, useEffect } from 'react';
import BellIcon from '../icons/BellIcon';
import { useSharedData } from '../../contexts/SharedDataContext';
import { useAuth } from '../../contexts/AuthContext';

interface MedicationReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MedicationReminderModal: React.FC<MedicationReminderModalProps> = ({ isOpen, onClose }) => {
    const { sharedMedications, takeMedication } = useSharedData();
    const { user } = useAuth();
    const [currentMedication, setCurrentMedication] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            // 현재 시간에 맞는 약물 찾기
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5); // HH:MM 형식
            
            const medication = sharedMedications.find(med => 
                med.time === currentTime && !med.isTaken
            );
            
            setCurrentMedication(medication);
        }
    }, [isOpen, sharedMedications]);

    const handleTakeMedication = () => {
        if (currentMedication) {
            takeMedication(currentMedication.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-3xl shadow-xl w-11/12 max-w-sm p-8 text-center flex flex-col items-center"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <BellIcon className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">약 드실 시간입니다.</h2>
                {currentMedication ? (
                    <>
                        <p className="text-lg text-gray-600 mb-2">{currentMedication.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{currentMedication.dosage}</p>
                        <p className="text-sm text-gray-500 mb-6">{currentMedication.time}</p>
                        <button 
                            onClick={handleTakeMedication}
                            className="w-full py-3 text-lg font-bold text-white bg-[#28a745] rounded-full hover:bg-[#218838] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28a745] transition-all"
                        >
                            복용 완료
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-lg text-gray-600 mb-2">복용할 약이 없습니다</p>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 text-lg font-bold text-white bg-gray-400 rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
                        >
                            확인
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MedicationReminderModal;
