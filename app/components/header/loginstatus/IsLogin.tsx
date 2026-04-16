"use client";

import { useEffect } from "react";
import HeaderModal from "../../modal/HeaderModal";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";

export default function IsLogin() {
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const setUserInfoState = useLoginStore((state) => state.setUserInfo);
  const setLogin = useLoginStore((state) => state.setLogin);

  useEffect(() => {
    const syncSupabaseUser = async () => {
      try {
        const userRes = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const data = (await userRes.json()) as {
          user?: {
            email?: string;
            id?: string;
            user_metadata?: {
              name?: string;
              avatar_url?: string;
              profileImageUrl?: string;
            };
          } | null;
        };

        if (!userRes.ok || !data.user) {
          setLogin(false);
          setAccessToken(null);
          setUserInfoState({
            userId: "",
            profileImageUrl: "",
            nickname: "",
            email: "",
          });
          return;
        }

        const metadata = data.user.user_metadata ?? {};
        setUserInfoState({
          profileImageUrl:
            metadata.profileImageUrl ?? metadata.avatar_url ?? "",
          nickname: metadata.name ?? "",
          email: data.user.email ?? "",
          userId: data.user.id ?? "",
        });
        setAccessToken(null);
        setLogin(true);
      } catch (error) {
        console.error("Supabase 유저 동기화 실패:", error);
      }
    };

    syncSupabaseUser();
  }, [setAccessToken, setLogin, setUserInfoState]);

  return <HeaderModal />;
}
