import React from 'react';
import HomeIcon from './icons/HomeIcon';
import GalleryIcon from './icons/GalleryIcon';
import MapIcon from './icons/MapIcon';
import BellIcon from './icons/BellIcon';
import UserIcon from './icons/UserIcon';

// Make TabName generic to be used by both Guardian and Elderly apps
type TabName = 'home' | 'gallery' | 'map' | 'notifications' | 'profile';

interface BottomNavBarProps {
    activeTab: TabName;
    setActiveTab: (tab: TabName) => void;
}

const NavItem: React.FC<{
    tabName: TabName;
    activeTab: TabName;
    setActiveTab: (tab: TabName) => void;
    children: React.ReactNode;
}> = ({ tabName, activeTab, setActiveTab, children }) => {
    const isActive = activeTab === tabName;
    const color = isActive ? '#3e8e5a' : '#a0a0a0';
    return (
        <button 
            onClick={() => setActiveTab(tabName)} 
            className="flex flex-col items-center justify-center flex-1 transition-transform transform hover:scale-110"
            style={{ color }}
            aria-label={tabName}
        >
            {children}
        </button>
    );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-4 left-4 right-4 h-16 bg-white/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl flex justify-around items-center z-50 border border-white/20">
            <NavItem tabName="home" activeTab={activeTab} setActiveTab={setActiveTab}>
                <HomeIcon className="w-6 h-6" />
            </NavItem>
            <NavItem tabName="gallery" activeTab={activeTab} setActiveTab={setActiveTab}>
                <GalleryIcon className="w-6 h-6" />
            </NavItem>
            <NavItem tabName="map" activeTab={activeTab} setActiveTab={setActiveTab}>
                <MapIcon className="w-6 h-6" />
            </NavItem>
            <NavItem tabName="notifications" activeTab={activeTab} setActiveTab={setActiveTab}>
                <BellIcon className="w-6 h-6" />
            </NavItem>
            <NavItem tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab}>
                <UserIcon className="w-6 h-6" />
            </NavItem>
        </nav>
    );
};

export default BottomNavBar;
