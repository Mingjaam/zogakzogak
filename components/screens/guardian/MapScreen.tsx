import React, { useState, useRef } from 'react';
import GoogleMap from '../../GoogleMap';
import { Memory, dummyMemories } from '../../../types/memory';
import SafeZoneModal from '../../modals/SafeZoneModal';
import { useSafeZone } from '../../../contexts/SafeZoneContext';
import LocationPinIcon from '../../icons/LocationPinIcon';
import RocketIcon from '../../icons/RocketIcon';
import ClockIcon from '../../icons/ClockIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import WarningIcon from '../../icons/WarningIcon';
import PaperPlaneIcon from '../../icons/PaperPlaneIcon';

// Google Maps 타입 정의
declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded: boolean;
  }
  namespace google {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options?: any);
        panTo(latLng: { lat: number; lng: number }): void;
        setZoom(zoom: number): void;
      }
    }
  }
}

const MapScreen: React.FC = () => {
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isSafeZoneModalOpen, setIsSafeZoneModalOpen] = useState(false);
    const { safeZone, updateSafeZone } = useSafeZone();
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMemoryClick = (memory: Memory) => {
        setSelectedMemory(memory);
    };

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const handleSafeZoneSave = (center: { lat: number; lng: number }, radius: number) => {
        updateSafeZone(center, radius);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Current Location Card */}
            <div className="bg-white p-4 mx-4 mt-4 rounded-3xl shadow-md">
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
            <div className="flex-1 relative bg-gray-200 mx-4 my-4 rounded-3xl shadow-md overflow-hidden">
                <GoogleMap 
                    center={{ lat: 35.8714, lng: 128.6014 }}
                    zoom={15}
                    className="w-full h-full"
                    memories={dummyMemories}
                    onMemoryClick={handleMemoryClick}
                    selectedMemoryId={selectedMemory?.id}
                    onMapLoad={handleMapLoad}
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10">
                    <PaperPlaneIcon className="w-6 h-6 text-gray-600 -rotate-45" />
                </button>
            </div>

            {/* Recent Routes Card */}
            <div className="bg-white p-4 mx-4 mb-4 rounded-3xl shadow-md">
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
            <div className="bg-white p-4 mx-4 mb-4 rounded-3xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">안심 구역 설정</h2>
                    <button 
                        onClick={() => setIsSafeZoneModalOpen(true)}
                        className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-300 rounded-full hover:bg-gray-100 transition"
                    >
                        편집
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-xl flex items-center gap-3">
                         <LocationPinIcon className="w-5 h-5 text-green-600"/>
                         <p className="text-gray-700">현재 반경: <span className="font-bold">{safeZone.radius}m</span></p>
                    </div>
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-xl flex items-center gap-3">
                        <PaperPlaneIcon className="w-5 h-5 text-green-600"/>
                        <p className="text-gray-700">중심 위치: {safeZone.center.lat.toFixed(4)}, {safeZone.center.lng.toFixed(4)}</p>
                    </div>
                </div>
            </div>

            {/* Safe Zone Modal */}
            <SafeZoneModal
                isOpen={isSafeZoneModalOpen}
                onClose={() => setIsSafeZoneModalOpen(false)}
                onSave={handleSafeZoneSave}
                currentCenter={safeZone.center}
                currentRadius={safeZone.radius}
            />
        </div>
    );
};

export default MapScreen;
