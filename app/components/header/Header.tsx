import Link from "next/link";
import styles from "./header.module.css";
import HeaderLogo from "@/public/Logo.svg";
import IsLoginHeaderComponent from "@/app/components/header/isLogin/IsLoginHeader";

export default function Header() {
  const isLogin = true;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <HeaderLogo />
        </Link>

        {isLogin ? (
          <IsLoginHeaderComponent />
        ) : (
          <Link href="/login" className={styles.button}>
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  );
}
