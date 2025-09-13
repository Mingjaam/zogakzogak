import React, { useState, useRef } from 'react';
import GoogleMap from '../../GoogleMap';

const GalleryScreen: React.FC = () => {
    // 상태 관리
    const [showAddMemory, setShowAddMemory] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [memoryTitle, setMemoryTitle] = useState('');
    const [memoryDescription, setMemoryDescription] = useState('');
    const [memoryDate, setMemoryDate] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [memories, setMemories] = useState([
        {
            id: 1,
            title: "사랑하는 가족들과 함께한 시간",
            location: "대구 월성동",
            date: "2024.05.05",
            imageUrl: "https://i.imgur.com/k2m3s4f.png",
            description: "딸과 손자들과 함께한 즐거운 시간이었습니다."
        },
        {
            id: 2,
            title: "봄날의 산책",
            location: "대구 수성못",
            date: "2024.04.15",
            imageUrl: "https://i.imgur.com/k2m3s4f.png",
            description: "따뜻한 봄날 산책로를 걸으며 좋은 시간을 보냈습니다."
        },
        {
            id: 3,
            title: "생일 축하 파티",
            location: "집",
            date: "2024.03.20",
            imageUrl: "https://i.imgur.com/k2m3s4f.png",
            description: "65번째 생일을 가족들과 함께 축하했습니다."
        },
        {
            id: 4,
            title: "손자와의 첫 만남",
            location: "병원",
            date: "2024.02.10",
            imageUrl: "https://i.imgur.com/k2m3s4f.png",
            description: "첫 손자를 안아보는 순간, 세상에서 가장 행복했습니다."
        }
    ]);

    // 추억 삭제 기능
    const handleDeleteMemory = (memoryId: number) => {
        if (window.confirm('정말로 이 추억을 삭제하시겠습니까?')) {
            setMemories(prevMemories => prevMemories.filter(memory => memory.id !== memoryId));
            alert('추억이 삭제되었습니다.');
        }
    };

    // 추억 추가 관련 함수들
    const handleAddMemory = () => {
        setShowAddMemory(true);
    };

    const handleCloseAddMemory = () => {
        setShowAddMemory(false);
        setSelectedLocation(null);
        setSelectedImage(null);
        setImagePreview(null);
        setMemoryTitle('');
        setMemoryDescription('');
        setMemoryDate('');
        setLocationDescription('');
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }
            
            setSelectedImage(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({
            lat,
            lng,
            address: `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`
        });
        setShowLocationPicker(false);
    };

    const saveMemoryToLocalStorage = (memoryData: any) => {
        try {
            const existingMemories = JSON.parse(localStorage.getItem('userMemories') || '[]');
            const newMemory = {
                ...memoryData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            existingMemories.unshift(newMemory);
            localStorage.setItem('userMemories', JSON.stringify(existingMemories));
            return newMemory;
        } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
            return null;
        }
    };

    return (
        <div className="p-4">
            {/* 헤더 */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">추억 갤러리</h2>
                    <p className="text-gray-600 text-sm mt-1">소중한 순간들을 다시 만나보세요</p>
                </div>
                
                {/* 추억 추가 버튼 */}
                <button
                    onClick={handleAddMemory}
                    className="px-4 py-2 bg-[#70c18c] hover:bg-[#5da576] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">추억 추가</span>
                </button>
            </div>

            {/* 추억 리스트 */}
            <div className="space-y-4">
                {memories.map((memory) => (
                    <div key={memory.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="flex">
                            {/* 이미지 */}
                            <div className="w-32 h-32 flex-shrink-0">
                                <img 
                                    src={memory.imageUrl} 
                                    alt={memory.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* 내용 */}
                            <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{memory.title}</h3>
                                    <button
                                        onClick={() => handleDeleteMemory(memory.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="추억 삭제"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-gray-500">📍 {memory.location}</span>
                                    <span className="text-sm text-gray-500">📅 {memory.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{memory.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 빈 상태 (데이터가 없을 때) */}
            {memories.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">아직 추억이 없습니다</h3>
                    <p className="text-sm text-gray-400">새로운 추억을 만들어보세요</p>
                </div>
            )}

            {/* Add Memory Modal */}
            {showAddMemory && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">새로운 추억 추가</h2>
                            <button
                                onClick={handleCloseAddMemory}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* 사진 추가 */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">사진</label>
                                
                                {/* 숨겨진 파일 입력 */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                
                                {imagePreview ? (
                                    /* 이미지 미리보기 */
                                    <div className="relative">
                                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-gray-200">
                                            <img 
                                                src={imagePreview} 
                                                alt="미리보기" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="mt-2 text-center">
                                            <button
                                                onClick={handleImageUpload}
                                                className="text-sm text-[#70c18c] hover:text-[#5da576] font-medium"
                                            >
                                                다른 사진 선택
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 업로드 영역 */
                                    <div 
                                        onClick={handleImageUpload}
                                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#70c18c] transition-colors cursor-pointer"
                                    >
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm">사진을 선택하거나 촬영하세요</p>
                                        <p className="text-gray-400 text-xs mt-1">카메라 또는 갤러리에서 선택</p>
                                        <p className="text-gray-400 text-xs mt-1">최대 5MB, JPG/PNG 파일</p>
                                    </div>
                                )}
                            </div>

                            {/* 제목 */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">제목</label>
                                <input
                                    type="text"
                                    placeholder="추억의 제목을 입력하세요"
                                    value={memoryTitle}
                                    onChange={(e) => setMemoryTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
                                />
                            </div>

                            {/* 설명 */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">설명</label>
                                <textarea
                                    placeholder="이 추억에 대한 설명을 입력하세요"
                                    rows={3}
                                    value={memoryDescription}
                                    onChange={(e) => setMemoryDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent resize-none"
                                />
                            </div>

                            {/* 위치 */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">위치</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={selectedLocation ? selectedLocation.address : "위치를 선택하세요"}
                                        value={selectedLocation ? selectedLocation.address : ""}
                                        readOnly
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                                    />
                                    <button 
                                        onClick={() => setShowLocationPicker(true)}
                                        className="px-4 py-3 bg-[#70c18c] text-white rounded-xl hover:bg-[#5da576] transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </div>
                                {selectedLocation && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        위치가 선택되었습니다
                                    </div>
                                )}
                                
                                {/* 위치 설명 입력 */}
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="위치에 대한 간단한 설명을 입력하세요 (예: 우리 집, 공원, 카페 등)"
                                        value={locationDescription}
                                        onChange={(e) => setLocationDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* 날짜 */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">날짜</label>
                                <input
                                    type="date"
                                    value={memoryDate}
                                    onChange={(e) => setMemoryDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#70c18c] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleCloseAddMemory}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    if (!selectedImage) {
                                        alert('사진을 선택해주세요.');
                                        return;
                                    }
                                    if (!selectedLocation) {
                                        alert('위치를 선택해주세요.');
                                        return;
                                    }
                                    if (!memoryTitle.trim()) {
                                        alert('제목을 입력해주세요.');
                                        return;
                                    }
                                    
                                    // 이미지를 Base64로 변환
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const imageData = e.target?.result as string;
                                        
                                        // 추억 데이터 생성
                                        const memoryData = {
                                            title: memoryTitle,
                                            description: memoryDescription,
                                            date: memoryDate || new Date().toISOString().split('T')[0],
                                            location: {
                                                lat: selectedLocation.lat,
                                                lng: selectedLocation.lng,
                                                address: selectedLocation.address,
                                                description: locationDescription
                                            },
                                            imageUrl: imageData,
                                            imageName: selectedImage.name,
                                            imageSize: selectedImage.size
                                        };
                                        
                                        // 로컬 스토리지에 저장
                                        const savedMemory = saveMemoryToLocalStorage(memoryData);
                                        
                                        if (savedMemory) {
                                            alert('추억이 추가되었습니다!');
                                            handleCloseAddMemory();
                                            // 페이지 새로고침으로 새로운 추억 반영
                                            window.location.reload();
                                        } else {
                                            alert('저장 중 오류가 발생했습니다.');
                                        }
                                    };
                                    reader.readAsDataURL(selectedImage);
                                }}
                                className="flex-1 py-3 px-4 bg-[#70c18c] text-white rounded-xl hover:bg-[#5da576] transition-colors font-medium"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Picker Modal */}
            {showLocationPicker && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">위치 선택</h2>
                            <button
                                onClick={() => setShowLocationPicker(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-blue-50 border-b border-blue-200">
                            <div className="flex items-center gap-2 text-blue-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">지도를 클릭하여 위치를 선택하세요</span>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="flex-1 relative">
                            <GoogleMap
                                center={{ lat: 35.8714, lng: 128.6014 }}
                                zoom={15}
                                className="w-full h-full rounded-b-3xl"
                                memories={[]}
                                onMapLoad={(map) => {
                                    map.addListener('click', (event: any) => {
                                        const lat = event.latLng.lat();
                                        const lng = event.latLng.lng();
                                        handleLocationSelect(lat, lng);
                                    });
                                }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLocationPicker(false)}
                                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => setShowLocationPicker(false)}
                                    className="flex-1 py-3 px-4 bg-[#70c18c] text-white rounded-xl hover:bg-[#5da576] transition-colors font-medium"
                                >
                                    완료
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryScreen;
