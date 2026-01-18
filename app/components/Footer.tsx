import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* 1줄: 로고 + 회사명 */}
        <div className={styles.logoSection}>
          <div className={styles.logoBadge}>
            <span className={styles.logoText}>PD</span>
          </div>
          <span className={styles.companyName}>Paperdot.</span>
        </div>

        {/* 2줄: 링크 | 저작권 | 이메일 */}
        <div className={styles.contentSection}>

          {/* 왼쪽: 개인정보처리방침 | 이용약관 */}
          <div className={styles.linkGroup}>
            <Link href="/privacy" className={styles.link}>
              개인정보처리방침
            </Link>
            <span className={styles.divider}>·</span>
            <Link href="/terms" className={styles.link}>
              이용약관
            </Link>
          </div>

          {/* 중앙: Copyright */}
          <div className={styles.copyrightSection}>
            <p className={styles.copyright}>
              © 2026 paperdot. All rights reserved.
            </p>
          </div>

          {/* 오른쪽: 문의 이메일 */}
          <div className={styles.emailSection}>
            <a
              href="mailto:olola9791@gmail.com"
              className={styles.email}
            >
              문의: olola9791@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
