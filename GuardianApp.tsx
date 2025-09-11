import React, { useState } from 'react';
import HomeScreen from './components/screens/guardian/HomeScreen';
import MapScreen from './components/screens/guardian/MapScreen';
import NotificationsScreen from './components/screens/guardian/NotificationsScreen';
import GalleryScreen from './components/screens/guardian/GalleryScreen';
import ProfileScreen from './components/screens/guardian/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import AppHeader from './components/AppHeader';

export type TabName = 'home' | 'gallery' | 'map' | 'notifications' | 'profile';

interface GuardianAppProps {
    onHeaderClick: () => void;
}

const GuardianApp: React.FC<GuardianAppProps> = ({ onHeaderClick }) => {
    const [activeTab, setActiveTab] = useState<TabName>('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeScreen />;
            case 'map':
                return <MapScreen />;
            case 'notifications':
                return <NotificationsScreen />;
            case 'gallery':
                return <GalleryScreen />;
            case 'profile':
                return <ProfileScreen />;
            default:
                return <HomeScreen />;
        }
    };
    
    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'home':
                return '환영합니다, 보호자님';
            case 'map':
                return '안전구역 지도';
            case 'notifications':
                return '보호자 알림';
            case 'gallery':
                 return '추억 앨범';
            case 'profile':
                return '내 정보';
            default:
                return '조각조각';
        }
    };

    return (
        <div className="h-screen w-screen bg-[#f9f8f4] flex flex-col antialiased">
            <AppHeader 
                title={getHeaderTitle()} 
                onTitleClick={onHeaderClick}
                onNotificationClick={() => setActiveTab('notifications')}
            />
            <main className="flex-grow overflow-y-auto pb-20">
                {renderContent()}
            </main>
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default GuardianApp;