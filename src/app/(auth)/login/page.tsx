'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';

const QUICK_LOGIN_CARDS = [
    {
        label: 'YB 팀장',
        email: 'test1@example.com',
        password: 'password123',
        role: 'yb (팀장)',
        accent: 'bg-[#ECFEFF] text-[#155E75]',
    },
    {
        label: 'YB 회원',
        email: 'test2@example.com',
        password: 'password123',
        role: 'yb',
        accent: 'bg-[#EEF2FF] text-[#3730A3]',
    },
] as const;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();
    const errorMessage =
        loginMutation.error instanceof Error ? loginMutation.error.message : null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    const handleQuickLogin = (cardEmail: string, cardPassword: string) => {
        if (loginMutation.isPending) return;
        setEmail(cardEmail);
        setPassword(cardPassword);
        loginMutation.mutate({ email: cardEmail, password: cardPassword });
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col lg:flex-row gap-10 lg:items-start items-stretch">
                    {/* Left: title + quick login cards */}
                    <div className="flex-1">
                        <div className="mb-6 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                <img
                                    src="/assets/images/headerlogo.png"
                                    alt="장학금 플랫폼"
                                    className="h-10 w-auto"
                                />
                            </div>
                            <p className="text-sm font-light text-gray-600 mb-1">
                                로그인하여 계속하세요
                            </p>
                            <p className="text-xs font-light text-gray-500">
                                아래 테스트 계정을 클릭하면 자동으로 로그인됩니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-xs mx-auto lg:mx-0">
                            {QUICK_LOGIN_CARDS.map((item) => (
                                <button
                                    key={item.email}
                                    type="button"
                                    onClick={() =>
                                        handleQuickLogin(item.email, item.password)
                                    }
                                    className="text-left border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loginMutation.isPending}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.label}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-[10px] font-medium ${item.accent}`}
                                        >
                                            {item.role}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: regular login form */}
                    <div className="w-full max-w-md lg:max-w-sm lg:ml-auto">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-light text-gray-700 mb-1"
                                >
                                    사용자 ID 또는 이메일
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light"
                                    placeholder="사용자 ID 또는 이메일을 입력하세요"
                                    disabled={loginMutation.isPending}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-light text-gray-700 mb-1"
                                >
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light"
                                    placeholder="비밀번호를 입력하세요"
                                    disabled={loginMutation.isPending}
                                />
                            </div>

                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-light">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-light hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loginMutation.isPending ? '로그인 중...' : '로그인'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}