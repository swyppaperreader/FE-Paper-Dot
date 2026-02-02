import Link from "next/link";
import styles from "./header.module.css";
import HeaderLogo from "@/public/Logo.svg";
import IsLogin from "@/app/components/header/loginstatus/IsLogin";

export default function Header() {
  // const isLogin = true;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <HeaderLogo />
        </Link>

        <IsLogin />
      </div>
    </header>
  );
}
