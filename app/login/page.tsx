'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6]">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-32 pb-20 px-6 sm:px-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                로그인
              </h1>
              <p className="text-base text-[#737A82] leading-[1.8]">
                Paperdot 계정으로 로그인하세요
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1A1A1A] mb-2"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#E1E1E1] rounded-lg focus:outline-none focus:border-[#558AF0] transition-colors duration-300 text-[#1A1A1A] text-base"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1A1A1A] mb-2"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#E1E1E1] rounded-lg focus:outline-none focus:border-[#558AF0] transition-colors duration-300 text-[#1A1A1A] text-base"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#558AF0] border-[#E1E1E1] rounded focus:ring-[#558AF0]"
                  />
                  <span className="ml-2 text-sm text-[#737A82]">
                    로그인 상태 유지
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#558AF0] hover:text-[#1D4084] transition-colors duration-300"
                >
                  비밀번호 찾기
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#558AF0] text-white py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                로그인
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#737A82]">
                계정이 없으신가요?{' '}
                <Link
                  href="/signup"
                  className="text-[#558AF0] hover:text-[#1D4084] font-semibold transition-colors duration-300"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
