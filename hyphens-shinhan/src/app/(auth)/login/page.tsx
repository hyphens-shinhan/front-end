'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-8 text-center">Hyphen 로그인</h1>
            <form onSubmit={handleLogin} className="w-full space-y-4">
                <input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                    {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
}