"use client";

import React, { useEffect, useState } from "react";
import HeaderModal from "../../modal/HeaderModal";
import Link from "next/link";
import styles from "../../modal/headerModal.module.css";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";

export default function IsLogin() {
  const [isLogin, setIsLogin] = useState<{ accessToken: string } | null>(null);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const setUserInfoState = useLoginStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch("https://be-paper-dot.store/auth/token", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setIsLogin(data);
      setAccessToken(data.accessToken as string);
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (isLogin?.accessToken) {
      const fetchUserInfo = async () => {
        const response = await fetch("https://be-paper-dot.store/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${isLogin?.accessToken as string}`,
          },
        });
        const data = await response.json();
        console.log("data", data);
        setUserInfoState(data);
      };
      fetchUserInfo();
    }
  }, [isLogin?.accessToken]);

  return (
    <>
      {isLogin?.accessToken ? (
        <HeaderModal
          accessToken={isLogin?.accessToken}
          onLogout={() => {
            setIsLogin(null);
            setUserInfoState({
              profileImageUrl: "",
              nickname: "",
              email: "",
            });
          }}
        />
      ) : (
        <Link href="/login" className={styles.loginLink}>
          로그인/회원가입
        </Link>
      )}
    </>
  );
}
