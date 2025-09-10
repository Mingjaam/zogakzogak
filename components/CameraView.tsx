import React, { useRef, useState, useCallback, useEffect } from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraViewProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

// Fix: Implement CameraView component to capture photos.
const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let mediaStream: MediaStream;
        const getMedia = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'user' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setStream(mediaStream);
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
                onClose();
            }
        };

        getMedia();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose]);

    const handleCapture = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                const base64 = dataUrl.split(',')[1];
                onCapture(base64);
            }
        }
    }, [onCapture]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-around items-center">
                <button 
                    onClick={onClose}
                    className="text-white text-lg font-semibold"
                >
                    취소
                </button>
                <button
                    onClick={handleCapture}
                    className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center"
                    aria-label="사진 찍기"
                >
                    <CameraIcon className="w-12 h-12 text-gray-700" />
                </button>
                <div className="w-16"></div> {/* Spacer */}
            </div>
        </div>
    );
};

export default CameraView;
