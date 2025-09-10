import React from 'react';
import PuzzleCameraIcon from '../../icons/PuzzleCameraIcon';
import PuzzleBookIcon from '../../icons/PuzzleBookIcon';
import PuzzlePillIcon from '../../icons/PuzzlePillIcon';
import HelpPhoneIcon from '../../icons/HelpPhoneIcon';

interface ElderlyHomeScreenProps {
    setShowModal: (show: boolean) => void;
    setActiveTab: (tab: 'home' | 'gallery' | 'map' | 'notifications' | 'profile') => void;
}

const ShortcutButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}> = ({ icon, label, onClick }) => (
    <div className="flex flex-col items-center gap-2">
        <button
            onClick={onClick}
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
        >
            {icon}
        </button>
        <span className="font-semibold text-gray-700">{label}</span>
    </div>
);

const SimplePillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.2929 2.29289C12.4645 1.12132 14.3396 1.12132 15.5112 2.29289L21.7071 8.48883C22.8787 9.66041 22.8787 11.5355 21.7071 12.7071L12.7071 21.7071C11.5355 22.8787 9.66041 22.8787 8.48883 21.7071L2.29289 15.5112C1.12132 14.3396 1.12132 12.4645 2.29289 11.2929L11.2929 2.29289Z" stroke="currentColor" strokeWidth="2.5" />
    </svg>
);


const ElderlyHomeScreen: React.FC<ElderlyHomeScreenProps> = ({ setShowModal, setActiveTab }) => {
    return (
        <div className="p-4 space-y-5">
            {/* Top Shortcut Buttons */}
            <div className="flex justify-around items-center px-4 py-2">
                <ShortcutButton
                    icon={<PuzzleCameraIcon className="w-11 h-11" />}
                    label="인물 찾기"
                    onClick={() => setActiveTab('gallery')}
                />
                <ShortcutButton
                    icon={<PuzzleBookIcon className="w-11 h-11" />}
                    label="추억 찾기"
                    onClick={() => setActiveTab('map')}
                />
                <ShortcutButton
                    icon={<PuzzlePillIcon className="w-11 h-11" />}
                    label="약 복용"
                    onClick={() => setActiveTab('notifications')}
                />
            </div>

            {/* Next Medication Card */}
            <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-5">
                <SimplePillIcon className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">다음 약 복용</h3>
                    <p className="text-gray-500 text-base">오후 1시 (30분 후)</p>
                </div>
            </div>

            {/* Today's Medication Card */}
            <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">오늘의 약</h3>
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-semibold text-gray-700">아침</span>
                        </div>
                        <span className="text-gray-600">혈압약, 비타민</span>
                        <span className="text-green-600 font-semibold">복용완료</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                            <span className="font-semibold text-gray-700">점심</span>
                        </div>
                        <span className="text-gray-600">혈압약</span>
                        <span className="w-16"></span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            <span className="font-semibold text-gray-700">저녁</span>
                        </div>
                        <span className="text-gray-600">당뇨약</span>
                        <span className="w-16"></span>
                    </div>
                </div>
            </div>

            {/* Help Request Button */}
            <button
                onClick={() => alert('보호자에게 전화합니다.')}
                className="w-full bg-red-500 text-white rounded-full py-5 text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105"
            >
                <HelpPhoneIcon className="w-6 h-6" />
                도움 요청
            </button>
        </div>
    );
};

export default ElderlyHomeScreen;