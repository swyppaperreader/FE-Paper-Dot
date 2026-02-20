"use client";

import React from "react";
import Image from "next/image";
import styles from "./login.module.css";

const OAUTH_BASE = "https://be-paper-dot.store";

export default function LoginPage() {
  /** 로그인 후 돌아올 프론트 주소 (현재 페이지 origin) */
  const returnUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleKakaoLogin = () => {
    const url = new URL(`${OAUTH_BASE}/oauth2/authorization/kakao`);
    if (returnUrl) url.searchParams.set("redirect_uri", returnUrl);
    window.location.href = url.toString();
  };

  const handleGoogleLogin = () => {
    const url = new URL(`${OAUTH_BASE}/oauth2/authorization/google`);
    if (returnUrl) url.searchParams.set("redirect_uri", returnUrl);
    window.location.href = url.toString();
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
          <a
            href="https://www.notion.so/2fbeb2f40de780c5b996fc19312ca446?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.termsLinkText}>
            이용약관
          </a>
          <a
            href="https://www.notion.so/2f4eb2f40de7802f8539e4762234b41d?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.termsLinkText}>
            개인정보처리방침
          </a>
        </div>
      </div>
    </div>
  );
}
