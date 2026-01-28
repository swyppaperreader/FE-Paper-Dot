import Link from "next/link";
import styles from "./header.module.css";
import HeaderModal from "../modal/HeaderModal";

export default function Header() {
  const isLogin = true;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          {/* 로고 이미지 자리 */}
          <div className={styles.logo}></div>
          Paperdot.
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
