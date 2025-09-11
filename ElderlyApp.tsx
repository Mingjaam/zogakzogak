import React, { useState } from 'react';
import ElderlyHomeScreen from './components/screens/elderly/ElderlyHomeScreen';
import ElderlyGalleryScreen from './components/screens/elderly/ElderlyGalleryScreen';
import ElderlyMapScreen from './components/screens/elderly/ElderlyMapScreen';
import ElderlyNotificationsScreen from './components/screens/elderly/ElderlyNotificationsScreen';
import ElderlyProfileScreen from './components/screens/elderly/ElderlyProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import AppHeader from './components/AppHeader';
import MedicationReminderModal from './components/modals/MedicationReminderModal';

export type TabName = 'home' | 'gallery' | 'map' | 'notifications' | 'profile';

interface ElderlyAppProps {
    onHeaderClick: () => void;
}

const ElderlyApp: React.FC<ElderlyAppProps> = ({ onHeaderClick }) => {
    const [activeTab, setActiveTab] = useState<TabName>('home');
    const [showMedicationModal, setShowMedicationModal] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <ElderlyHomeScreen setShowModal={setShowMedicationModal} setActiveTab={setActiveTab} />;
            case 'gallery':
                return <ElderlyGalleryScreen />;
            case 'map':
                return <ElderlyMapScreen />;
            case 'notifications':
                return <ElderlyNotificationsScreen />;
            case 'profile':
                return <ElderlyProfileScreen />;
            default:
                return <ElderlyHomeScreen setShowModal={setShowMedicationModal} setActiveTab={setActiveTab} />;
        }
    };
    
    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'home':
                return '조각조각';
            case 'gallery':
                 return '인물 찾기';
            case 'map':
                return '추억 찾기';
            case 'notifications':
                return '약 복용 알림';
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
            <MedicationReminderModal isOpen={showMedicationModal} onClose={() => setShowMedicationModal(false)} />
        </div>
    );
};

export default ElderlyApp;