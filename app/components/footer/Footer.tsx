// Footer.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 1줄: 로고 */}
        <div className={styles.logoSection}>
          <Image
            src="/paperdotlogo-M.png"          // ← 실제 파일명에 맞게 수정
            alt="Paperdot 로고"
            width={212}
            height={80}
            className={styles.logoImage}
            priority
          />
        </div>

        {/* 2줄: 링크 | 저작권 | 이메일 */}
        <div className={styles.contentSection}>
          <div className={styles.linkGroup}>
            <Link href="/privacy" className={styles.link}>
              개인정보처리방침
            </Link>
            <span className={styles.divider}>|</span>
            <Link href="/terms" className={styles.link}>
              이용약관
            </Link>
          </div>

          <div className={styles.copyrightSection}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} paperdot. All rights reserved.
            </p>
          </div>

          <div className={styles.emailSection}>
            <a href="mailto:olola9791@gmail.com" className={styles.email}>
              문의: olola9791@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}