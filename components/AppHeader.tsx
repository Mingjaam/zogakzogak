import React from 'react';
import PuzzleLogo from './icons/PuzzleLogo';
import NotificationBellIcon from './icons/NotificationBellIcon';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  title: string;
  onTitleClick?: () => void;
  onNotificationClick?: () => void;
  showLogout?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onTitleClick, onNotificationClick, showLogout = false }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 w-full">
        <button onClick={onTitleClick} className="flex items-center gap-2 cursor-pointer p-1 -ml-1 rounded-md hover:bg-gray-100 transition-colors">
            <PuzzleLogo className="w-8 h-8"/>
            <h1 className="text-lg font-bold text-gray-700">{title}</h1>
        </button>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.name}님
            </span>
          )}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              로그아웃
            </button>
          )}
          <button 
              onClick={onNotificationClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" 
              aria-label="알림 보기"
          >
              <NotificationBellIcon className="w-6 h-6 text-gray-500" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
    </header>
  );
};

export default AppHeader;