import React from 'react';
import PhoneIcon from '../../icons/PhoneIcon';
import LocationPinIcon from '../../icons/LocationPinIcon';
import PillIcon from '../../icons/PillIcon';
import CheckIcon from '../../icons/CheckIcon';

const HomeScreen: React.FC = () => {
    const photoUrl = "https://i.imgur.com/k2m3s4f.png"; // Placeholder image from design
    
    return (
        <div className="p-4 space-y-6">
            {/* User Status Card */}
            <div className="bg-white p-5 rounded-3xl shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">박길수 님의 상태</h2>
                        <p className="text-gray-500 mt-1">65세 | 여 | 010-1234-5647</p>
                        <p className="text-gray-500 mt-1">현재 위치: 대구광역시 남구 명덕로 104</p>
                    </div>
                    <button className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition">
                        <PhoneIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#e9f5ec] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="relative">
                            <LocationPinIcon className="w-12 h-12 text-[#70c18c]" />
                             <span className="absolute top-0 right-[-10px] text-xs font-bold bg-white text-gray-600 px-1.5 py-0.5 rounded-full shadow">13:45</span>
                        </div>
                        <span className="font-bold text-lg mt-2 text-[#3e8e5a]">SAFE ZONE</span>
                    </div>
                    <div className="bg-[#e9f5ec] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <PillIcon className="w-12 h-12 text-[#f5a623]" />
                        <div className="flex gap-2 mt-2">
                           <CheckIcon className="w-5 h-5 text-green-500 bg-white rounded-full p-0.5" />
                           <CheckIcon className="w-5 h-5 text-green-500 bg-white rounded-full p-0.5" />
                           <CheckIcon className="w-5 h-5 text-green-500 bg-white rounded-full p-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Gallery Card */}
            <div className="bg-white p-5 rounded-3xl shadow-md text-center">
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-4">
                    <img src={photoUrl} alt="Family gathering" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">사랑하는 가족들과 함께한 시간</h3>
                <p className="text-gray-500">대구 월성동 2024.05.05</p>
                <div className="flex justify-center gap-2 mt-4">
                    <span className="block w-2.5 h-2.5 bg-gray-600 rounded-full"></span>
                    <span className="block w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                    <span className="block w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
