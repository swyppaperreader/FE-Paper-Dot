"use client";

import Link from "next/link";
import styles from "./header.module.css";
import HeaderModal from "../modal/HeaderModal";
import HeaderLogo from "@/public/Logo.svg";
import { useEffect } from "react";

export default function Header() {
  const isLogin = false;

  useEffect(() => {
    fetch("https://be-paper-dot.store/users/me", {
      credentials: "include",
    });
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <HeaderLogo />
        </Link>

        {isLogin ? (
          <HeaderModal />
        ) : (
          <Link href="/login" className={styles.button}>
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  );
}
