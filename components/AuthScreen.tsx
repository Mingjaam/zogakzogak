
import React from 'react';
import PuzzleLogo from './icons/PuzzleLogo';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onLoginSuccess();
    };

    return (
        <main className="bg-[#f9f8f4] min-h-screen w-screen flex flex-col items-center justify-center p-4 antialiased">
            <div className="w-full max-w-sm mx-auto">
                <div className="flex flex-col items-center text-center mb-8">
                    <img src="http://imgur.com/O0Z5u8g.png" alt="조각조각 로고" className="w-45 h-40" />
                    <h1 className="text-4xl font-extrabold text-[#3e8e5a] mt-4">조각조각</h1>
                    <p className="text-md text-[#6a9f7e] mt-1">소중한 순간을 담는 추억기록 APP</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg w-full">
                    <form className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="아이디"
                                className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#70c18c] transition-shadow"
                            />
                        </div>
                        <div className="text-center text-sm text-gray-500 pt-1">
                            <a href="#" className="hover:underline">아이디 찾기</a>
                            <span className="mx-2">|</span>
                            <a href="#" className="hover:underline">비밀번호 찾기</a>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleLoginClick}
                                className="w-full py-4 text-lg font-bold text-white bg-[#70c18c] rounded-full hover:bg-[#5da576] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70c18c] transition-all duration-300 transform hover:scale-105"
                            >
                                로그인
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            아직 가입 안하셨나요? <a href="#" className="font-semibold text-[#3e8e5a] hover:underline">회원가입</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AuthScreen;
