import React, { useEffect, useRef, useState } from 'react';

const ElderlyMapScreen: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const photoUrl = "https://i.imgur.com/k2m3s4f.png"; // Placeholder photo from design

    useEffect(() => {
        const initMap = () => {
            setIsMapLoaded(true);
        };

        // Attach initMap to the window object so the script can call it
        (window as any).initMap = initMap;

        // Function to load the script
        const loadGoogleMapsScript = () => {
            // Fix: Cast window to any to access dynamically loaded google maps script
            if ((window as any).google && (window as any).google.maps) {
                setIsMapLoaded(true);
                return;
            }

            // Check if script already exists
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                // If script is already loading or loaded, wait for the callback
                return;
            }

            const script = document.createElement('script');
            // Use the API_KEY from environment variables
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                console.error("Google Maps script failed to load.");
            };
            document.head.appendChild(script);
        };
        
        loadGoogleMapsScript();

        return () => {
            // Clean up the global callback function
            if ((window as any).initMap) {
                delete (window as any).initMap;
            }
        };

    }, []);

    useEffect(() => {
        if (isMapLoaded && mapRef.current) {
            const daeguCoords = { lat: 35.8714, lng: 128.6014 };
            new (window as any).google.maps.Map(mapRef.current, {
                center: daeguCoords,
                zoom: 15,
                disableDefaultUI: true, // A cleaner map look for the user
                gestureHandling: 'cooperative', // Better for touch screens
            });
        }
    }, [isMapLoaded]);


    return (
        <div className="h-full flex flex-col">
            {/* Map View */}
            <div className="flex-1 relative bg-gray-200">
                {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">지도 로딩 중...</p>
                    </div>
                )}
                <div ref={mapRef} className={`w-full h-full transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`} />
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