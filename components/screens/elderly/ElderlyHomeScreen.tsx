import React from 'react';
import PuzzleCameraIcon from '../../icons/PuzzleCameraIcon';
import PuzzleBookIcon from '../../icons/PuzzleBookIcon';
import PuzzlePillIcon from '../../icons/PuzzlePillIcon';
import HelpPhoneIcon from '../../icons/HelpPhoneIcon';

interface ElderlyHomeScreenProps {
    setShowModal: (show: boolean) => void;
    setActiveTab: (tab: 'home' | 'gallery' | 'map' | 'notifications' | 'profile') => void;
}

const MainFeatureButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}> = ({ icon, label, onClick }) => (
    <div className="flex flex-col items-center gap-3">
        <button
            onClick={onClick}
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
        >
            {icon}
        </button>
        <span className="font-semibold text-gray-700 text-sm">{label}</span>
    </div>
);

const PillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.2929 2.29289C12.4645 1.12132 14.3396 1.12132 15.5112 2.29289L21.7071 8.48883C22.8787 9.66041 22.8787 11.5355 21.7071 12.7071L12.7071 21.7071C11.5355 22.8787 9.66041 22.8787 8.48883 21.7071L2.29289 15.5112C1.12132 14.3396 1.12132 12.4645 2.29289 11.2929L11.2929 2.29289Z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const ElderlyHomeScreen: React.FC<ElderlyHomeScreenProps> = ({ setShowModal, setActiveTab }) => {
    return (
        <div className="min-h-screen bg-[#f9f8f4]">
            {/* Welcome Section */}
            <div className="px-6 pt-6 pb-4">
                <h2 className="text-lg text-gray-700">환영합니다, 어르신</h2>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-6">
                {/* Main Feature Buttons */}
                <div className="flex justify-around items-center py-4">
                    <MainFeatureButton
                        icon={<PuzzleCameraIcon className="w-11 h-11" />}
                        label="인물 찾기"
                        onClick={() => setActiveTab('gallery')}
                    />
                    <MainFeatureButton
                        icon={<PuzzleBookIcon className="w-11 h-11" />}
                        label="추억 찾기"
                        onClick={() => setActiveTab('map')}
                    />
                    <MainFeatureButton
                        icon={<PuzzlePillIcon className="w-11 h-11" />}
                        label="약 복용"
                        onClick={() => setActiveTab('notifications')}
                    />
                </div>

                {/* Next Medication Card */}
                <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-5">
                    <div className="bg-green-100 p-3 rounded-full">
                        <PillIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800">다음 약 복용</h3>
                        <p className="text-gray-500 text-sm">오후 1시 (30분 후)</p>
                    </div>
                </div>

                {/* Today's Medication Card */}
                <div className="bg-white rounded-3xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-4">오늘의 약</h3>
                    <div className="space-y-4">
                        {/* Morning */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-semibold text-gray-700">아침</span>
                            </div>
                            <span className="text-gray-600 text-sm">혈압약, 비타민</span>
                            <span className="text-green-600 font-semibold text-sm">복용완료</span>
                        </div>
                        
                        {/* Lunch */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="font-semibold text-gray-700">점심</span>
                            </div>
                            <span className="text-gray-600 text-sm">혈압약</span>
                            <div className="w-16"></div>
                        </div>
                        
                        {/* Evening */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="font-semibold text-gray-700">저녁</span>
                            </div>
                            <span className="text-gray-600 text-sm">당뇨약</span>
                            <div className="w-16"></div>
                        </div>
                    </div>
                </div>

                {/* Help Request Button */}
                <a
                    href="tel:01037177644"
                    className="w-full bg-red-500 text-white rounded-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 mb-6 inline-block"
                >
                    <HelpPhoneIcon className="w-5 h-5" />
                    도움 요청
                </a>
            </div>
        </div>
    );
};

export default ElderlyHomeScreen;