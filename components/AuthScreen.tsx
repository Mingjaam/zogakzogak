
import React, { useState } from 'react';
import PuzzleLogo from './icons/PuzzleLogo';
import { registerUser, loginUser, RegisterRequest, LoginRequest, decodeJWT } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

interface LoginData {
    email: string;
    password: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState<RegisterRequest>({
        name: '',
        email: '',
        password: '',
        number: '',
        role: 'SENIOR'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await loginUser(loginData);
            
            if (response.success && response.data) {
                console.log('로그인 응답 데이터:', response.data);
                
                // JWT 토큰에서 사용자 정보 추출
                if (response.data.accessToken) {
                    const tokenData = decodeJWT(response.data.accessToken);
                    console.log('JWT 토큰 데이터:', tokenData);
                    
                    if (tokenData && tokenData.sub && tokenData.role) {
                        // JWT에서 추출한 정보로 사용자 객체 생성
                        const user = {
                            id: tokenData.sub, // 이메일을 ID로 사용
                            name: tokenData.sub.split('@')[0], // 이메일에서 이름 추출
                            email: tokenData.sub,
                            number: '', // JWT에 없으므로 빈 문자열
                            role: tokenData.role as 'SENIOR' | 'GUARDIAN',
                            createdAt: new Date(tokenData.iat * 1000).toISOString()
                        };
                        
                        console.log('생성된 사용자 객체:', user);
                        
                        // AuthContext를 통해 로그인 처리
                        login(user, response.data.accessToken);
                        
                        // 로그인 성공 상태 설정
                        setLoginSuccess(true);
                        
                        // 로그인 성공 메시지 표시
                        const roleText = user.role === 'SENIOR' ? '어르신' : '보호자';
                        alert(`${user.name}님, ${roleText}으로 로그인되었습니다!`);
                        
                        // 잠시 후 메인 화면으로 이동
                        setTimeout(() => {
                            onLoginSuccess();
                        }, 1000);
                    } else {
                        console.error('JWT 토큰 데이터 불완전:', tokenData);
                        setErrorMessage('토큰에서 사용자 정보를 추출할 수 없습니다.');
                    }
                } else {
                    console.error('응답에 accessToken이 없습니다:', response.data);
                    setErrorMessage('로그인 응답에 토큰이 없습니다.');
                }
            } else {
                setErrorMessage(response.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterClick = () => {
        setIsLoginMode(false);
        // 위로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToLogin = () => {
        setIsLoginMode(true);
        setErrorMessage('');
        setRegisterData({
            name: '',
            email: '',
            password: '',
            number: '',
            role: 'SENIOR'
        });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await registerUser(registerData);
            
            if (response.success) {
                alert('회원가입이 완료되었습니다!');
                handleBackToLogin();
            } else {
                setErrorMessage(response.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginInputChange = (field: keyof LoginData, value: string) => {
        setLoginData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegisterInputChange = (field: keyof RegisterRequest, value: string) => {
        setRegisterData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const playStartupSound = () => {
        try {
            const audio = new Audio(`${import.meta.env.BASE_URL}sounds/startup.mp3`);
            audio.play().catch(error => {
                console.log('사운드 재생 실패:', error);
            });
        } catch (error) {
            console.log('사운드 재생 오류:', error);
        }
    };

    return (
        <main className="bg-white min-h-screen w-screen flex flex-col items-center justify-center p-4 antialiased">
            <div className="w-full max-w-sm mx-auto">
                {isLoginMode ? (
                    <>
                        <div className="flex flex-col items-center text-center mb-8">
                            <img 
                                src="http://imgur.com/O0Z5u8g.png" 
                                alt="조각조각 로고" 
                                className="w-45 h-40 cursor-pointer hover:scale-105 transition-transform select-none" 
                                onClick={playStartupSound}
                            />
                            <h1 className="text-4xl font-extrabold text-[#3e8e5a] mt-4">조각조각</h1>
                            <p className="text-md text-[#6a9f7e] mt-1">소중한 순간을 담는 추억기록 APP</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg w-full">
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                {errorMessage && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {errorMessage}
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="이메일"
                                        value={loginData.email}
                                        onChange={(e) => handleLoginInputChange('email', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={loginData.password}
                                        onChange={(e) => handleLoginInputChange('password', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || loginSuccess}
                                        className="w-full py-4 text-lg font-bold text-white bg-[#70c18c] rounded-full hover:bg-[#5da576] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70c18c] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loginSuccess ? '로그인 성공!' : isLoading ? '로그인 중...' : '로그인'}
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-500">
                                    아직 가입 안하셨나요? <button onClick={handleRegisterClick} className="font-semibold text-[#3e8e5a] hover:underline">회원가입</button>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center text-center mb-8">
                            <h1 className="text-4xl font-extrabold text-[#3e8e5a] mt-4">조각조각</h1>
                            <p className="text-md text-[#6a9f7e] mt-1">소중한 순간을 담는 추억기록 APP</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg w-full">
                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                {errorMessage && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {errorMessage}
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="이름"
                                        value={registerData.name}
                                        onChange={(e) => handleRegisterInputChange('name', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="이메일"
                                        value={registerData.email}
                                        onChange={(e) => handleRegisterInputChange('email', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={registerData.password}
                                        onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="전화번호"
                                        value={registerData.number}
                                        onChange={(e) => handleRegisterInputChange('number', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">역할 선택</p>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleRegisterInputChange('role', 'SENIOR')}
                                            className={`flex-1 py-4 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex flex-col items-center gap-2 ${
                                                registerData.role === 'SENIOR'
                                                    ? 'bg-white text-gray-700 border-2 border-[#70c18c]'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                            }`}
                                        >
                                            <img 
                                                src="https://i.imgur.com/cZe1BTZ.png" 
                                                alt="어르신" 
                                                className="w-8 h-8 object-contain" 
                                            />
                                            어르신
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRegisterInputChange('role', 'GUARDIAN')}
                                            className={`flex-1 py-4 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex flex-col items-center gap-2 ${
                                                registerData.role === 'GUARDIAN'
                                                    ? 'bg-white text-gray-700 border-2 border-[#70c18c]'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                            }`}
                                        >
                                            <img 
                                                src="https://i.imgur.com/RjrEbYa.png" 
                                                alt="보호자" 
                                                className="w-8 h-8 object-contain" 
                                            />
                                            보호자
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="flex-1 py-4 text-lg font-bold text-[#3e8e5a] bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 text-lg font-bold text-white bg-[#70c18c] rounded-full hover:bg-[#5da576] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70c18c] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? '가입 중...' : '회원가입'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default AuthScreen;
