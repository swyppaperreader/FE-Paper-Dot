"use client";

import React, { useEffect, useState } from "react";
import HeaderModal from "../../modal/HeaderModal";
import Link from "next/link";

export default function IsLogin() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch("https://be-paper-dot.store/users/me", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setIsLogin(data);
    };
    fetchUserInfo();
  }, []);

  console.log(isLogin);

  return <>{isLogin ? <HeaderModal /> : <Link href="/login">로그인</Link>}</>;
}
