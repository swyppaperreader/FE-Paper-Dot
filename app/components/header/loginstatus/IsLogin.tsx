"use client";

import React, { useEffect } from "react";
import HeaderModal from "../../modal/HeaderModal";
import Link from "next/link";
import styles from "../../modal/headerModal.module.css";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://be-paper-dot.store";

export default function IsLogin() {
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const setUserInfoState = useLoginStore((state) => state.setUserInfo);
  const setLogin = useLoginStore((state) => state.setLogin);
  const isLogin = useLoginStore((state) => state.login);

  useEffect(() => {
    const syncSessionFromBackend = async () => {
      try {
        const tokenRes = await fetch(`${API_BASE_URL}/auth/token`, {
          method: "POST",
          credentials: "include",
        });
        if (!tokenRes.ok) {
          return;
        }
        const tokenData = (await tokenRes.json()) as { accessToken?: string };
        if (!tokenData?.accessToken) {
          return;
        }

        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
          },
        });
        if (!userRes.ok) {
          return;
        }

        const userData = (await userRes.json()) as {
          email?: string;
          nickname?: string;
          profileImageUrl?: string;
        };

        setAccessToken(tokenData.accessToken);
        setUserInfoState({
          profileImageUrl: userData.profileImageUrl ?? "",
          nickname: userData.nickname ?? "",
          email: userData.email ?? "",
        });
        setLogin(true);
      } catch (error) {
        console.error("세션 동기화 실패:", error);
      }
    };

    void syncSessionFromBackend();
  }, [setAccessToken, setLogin, setUserInfoState]);

  useEffect(() => {
    if (!isLogin) {
      setLogin(false);
      setAccessToken(null);
      setUserInfoState({
        profileImageUrl: "",
        nickname: "",
        email: "",
      });
      return;
    }

    setLogin(true);
    setAccessToken(null);
    setUserInfoState({
      profileImageUrl: "",
      nickname: "",
      email: "",
    });
  }, [setAccessToken, setLogin, setUserInfoState, isLogin]);

  return (
    <>
      {isLogin ? (
        <HeaderModal
          onLogout={() => {
            setLogin(false);
            setAccessToken(null);
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
