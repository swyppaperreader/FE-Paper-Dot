"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import styles from "./login.module.css";

function LoginContent() {
  const handleKakaoLogin = () => {
    const url = `https://be-paper-dot.store/oauth2/authorization/kakao`;
    window.location.href = url;
  };

  const handleGoogleLogin = () => {
    const url = `https://be-paper-dot.store/oauth2/authorization/google`;

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}>로딩중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
