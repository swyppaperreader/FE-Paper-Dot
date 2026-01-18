'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    verificationCode?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [currentVerificationCode, setCurrentVerificationCode] = useState<string>('');

  // 랜덤 6자리 숫자 생성
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendVerificationCode = () => {
    if (!email) {
      setErrors({ email: '이메일을 입력해주세요.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: '올바른 이메일 형식이 아닙니다.' });
      return;
    }

    // 새로운 인증번호 생성
    const newCode = generateVerificationCode();
    setCurrentVerificationCode(newCode);
    setIsCodeSent(true);
    setErrors({});

    // 팝업으로 인증번호 표시
    alert(`인증번호가 전송되었습니다.\n\n인증번호: ${newCode}`);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setErrors({ verificationCode: '인증번호를 입력해주세요.' });
      return;
    }

    if (verificationCode === currentVerificationCode) {
      setIsCodeVerified(true);
      setErrors({});
      alert('인증번호가 확인되었습니다.');
    } else {
      setErrors({ verificationCode: '인증번호가 일치하지 않습니다.' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: {
      email?: string;
      verificationCode?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    }

    if (!isCodeVerified) {
      newErrors.verificationCode = '인증번호를 확인해주세요.';
    }

    if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    console.log('Signup:', { email, password });
    alert('회원가입이 완료되었습니다!');
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6]">
      {/* Simple Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-[#558AF0] hover:text-[#1D4084] transition-colors">
            Paperdot.
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen pt-24 pb-20 px-6 sm:px-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                회원가입
              </h1>
              <p className="text-base text-[#737A82] leading-[1.8]">
                Paperdot에 가입하고 무료로 시작하세요
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
                <div className="flex gap-2">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: undefined });
                    }}
                    disabled={isCodeVerified}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 text-[#1A1A1A] text-base ${errors.email
                      ? 'border-red-500'
                      : 'border-[#E1E1E1] focus:border-[#558AF0]'
                      } ${isCodeVerified ? 'bg-gray-100' : ''}`}
                    placeholder="your@email.com"
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isCodeVerified}
                    className="px-4 py-3 bg-[#558AF0] text-white rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isCodeSent ? '재전송' : '인증번호 전송'}
                  </button>
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Verification Code */}
              {isCodeSent && (
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-semibold text-[#1A1A1A] mb-2"
                  >
                    인증번호
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setErrors({ ...errors, verificationCode: undefined });
                      }}
                      disabled={isCodeVerified}
                      maxLength={6}
                      className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 text-[#1A1A1A] text-base ${errors.verificationCode
                        ? 'border-red-500'
                        : 'border-[#E1E1E1] focus:border-[#558AF0]'
                        } ${isCodeVerified ? 'bg-gray-100' : ''}`}
                      placeholder="인증번호 6자리 입력"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isCodeVerified}
                      className="px-4 py-3 bg-[#558AF0] text-white rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isCodeVerified ? '인증완료' : '인증확인'}
                    </button>
                  </div>
                  {errors.verificationCode && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.verificationCode}
                    </p>
                  )}
                  {isCodeVerified && (
                    <p className="mt-2 text-xs text-green-600">
                      ✓ 인증번호가 확인되었습니다.
                    </p>
                  )}
                  {isCodeSent && !isCodeVerified && (
                    <p className="mt-2 text-xs text-[#737A82]">
                      팝업 창에서 확인한 인증번호를 입력해주세요.
                    </p>
                  )}
                </div>
              )}

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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined });
                  }}
                  minLength={8}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 text-[#1A1A1A] text-base ${errors.password
                    ? 'border-red-500'
                    : 'border-[#E1E1E1] focus:border-[#558AF0]'
                    }`}
                  placeholder="8자 이상 입력해주세요"
                />
                {errors.password ? (
                  <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                ) : (
                  <p className="mt-2 text-xs text-[#737A82]">
                    비밀번호는 8자 이상이어야 합니다.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#1A1A1A] mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 text-[#1A1A1A] text-base ${errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-[#E1E1E1] focus:border-[#558AF0]'
                    }`}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#558AF0] border-[#E1E1E1] rounded focus:ring-[#558AF0]"
                  />
                  <span className="ml-2 text-sm text-[#737A82] leading-[1.8]">
                    <Link
                      href="/terms"
                      className="text-[#558AF0] hover:text-[#1D4084] transition-colors duration-300"
                    >
                      이용약관
                    </Link>
                    과{' '}
                    <Link
                      href="/privacy"
                      className="text-[#558AF0] hover:text-[#1D4084] transition-colors duration-300"
                    >
                      개인정보처리방침
                    </Link>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isCodeVerified || !agreed}
                className="w-full bg-[#558AF0] text-white py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                회원가입
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#737A82]">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/login"
                  className="text-[#558AF0] hover:text-[#1D4084] font-semibold transition-colors duration-300"
                >
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
