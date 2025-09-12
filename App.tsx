import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import GuardianApp from './GuardianApp';
import ElderlyApp from './ElderlyApp';
import { SafeZoneProvider } from './contexts/SafeZoneContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [role, setRole] = useState<'guardian' | 'elderly' | null>(null);
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

    if (loading || authLoading) {
        return <SplashScreen />;
    }

    if (!isAuthenticated) {
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }

    if (!role) {
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }

    if (role === 'guardian') {
        return (
            <DiaryProvider>
                <SafeZoneProvider>
                    <GuardianApp onHeaderClick={handleRoleReset} />
                </SafeZoneProvider>
            </DiaryProvider>
        );
    }

    if (role === 'elderly') {
        return (
            <DiaryProvider>
                <SafeZoneProvider>
                    <ElderlyApp onHeaderClick={handleRoleReset} />
                </SafeZoneProvider>
            </DiaryProvider>
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