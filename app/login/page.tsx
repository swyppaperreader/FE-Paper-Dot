"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import styles from "./login.module.css";

export default function LoginPage() {
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_DEV;

  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&scope=profile_nickname&prompt=consent`;
    window.location.href = url;
  };

  const handleGoogleLogin = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;

    window.location.href = url;
  };

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
