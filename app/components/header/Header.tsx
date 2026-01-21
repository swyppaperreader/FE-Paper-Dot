import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          Paperdot.
        </Link>
        <button className={styles.button}>로그인/회원가입</button>
      </div>
    </header>
  );
}
