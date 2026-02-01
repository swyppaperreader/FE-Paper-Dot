import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import HeaderModal from "../modal/HeaderModal";
import { useEffect } from "react";
import { getToken } from "@/app/utils/getToken";

export default function Header() {
  const isLogin = false;

  const getTokenList = async () => {
    const token = await getToken();
    console.log(token);
  };

  useEffect(() => {
    getTokenList();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <Image
            src="/Logo.svg"
            alt="Paperdot 로고"
            width={106}
            height={40}
            priority
          />
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
