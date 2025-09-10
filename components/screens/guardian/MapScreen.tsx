import React from 'react';
import LocationPinIcon from '../../icons/LocationPinIcon';
import RocketIcon from '../../icons/RocketIcon';
import ClockIcon from '../../icons/ClockIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import WarningIcon from '../../icons/WarningIcon';
import PaperPlaneIcon from '../../icons/PaperPlaneIcon';

const MapScreen: React.FC = () => {
    // Placeholder image for the map
    const mapImageUrl = 'https://i.imgur.com/3Z2G9g7.png';

    return (
        <div className="p-4 space-y-6">
            {/* Current Location Card */}
            <div className="bg-white p-5 rounded-3xl shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LocationPinIcon className="w-6 h-6 text-gray-500" />
                        <h2 className="text-lg font-bold text-gray-800">현재 위치</h2>
                    </div>
                    <span className="px-3 py-1 text-sm font-bold text-white bg-[#70c18c] rounded-full">SAFE ZONE</span>
                </div>
                <div className="mt-3 space-y-2 text-gray-600">
                    <div className="flex items-center gap-3">
                        <RocketIcon className="w-5 h-5 text-red-500" />
                        <span>대구광역시 남구 명덕로 104</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span>마지막 업데이트 : 10분 전</span>
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="relative h-64 rounded-3xl shadow-md overflow-hidden">
                <img src={mapImageUrl} alt="Map of safe zone" className="w-full h-full object-cover" />
                 <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                    <PaperPlaneIcon className="w-6 h-6 text-gray-600 -rotate-45" />
                </button>
            </div>

            {/* Recent Routes Card */}
            <div className="bg-white p-5 rounded-3xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4">최근 경로</h2>
                <div className="space-y-3">
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-xl flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">안전지대로 돌아왔습니다</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> 마지막 업데이트 : 10분 전</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-start gap-3">
                        <WarningIcon className="w-6 h-6 text-orange-500 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">안전지대를 벗어났습니다</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> 마지막 업데이트 : 50분 전</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Safe Zone Settings Card */}
            <div className="bg-white p-5 rounded-3xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">안심 구역 설정</h2>
                    <button className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-300 rounded-full hover:bg-gray-100 transition">편집</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-xl flex items-center gap-3">
                         <LocationPinIcon className="w-5 h-5 text-green-600"/>
                         <p className="text-gray-700">현재 반경: <span className="font-bold">500m</span></p>
                    </div>
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-xl flex items-center gap-3">
                        <PaperPlaneIcon className="w-5 h-5 text-green-600"/>
                        <p className="text-gray-700">중심 위치: 대구광역시 남구 동동로 20</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapScreen;
