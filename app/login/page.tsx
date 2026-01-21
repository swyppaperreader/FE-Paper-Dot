"use client";

import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import GoogleIcon from "@/public/googleLogo.svg";
import KakaoIcon from "@/public/kakaoLogo.svg";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  const [res, setRes] = useState(null);

  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
    window.location.href = url;
  };

  const handleGoogleLogin = () => {
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirect_uri!)}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = url;
  };

  // useEffect(() => {
  //   if (!code) return;

  //   const fetchToken = async () => {
  //     const res = await fetch(`/api/auth/google?code=${code}`);
  //     const data = await res.json();
  //     console.log("구글 토큰:", data);
  //   };

  //   fetchToken();
  // }, []);

  //카카오는 우선 엑세스 토큰만 받기로
  useEffect(() => {
    if (!code) return;

    const fetchToken = async () => {
      const res = await fetch(`/api/auth/kakao?code=${code}`);
      const data = await res.json();
      console.log("카카오 토큰:", data);
    };

    fetchToken();
  }, [code]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Paperdot</h1>
        <div className={styles.buttonContainer}>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <GoogleIcon /> Google로 로그인
          </button>
          <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
            <KakaoIcon /> 카카오로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
