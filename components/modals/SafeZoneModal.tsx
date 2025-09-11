import React, { useState, useRef, useEffect } from 'react';
import GoogleMap from '../GoogleMap';
import { Memory } from '../../types/memory';
import { useSafeZone } from '../../contexts/SafeZoneContext';

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
        getCenter(): { lat(): number; lng(): number };
      }
      class Circle {
        constructor(options?: any);
        setMap(map: Map | null): void;
        setCenter(center: { lat: number; lng: number }): void;
        setRadius(radius: number): void;
      }
      class Marker {
        constructor(options?: any);
        setMap(map: Map | null): void;
        setPosition(position: { lat: number; lng: number }): void;
      }
    }
  }
}

interface SafeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (center: { lat: number; lng: number }, radius: number) => void;
  currentCenter?: { lat: number; lng: number };
  currentRadius?: number;
}

const SafeZoneModal: React.FC<SafeZoneModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentCenter = { lat: 35.8714, lng: 128.6014 },
  currentRadius = 500
}) => {
  const { safeZone, updateSafeZone } = useSafeZone();
  const [center, setCenter] = useState(safeZone.center);
  const [radius, setRadius] = useState(safeZone.radius);
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // 모달이 열릴 때 현재 안전구역 설정을 반영
  useEffect(() => {
    if (isOpen) {
      setCenter(safeZone.center);
      setRadius(safeZone.radius);
    }
  }, [isOpen, safeZone]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // 원형 안심구역 표시
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }
    
    circleRef.current = new google.maps.Circle({
      center: center,
      radius: radius,
      strokeColor: '#70c18c',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#70c18c',
      fillOpacity: 0.2,
      map: map
    });

    // 중앙 마커
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    markerRef.current = new google.maps.Marker({
      position: center,
      map: map,
      title: '안심구역 중심',
      draggable: true,
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
        anchor: new google.maps.Point(16, 32), // 집의 바닥 중앙이 위치에 맞춰지도록
      }
    });

    // 마커 드래그 이벤트
    markerRef.current.addListener('dragstart', () => {
      setIsDragging(true);
    });

    markerRef.current.addListener('dragend', () => {
      const newCenter = markerRef.current!.getPosition();
      const newLat = newCenter.lat();
      const newLng = newCenter.lng();
      
      setCenter({ lat: newLat, lng: newLng });
      circleRef.current!.setCenter({ lat: newLat, lng: newLng });
      map.panTo({ lat: newLat, lng: newLng });
      
      setIsDragging(false);
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
  };

  const handleSave = () => {
    updateSafeZone(center, radius);
    onSave(center, radius);
    onClose();
  };

  const handleMapClick = (event: any) => {
    if (isDragging) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setCenter({ lat, lng });
    
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    }
    
    if (circleRef.current) {
      circleRef.current.setCenter({ lat, lng });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">안심구역 설정</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
            >
              <span className="text-gray-600">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 지도 */}
          <div className="h-80 rounded-2xl overflow-hidden border border-gray-200">
            <GoogleMap
              center={center}
              zoom={15}
              className="w-full h-full"
              memories={[]}
              onMapLoad={handleMapLoad}
            />
          </div>

          {/* 설정 옵션 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                반경 설정: {radius}m
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={radius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100m</span>
                <span>2000m</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  위도
                </label>
                <input
                  type="number"
                  value={center.lat.toFixed(6)}
                  onChange={(e) => setCenter({ ...center, lat: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.000001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  경도
                </label>
                <input
                  type="number"
                  value={center.lng.toFixed(6)}
                  onChange={(e) => setCenter({ ...center, lng: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.000001"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                💡 <strong>사용법:</strong> 지도를 클릭하거나 마커를 드래그하여 중심 위치를 설정하고, 
                슬라이더로 반경을 조정하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-white bg-green-500 rounded-full hover:bg-green-600 transition"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafeZoneModal;
