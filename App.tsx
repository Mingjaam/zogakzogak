import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import GuardianApp from './GuardianApp';
import ElderlyApp from './ElderlyApp';

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [role, setRole] = useState<'guardian' | 'elderly' | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Show splash screen for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    
    const handleRoleSelect = (selectedRole: 'guardian' | 'elderly') => {
        setRole(selectedRole);
    };

    const handleRoleReset = () => {
        setRole(null);
    };

    if (loading) {
        return <SplashScreen />;
    }

    if (!isLoggedIn) {
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }

    if (!role) {
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }

    if (role === 'guardian') {
        return <GuardianApp onHeaderClick={handleRoleReset} />;
    }

    if (role === 'elderly') {
        return <ElderlyApp onHeaderClick={handleRoleReset} />;
    }

    // Fallback just in case
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl">Please select a role.</h1>
        </div>
    );
};

export default App;