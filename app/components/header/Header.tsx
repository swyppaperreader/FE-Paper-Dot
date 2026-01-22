import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/login" className={styles.link}>
          Paperdot.
        </Link>
        <Link href="/login" className={styles.button}>
          로그인/회원가입
        </Link>
      </div>
    </header>
  );
}
