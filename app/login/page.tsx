"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./login.module.css";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [isClient, setIsClient] = useState(false);
  const hasProcessedCode = useRef(false); // 이중 실행 방지
  const [kakaoToken, setKakaoToken] = useState<string | null>(null);

  const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트 사이드에서만 redirect_uri 결정
  const getRedirectUri = () => {
    if (typeof window === "undefined") return "";
    return window.location.hostname === "localhost"
      ? process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_DEV
      : process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  };

  const handleKakaoLogin = () => {
    const kakaoRedirectUri = getRedirectUri();
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${kakaoRedirectUri}`;
    window.location.href = url;
  };

  const handleGoogleLogin = () => {
    const googleRedirectUri = getRedirectUri();
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(googleRedirectUri!)}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = url;
  };

  // 카카오 토큰 요청
  useEffect(() => {
    if (!code || !isClient || hasProcessedCode.current) return;
    hasProcessedCode.current = true; // 이중 실행 방지

    const fetchToken = async () => {
      const currentRedirectUri = getRedirectUri();
      const res = await fetch(
        `/api/auth/kakao?code=${code}&redirect_uri=${encodeURIComponent(
          currentRedirectUri!
        )}`
      );
      const data = await res.json();
      setKakaoToken(data);
    };

    fetchToken();
  }, [code, isClient]);

  console.log(kakaoToken);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Paperdot</h1>
        <div className={styles.buttonContainer}>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <Image src="/googleLogo.svg" alt="Google" width={20} height={20} />
            Google로 로그인
          </button>
          <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
            <Image src="/kakaoLogo.svg" alt="Kakao" width={20} height={20} />
            카카오로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}>로딩중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
