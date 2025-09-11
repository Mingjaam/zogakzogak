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
        
        // 어르신 현재 위치 마커 추가
        const elderlyLocation = { lat: 35.8714, lng: 128.6014 }; // 실제로는 API에서 가져와야 함
        
        new google.maps.Marker({
            position: elderlyLocation,
            map: map,
            title: '어르신 현재 위치',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#70c18c" stroke="white" stroke-width="3"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
            }
        });
        
        // 안전구역 원 그리기
        new google.maps.Circle({
            strokeColor: '#70c18c',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#70c18c',
            fillOpacity: 0.2,
            map: map,
            center: safeZone.center,
            radius: safeZone.radius
        });
        
        // 안전구역 중심 마커 (집 모양)
        new google.maps.Marker({
            position: safeZone.center,
            map: map,
            title: '안전구역 중심',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L28 12V26C28 27.1046 27.1046 28 26 28H20V20C20 19.4477 19.5523 19 19 19H13C12.4477 19 12 19.4477 12 20V28H6C4.89543 28 4 27.1046 4 26V12L16 4Z" fill="#70c18c" stroke="white" stroke-width="2"/>
                    <rect x="12" y="20" width="8" height="8" fill="white"/>
                    <rect x="14" y="22" width="2" height="2" fill="#70c18c"/>
                    <rect x="18" y="22" width="2" height="2" fill="#70c18c"/>
                    <rect x="14" y="26" width="2" height="2" fill="#70c18c"/>
                    <rect x="18" y="26" width="2" height="2" fill="#70c18c"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32),
            }
        });
    };

    const handleSafeZoneSave = (center: { lat: number; lng: number }, radius: number) => {
        updateSafeZone(center, radius);
    };

    return (
        <div className="h-full overflow-y-auto">
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
            <div className="relative bg-gray-200 mx-4 my-4 rounded-3xl shadow-md overflow-hidden" style={{ height: '400px' }}>
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
                    
                    {/* 안심 구역 미리보기 지도 */}
                    <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ height: '200px' }}>
                        <GoogleMap 
                            center={safeZone.center}
                            zoom={15}
                            className="w-full h-full"
                            memories={[]}
                            onMemoryClick={() => {}}
                            selectedMemoryId={null}
                            onMapLoad={(map) => {
                                // 안심 구역 원 그리기
                                if (window.google && window.google.maps) {
                                    new window.google.maps.Circle({
                                        strokeColor: '#70c18c',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: '#70c18c',
                                        fillOpacity: 0.2,
                                        map: map,
                                        center: safeZone.center,
                                        radius: safeZone.radius
                                    });
                                    
                                    // 중심 마커 (집 모양)
                                    new window.google.maps.Marker({
                                        position: safeZone.center,
                                        map: map,
                                        icon: {
                                            path: 'M10 2L3 7v11h4v-6h6v6h4V7l-7-5z',
                                            fillColor: '#70c18c',
                                            fillOpacity: 1,
                                            strokeColor: '#ffffff',
                                            strokeWeight: 2,
                                            scale: 1.5,
                                            anchor: new window.google.maps.Point(10, 20)
                                        }
                                    });
                                }
                            }}
                        />
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
