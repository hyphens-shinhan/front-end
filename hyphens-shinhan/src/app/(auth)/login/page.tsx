'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';

const REDIRECT_URL = 'https://shinhan-hyphen.vercel.app/login?redirect=%2F';

const LOGIN_CARDS = [
  {
    label: 'YB 회원',
    email: 'minjun.kim@shsf.com',
    password: 'password123',
    role: 'yb',
    accent: 'bg-[#EEF2FF] text-[#3730A3]',
  },
  {
    label: 'YB 팀장',
    email: 'comet@shsf.com',
    password: 'password123',
    role: 'yb (팀장)',
    accent: 'bg-[#ECFEFF] text-[#155E75]',
  },
  {
    label: '멘토',
    email: 'douglas.han@shsf.com',
    password: 'password123',
    role: 'mentor',
    accent: 'bg-[#FEF9C3] text-[#854D0E]',
  },
  {
    label: '관리자',
    role: 'admin',
    accent: 'bg-[#EFF6FF] text-[#1D4ED8]',
    redirectUrl: REDIRECT_URL,
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMutation.isPending) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-start items-stretch">
          {/* Left: logo + subtitle + quick login cards */}
          <div className="flex-1">
            <div className="mb-6 text-center lg:text-left">
              <img
                src="/assets/images/headerlogo.png"
                alt="신한장학재단"
                className="h-10 w-auto mb-4 block mx-auto lg:mx-0"
              />
              <p className="text-sm font-light text-gray-600 mb-1">로그인하여 계속하세요</p>
              <p className="text-xs font-light text-gray-500">
                아래 테스트 계정을 클릭하면 자동으로 로그인됩니다.
              </p>
            </div>

            {loginMutation.isError && (
              <div className="mb-4 max-w-xs mx-auto lg:mx-0 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-light">
                {loginMutation.error?.message ?? '로그인에 실패했습니다.'}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-xs mx-auto lg:mx-0">
              {LOGIN_CARDS.map((item) => (
                <button
                  key={'redirectUrl' in item ? item.label : item.email}
                  type="button"
                  onClick={() => {
                    if (loginMutation.isPending) return;
                    if ('redirectUrl' in item && typeof item.redirectUrl === 'string') {
                      window.location.href = item.redirectUrl;
                      return;
                    }
                    loginMutation.mutate({ email: item.email, password: item.password });
                  }}
                  disabled={loginMutation.isPending}
                  className="text-left border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Right: login form — same design system as hyphens-frontend */}
          <div className="w-full max-w-md lg:max-w-sm lg:ml-auto">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-1">
                  이메일 주소
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                  disabled={loginMutation.isPending}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  disabled={loginMutation.isPending}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light placeholder:text-gray-400"
                />
              </div>
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
