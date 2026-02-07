"use client";

import React from "react";
import Image from "next/image";
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  // const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  // const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  const handleKakaoLogin = async () => {
    window.location.href =
      "https://be-paper-dot.store/oauth2/authorization/kakao";
  };

  const handleGoogleLogin = () => {
    const url = `https://be-paper-dot.store/oauth2/authorization/google`;

    window.location.href = url;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/LoginLogo.svg"
          alt="Paperdot"
          width={314}
          height={110}
          className={styles.logo}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <Image src="/googleLogo.svg" alt="Google" width={20} height={20} />
            구글로 시작하기
          </button>
          <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
            <Image src="/kakaoLogo.svg" alt="Kakao" width={20} height={20} />
            카카오로 시작하기
          </button>
        </div>
        <div className={styles.termsContainer}>
          <p className={styles.termsText}>
            로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
          <Link href="/" className={styles.termsLinkText}>
            이용약관
          </Link>
          <Link href="/" className={styles.termsLinkText}>
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
