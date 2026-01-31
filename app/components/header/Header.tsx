import Link from "next/link";
import Image from "next/image";               // ← 여기서 가져와야 함
import styles from "./header.module.css";
import HeaderModal from "../modal/HeaderModal";

export default function Header() {
  const isLogin = true;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <div className={styles.logo}>
            <Image
              src="/paperdotlogo-S.png"       // public 바로 아래 → 이렇게
              alt="Paperdot 로고"
              width={106}
              height={40}
              priority                        // 좋음 (LCP 개선에 도움)
            />
          </div>

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