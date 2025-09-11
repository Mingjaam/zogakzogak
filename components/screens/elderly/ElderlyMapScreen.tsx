import React from 'react';
import GoogleMap from '../../GoogleMap';

const ElderlyMapScreen: React.FC = () => {
    const photoUrl = "https://i.imgur.com/k2m3s4f.png"; // Placeholder photo from design


    return (
        <div className="h-full flex flex-col">
            {/* Map View */}
            <div className="flex-1 relative bg-gray-200">
                <GoogleMap 
                    center={{ lat: 35.8714, lng: 128.6014 }}
                    zoom={15}
                    className="w-full h-full"
                />
            </div>

            {/* Photo Card */}
            <div className="bg-white p-5 rounded-t-3xl shadow-[0_-4px_15px_rgba(0,0,0,0.08)] text-center relative -mt-8 z-10">
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                    <img src={photoUrl} alt="Family gathering" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">사랑하는 가족들과 함께한 시간</h3>
                <p className="text-gray-500">대구 월성동 2024.05.05</p>
                <div className="flex justify-center gap-2 mt-4">
                    <span className="block w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                    <span className="block w-2.5 h-2.5 bg-gray-600 rounded-full"></span>
                    <span className="block w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                </div>
            </div>
        </div>
    );
};

export default ElderlyMapScreen;