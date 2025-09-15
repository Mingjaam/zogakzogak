
import React, { useState } from 'react';
import api from '../lib/api-services';
import PuzzleLogo from './icons/PuzzleLogo';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    number: string;
    role: 'SENIOR' | 'GUARDIAN';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        number: '',
        role: 'SENIOR'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (!loginData.email || !loginData.password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            console.log('로그인 시도:', loginData);
            
            // 기존 토큰 제거 (문제가 있는 토큰일 수 있음)
            localStorage.removeItem('authToken');
            console.log('기존 토큰 제거됨');
            
            // 요청 데이터를 안전하게 처리
            const safeLoginData = {
                email: loginData.email.trim(),
                password: loginData.password.trim()
            };
            
            const result = await api.auth.login(safeLoginData);
            console.log('로그인 응답 전체:', result);
            console.log('로그인 응답 타입:', typeof result);
            console.log('로그인 응답 키들:', Object.keys(result || {}));
            console.log('로그인 응답 값:', result);
            console.log('로그인 응답 길이:', result?.length);
            
            // 로그인 성공 처리
            if (result) {
                // 문자열인 경우 (성공 메시지)
                if (typeof result === 'string') {
                    if (result.includes('성공') || result.includes('완료') || result.includes('success')) {
                        console.log('로그인 성공 메시지:', result);
                        // 임시 토큰 생성 (실제로는 서버에서 토큰을 받아야 함)
                        const tempToken = `temp_token_${Date.now()}`;
                        localStorage.setItem('authToken', tempToken);
                        console.log('임시 토큰 저장:', tempToken);
                        onLoginSuccess();
                    } else {
                        // 토큰으로 사용
                        localStorage.setItem('authToken', result);
                        console.log('토큰 저장:', result);
                        onLoginSuccess();
                    }
                } else if (result.data) {
                    localStorage.setItem('authToken', result.data);
                    console.log('토큰 저장:', result.data);
                    onLoginSuccess();
                } else if (result.token) {
                    localStorage.setItem('authToken', result.token);
                    console.log('토큰 저장:', result.token);
                    onLoginSuccess();
                } else if (result.accessToken) {
                    localStorage.setItem('authToken', result.accessToken);
                    console.log('토큰 저장:', result.accessToken);
                    onLoginSuccess();
                } else {
                    console.error('예상치 못한 응답 형식:', result);
                    alert('로그인 응답 형식을 인식할 수 없습니다.');
                }
            } else {
                console.error('로그인 응답이 비어있습니다:', result);
                alert('로그인 응답이 비어있습니다.');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            console.error('로그인 실패 상세:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            
            if (error.response?.status === 403) {
                alert('로그인이 거부되었습니다. 이메일과 비밀번호를 확인해주세요.');
            } else if (error.response?.status === 401) {
                alert('인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            } else {
                alert(`로그인에 실패했습니다: ${error.message}`);
            }
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

        try {
            console.log('회원가입 시도:', registerData);
            const result = await api.auth.register(registerData);
            console.log('회원가입 성공:', result);
            
            alert('회원가입이 완료되었습니다!');
            handleBackToLogin();
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof RegisterData, value: string) => {
        setRegisterData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLoginInputChange = (field: keyof typeof loginData, value: string) => {
        setLoginData(prev => ({
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
                            <form className="space-y-5">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="이메일"
                                        value={loginData.email}
                                        onChange={(e) => handleLoginInputChange('email', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={loginData.password}
                                        onChange={(e) => handleLoginInputChange('password', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleLoginClick}
                                        disabled={isLoading}
                                        className="w-full py-4 text-lg font-bold text-white bg-[#70c18c] rounded-full hover:bg-[#5da576] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70c18c] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isLoading ? '로그인 중...' : '로그인'}
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
                                <div>
                                    <input
                                        type="text"
                                        placeholder="이름"
                                        value={registerData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="이메일"
                                        value={registerData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={registerData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="전화번호"
                                        value={registerData.number}
                                        onChange={(e) => handleInputChange('number', e.target.value)}
                                        className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-2">역할 선택</div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('role', 'SENIOR')}
                                            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                                registerData.role === 'SENIOR'
                                                    ? 'bg-[#70c18c] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            어르신
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('role', 'GUARDIAN')}
                                            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                                registerData.role === 'GUARDIAN'
                                                    ? 'bg-[#70c18c] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
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
