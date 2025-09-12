import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, tokenStorage, userStorage } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 인증 정보 복원
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = userStorage.get();
        const savedToken = tokenStorage.get();
        
        if (savedUser && savedToken) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('인증 정보 복원 실패:', error);
        // 저장된 정보가 손상된 경우 삭제
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    userStorage.set(userData);
    tokenStorage.set(token);
  };

  const logout = () => {
    setUser(null);
    userStorage.remove();
    tokenStorage.remove();
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    userStorage.set(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
