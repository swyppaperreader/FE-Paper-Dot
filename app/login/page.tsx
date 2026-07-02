import Image from "next/image";
import Link from "next/link";
import styles from "@/app/login/login.module.css";
import LoginButton from "@/app/components/common/button/LoginButton";
import { TERMS } from "@/app/constants/term";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/LoginLogo.svg"
          alt="Paperdot"
          width={314}
          height={110}
          className={styles.logo}
        />
        <div className={styles.buttonContainer}>
          <LoginButton />
        </div>
        <div className={styles.termsContainer}>
          <p className={styles.termsText}>
            로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
          {TERMS.map((term) => (
            <Link
              key={term.title}
              href={term.href}
              target={term.target}
              rel={term.rel}
              className={term.className}>
              {term.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
