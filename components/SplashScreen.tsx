
import React, { useEffect, useRef, useState } from 'react';

const SplashScreen: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);

    // 사용자 상호작용 후 사운드 재생을 위한 함수
    const enableAudio = () => {
        if (!isAudioEnabled && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log('사운드 재생 실패:', error);
            });
            setIsAudioEnabled(true);
        }
    };

    useEffect(() => {
        // 사운드 파일 재생
        const playStartupSound = async () => {
            try {
                const audio = new Audio(`${import.meta.env.BASE_URL}sounds/startup.mp3`);
                audio.volume = 0.5; // 볼륨을 50%로 설정
                audioRef.current = audio;
                
                // 오디오가 로드될 때까지 기다린 후 재생
                await audio.play();
                setIsAudioEnabled(true);
            } catch (error) {
                // NotAllowedError는 브라우저 정책으로 인한 정상적인 차단
                if (error.name === 'NotAllowedError') {
                    console.log('사운드 재생이 차단되었습니다. 사용자 상호작용이 필요합니다.');
                } else if (error.name !== 'AbortError') {
                    console.log('사운드 재생 실패:', error);
                }
            }
        };

        // 컴포넌트 마운트 시 사운드 재생 시도
        playStartupSound();

        // 사용자 상호작용 이벤트 리스너 추가
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });

        // 컴포넌트 언마운트 시 오디오 정리
        return () => {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            
            if (audioRef.current) {
                // 오디오가 재생 중인지 확인 후 정리
                if (!audioRef.current.paused) {
                    audioRef.current.pause();
                }
                audioRef.current = null;
            }
        };
    }, [isAudioEnabled]);
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
                    <h1 
                        className="text-5xl font-extrabold tracking-wider cursor-pointer hover:scale-105 transition-transform duration-200 select-none"
                        onClick={enableAudio}
                        title="클릭하면 사운드가 재생됩니다"
                    >
                        조각조각
                    </h1>
                    <p className="text-lg font-medium opacity-90">소중한 순간을 담는 추억기록 APP</p>
                    {!isAudioEnabled && (
                        <p className="text-sm opacity-75 mt-2">
                            🔊 "조각조각"을 클릭하면 사운드가 재생됩니다
                        </p>
                    )}
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
