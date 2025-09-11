import React, { useState, useRef } from 'react';
import GoogleMap from '../../GoogleMap';
import { Memory, dummyMemories } from '../../../types/memory';

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

interface MemoryCardProps {
    memory: Memory;
    currentIndex: number;
    totalCount: number;
    onMemoryChange: (index: number) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, currentIndex, totalCount, onMemoryChange }) => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < totalCount - 1) {
                // 왼쪽으로 스와이프 - 다음 추억
                onMemoryChange(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // 오른쪽으로 스와이프 - 이전 추억
                onMemoryChange(currentIndex - 1);
            }
        }

        setIsDragging(false);
        setCurrentX(0);
        setStartX(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setCurrentX(e.clientX);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setCurrentX(e.clientX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < totalCount - 1) {
                onMemoryChange(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                onMemoryChange(currentIndex - 1);
            }
        }

        setIsDragging(false);
        setCurrentX(0);
        setStartX(0);
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove as any);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove as any);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div 
            className="bg-white p-5 rounded-t-3xl shadow-[0_-4px_15px_rgba(0,0,0,0.08)] text-center relative -mt-8 z-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{
                transform: isDragging ? `translateX(${currentX - startX}px)` : 'translateX(0)',
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
        >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">{memory.title}</h3>
            <p className="text-gray-500">{memory.location.name} {memory.date}</p>
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalCount }, (_, index) => (
                    <span 
                        key={index}
                        className={`block w-2.5 h-2.5 rounded-full ${
                            index === currentIndex ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => currentIndex > 0 && onMemoryChange(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    이전
                </button>
                <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {totalCount}
                </span>
                <button
                    onClick={() => currentIndex < totalCount - 1 && onMemoryChange(currentIndex + 1)}
                    disabled={currentIndex === totalCount - 1}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

const ElderlyMapScreen: React.FC = () => {
    // 첫 번째 기억을 기본으로 선택
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(dummyMemories[0] || null);
    const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMemoryClick = (memory: Memory) => {
        const index = dummyMemories.findIndex(m => m.id === memory.id);
        setCurrentMemoryIndex(index);
        setSelectedMemory(memory);
    };

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const handleMemoryChange = (index: number) => {
        if (index < 0 || index >= dummyMemories.length) return;
        
        setCurrentMemoryIndex(index);
        const memory = dummyMemories[index];
        setSelectedMemory(memory);
        
        // 지도를 해당 위치로 부드럽게 이동
        if (mapRef.current) {
            const targetPosition = {
                lat: memory.location.lat,
                lng: memory.location.lng
            };
            
            // 부드러운 카메라 이동을 위해 panTo 사용 (Google Maps의 기본 애니메이션)
            mapRef.current.panTo(targetPosition);
            
            // 줌 레벨을 부드럽게 조정
            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.setZoom(16);
                }
            }, 300);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Map View */}
            <div className="flex-1 relative bg-gray-200">
                <GoogleMap 
                    center={{ lat: 35.8714, lng: 128.6014 }}
                    zoom={15}
                    className="w-full h-full"
                    memories={dummyMemories}
                    onMemoryClick={handleMemoryClick}
                    selectedMemoryId={selectedMemory?.id}
                    onMapLoad={handleMapLoad}
                />
            </div>

            {/* Selected Memory Card with Swipe */}
            {selectedMemory && (
                <MemoryCard 
                    memory={selectedMemory}
                    currentIndex={currentMemoryIndex}
                    totalCount={dummyMemories.length}
                    onMemoryChange={handleMemoryChange}
                />
            )}
        </div>
    );
};

export default ElderlyMapScreen;


