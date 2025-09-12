
import React, { useEffect, useRef } from 'react';

const SplashScreen: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 사운드 파일 재생
        const playStartupSound = () => {
            try {
                const audio = new Audio('/sounds/startup.mp3');
                audio.volume = 0.5; // 볼륨을 30%로 설정
                audio.play().catch(error => {
                    console.log('사운드 재생 실패:', error);
                });
                audioRef.current = audio;
            } catch (error) {
                console.log('사운드 로드 실패:', error);
            }
        };

        // 컴포넌트 마운트 시 사운드 재생
        playStartupSound();

        // 컴포넌트 언마운트 시 오디오 정리
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);
    return (
        <main className="bg-[#70c18c] h-screen w-screen flex flex-col items-center justify-center text-center text-white antialiased">
            <div className="flex flex-col items-center justify-center gap-5 animate-fadeIn">
                <div className="bg-white/95 p-8 rounded-[2.5rem] shadow-2xl shadow-black/20">
                    <img 
                        src="https://i.imgur.com/O0Z5u8g.png" 
                        alt="조각조각 로고" 
                        className="w-26 h-24"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-extrabold tracking-wider">조각조각</h1>
                    <p className="text-lg font-medium opacity-90">소중한 순간을 담는 추억기록 APP</p>
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 1s ease-out forwards;
                    }
                `}
            </style>
        </main>
    );
};

export default SplashScreen;
