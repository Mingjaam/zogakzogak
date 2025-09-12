import React, { useState } from 'react';
import HomeScreen from './components/screens/guardian/HomeScreen';
import MapScreen from './components/screens/guardian/MapScreen';
import NotificationsScreen from './components/screens/guardian/NotificationsScreen';
import DiaryScreen from './components/screens/guardian/DiaryScreen';
import GalleryScreen from './components/screens/guardian/GalleryScreen';
import ProfileScreen from './components/screens/guardian/ProfileScreen';
import MedicationManagementScreen from './components/MedicationManagementScreen';
import BottomNavBar from './components/BottomNavBar';
import AppHeader from './components/AppHeader';

export type TabName = 'home' | 'gallery' | 'map' | 'diary' | 'medication' | 'profile';

interface GuardianAppProps {
    onHeaderClick: () => void;
}

const GuardianApp: React.FC<GuardianAppProps> = ({ onHeaderClick }) => {
    const [activeTab, setActiveTab] = useState<TabName>('home');
    const [showNotifications, setShowNotifications] = useState(false);

    const renderContent = () => {
        if (showNotifications) {
            return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
        }
        
        switch (activeTab) {
            case 'home':
                return <HomeScreen />;
            case 'map':
                return <MapScreen />;
            case 'diary':
                return <DiaryScreen />;
            case 'medication':
                return <MedicationManagementScreen />;
            case 'gallery':
                return <GalleryScreen />;
            case 'profile':
                return <ProfileScreen />;
            default:
                return <HomeScreen />;
        }
    };
    
    const getHeaderTitle = () => {
        if (showNotifications) {
            return '보호자 알림';
        }
        
        switch (activeTab) {
            case 'home':
                return '환영합니다, 보호자님';
            case 'map':
                return '안전구역 지도';
            case 'diary':
                return '어르신의 일기';
            case 'medication':
                return '약물 관리';
            case 'gallery':
                 return '추억 앨범';
            case 'profile':
                return '내 정보';
            default:
                return '조각조각';
        }
    };

    return (
        <div className="h-screen w-screen bg-white flex flex-col antialiased">
            <AppHeader 
                title={getHeaderTitle()} 
                onTitleClick={onHeaderClick}
                onNotificationClick={() => setShowNotifications(true)}
                showLogout={true}
            />
            <main className="flex-grow overflow-y-auto pb-20">
                {renderContent()}
            </main>
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default GuardianApp;