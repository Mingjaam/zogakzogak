import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import ConnectionScreen from './components/ConnectionScreen';
import GuardianApp from './GuardianApp';
import ElderlyApp from './ElderlyApp';
import { SafeZoneProvider } from './contexts/SafeZoneContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SharedDataProvider } from './contexts/SharedDataContext';
import { checkConnectionStatus } from './lib/api';

const AppContent: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [role, setRole] = useState<'guardian' | 'elderly' | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
    const { isAuthenticated, isLoading: authLoading, user } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Show splash screen for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleLoginSuccess = () => {
        // 로그인 성공은 AuthContext에서 처리됨
        // 사용자 역할에 따라 자동으로 적절한 화면으로 이동
        console.log('로그인 성공, 사용자 역할에 따른 화면 전환 시작');
    };
    
    const handleRoleSelect = (selectedRole: 'guardian' | 'elderly') => {
        setRole(selectedRole);
    };

    const handleRoleReset = () => {
        setRole(null);
        setIsConnected(null);
    };

    const handleConnectionUpdate = () => {
        setIsConnected(null); // 연결 상태 다시 확인
    };

    // 사용자 역할에 따라 자동으로 역할 설정
    useEffect(() => {
        if (user && !role) {
            console.log('사용자 정보:', user);
            if (user.role === 'GUARDIAN') {
                console.log('보호자 역할로 설정');
                setRole('guardian');
            } else if (user.role === 'SENIOR') {
                console.log('어르신 역할로 설정');
                setRole('elderly');
            }
        }
    }, [user, role]);

    // 연결 상태 확인 (현재는 자동으로 연결된 것으로 가정)
    useEffect(() => {
        if (isAuthenticated && user && role && isConnected === null) {
            // 현재는 모든 사용자가 자동으로 연결된 것으로 가정
            setIsConnected(true);
            console.log('자동 연결 완료');
        }
    }, [isAuthenticated, user, role, isConnected]);

    if (loading || authLoading) {
        return <SplashScreen />;
    }

    if (!isAuthenticated) {
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }

    if (!role) {
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }

    // 연결 상태 확인 중
    if (isCheckingConnection) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70c18c] mx-auto mb-4"></div>
                    <p className="text-gray-600">연결 상태를 확인하는 중...</p>
                </div>
            </div>
        );
    }

    // 연결되지 않은 경우 연결 화면 표시
    if (isConnected === false) {
        return <ConnectionScreen onConnectionUpdate={handleConnectionUpdate} />;
    }

    if (role === 'guardian') {
        return (
            <SharedDataProvider>
                <DiaryProvider>
                    <SafeZoneProvider>
                        <GuardianApp onHeaderClick={handleRoleReset} />
                    </SafeZoneProvider>
                </DiaryProvider>
            </SharedDataProvider>
        );
    }

    if (role === 'elderly') {
        return (
            <SharedDataProvider>
                <DiaryProvider>
                    <SafeZoneProvider>
                        <ElderlyApp onHeaderClick={handleRoleReset} />
                    </SafeZoneProvider>
                </DiaryProvider>
            </SharedDataProvider>
        );
    }

    // Fallback just in case
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl">Please select a role.</h1>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;