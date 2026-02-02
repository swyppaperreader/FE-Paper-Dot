import Link from "next/link";
import styles from "./header.module.css";
import HeaderLogo from "@/public/Logo.svg";
import IsLoginHeader from "./isLogin/isLoginHeader";

export default function Header() {
  const isLogin = false;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <HeaderLogo />
        </Link>

        {isLogin ? (
          <IsLoginHeader />
        ) : (
          <Link href="/login" className={styles.button}>
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  );
}
