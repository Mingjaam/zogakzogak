import React from 'react';
import PuzzleLogo from './icons/PuzzleLogo';
import NotificationBellIcon from './icons/NotificationBellIcon';

interface AppHeaderProps {
  title: string;
  onTitleClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onTitleClick }) => {
  return (
    <header className="bg-[#f9f8f4] p-4 flex justify-between items-center sticky top-0 z-10 w-full">
        <button onClick={onTitleClick} className="flex items-center gap-2 cursor-pointer p-1 -ml-1 rounded-md hover:bg-gray-100 transition-colors">
            <PuzzleLogo className="w-8 h-8"/>
            <h1 className="text-lg font-bold text-gray-700">{title}</h1>
        </button>
        <button className="relative p-2" aria-label="알림 보기">
            <NotificationBellIcon className="w-6 h-6 text-gray-500" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
    </header>
  );
};

export default AppHeader;